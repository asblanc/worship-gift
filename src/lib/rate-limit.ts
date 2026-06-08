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

/**
 * Helper : applique un rate limit et renvoie une réponse 429 si dépassé,
 * sinon null (on continue le traitement).
 */
export function rateLimit(
  request: NextRequest,
  name: string,
  limit: number,
  windowMs: number,
): NextResponse | null {
  const ip = getClientIp(request);
  if (isRateLimited(`${name}:${ip}`, limit, windowMs)) {
    return NextResponse.json(
      { success: false, error: "Trop de requêtes. Réessaie dans un instant." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(windowMs / 1000)) } },
    );
  }
  return null;
}
