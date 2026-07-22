/* ================================================================
   Worship Gift — Rate limiting (fenêtre glissante en mémoire)

   ⚠️ Limite : en environnement serverless (Vercel), la mémoire n'est
   pas partagée entre instances/invocations. Ça bloque les rafales sur
   une même instance « chaude » mais n'est PAS une protection
   distribuée. Pour du robuste : Upstash Redis / Vercel KV.
   ================================================================ */

import { NextRequest, NextResponse } from "next/server";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/** Récupère une IP raisonnable depuis les en-têtes (Vercel/proxy). */
export function getClientIp(request: NextRequest): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

/**
 * Renvoie true si la requête dépasse la limite.
 * @param key    identifiant (ex: `orders:${ip}`)
 * @param limit  nombre max de requêtes dans la fenêtre
 * @param windowMs durée de la fenêtre en ms
 */
export function isRateLimited(
  key: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  bucket.count += 1;
  return bucket.count > limit;
}

function tooMany(windowMs: number): NextResponse {
  return NextResponse.json(
    { success: false, error: "Trop de requêtes. Réessaie dans un instant." },
    { status: 429, headers: { "Retry-After": String(Math.ceil(windowMs / 1000)) } },
  );
}

/**
 * Helper synchrone (mémoire locale). Conservé pour compatibilité.
 * Préférer `rateLimitAsync` (distribué) sur les routes critiques.
 */
export function rateLimit(
  request: NextRequest,
  name: string,
  limit: number,
  windowMs: number,
): NextResponse | null {
  const ip = getClientIp(request);
  if (isRateLimited(`${name}:${ip}`, limit, windowMs)) return tooMany(windowMs);
  return null;
}

/* ================================================================
   Rate limiting DISTRIBUÉ (Upstash Redis via API REST, sans SDK)

   - Si UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN sont définis,
     le comptage est partagé entre TOUTES les instances serverless →
     protection réelle sous forte charge / rafales distribuées.
   - Sinon, repli automatique sur le compteur en mémoire locale.
   - En cas d'erreur réseau Redis : on « fail open » (on ne bloque pas
     un visiteur légitime à cause d'une panne d'infra) puis repli mémoire.
   ================================================================ */

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const upstashEnabled = Boolean(UPSTASH_URL && UPSTASH_TOKEN);

/** INCR + EXPIRE(NX) atomiques via le pipeline REST. Renvoie le compteur, ou null si indisponible. */
async function upstashIncr(key: string, windowSec: number): Promise<number | null> {
  try {
    const res = await fetch(`${UPSTASH_URL}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, windowSec, "NX"],
      ]),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{ result?: unknown }>;
    const count = data?.[0]?.result;
    return typeof count === "number" ? count : null;
  } catch {
    return null;
  }
}

/**
 * Rate limit distribué (avec repli mémoire). À utiliser sur les routes
 * critiques : `if ((await rateLimitAsync(...)) ) return ...`.
 */
export async function rateLimitAsync(
  request: NextRequest,
  name: string,
  limit: number,
  windowMs: number,
): Promise<NextResponse | null> {
  const ip = getClientIp(request);

  if (upstashEnabled) {
    const count = await upstashIncr(`rl:${name}:${ip}`, Math.ceil(windowMs / 1000));
    if (count !== null) {
      return count > limit ? tooMany(windowMs) : null;
    }
    // Redis indisponible → repli sur la mémoire locale ci-dessous.
  }

  return isRateLimited(`${name}:${ip}`, limit, windowMs) ? tooMany(windowMs) : null;
}
