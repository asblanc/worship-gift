/**
 * API Route: /api/ping-supabase
 * Purpose: envoyer une requête très légère côté serveur vers Supabase
 * afin de garder la base "chaude" et réduire les cold starts.
 *
 * Usage:
 * - Définir en environnement (Vercel) :
 *   - `SUPABASE_URL` (ex: https://xyz.supabase.co)
 *   - `SUPABASE_SERVICE_ROLE_KEY` (clé serveur - NE PAS exposer côté client)
 *   - `CRON_SECRET` (secret partagé — même valeur que le cron des rappels)
 * - Appeler `GET /api/ping-supabase` depuis un cron externe (Vercel Cron,
 *   UptimeRobot, etc.). Deux façons de fournir le secret :
 *     • en-tête   `Authorization: Bearer <CRON_SECRET>`  (Vercel Cron, clients HTTP)
 *     • paramètre d'URL `?token=<CRON_SECRET>`  (moniteurs sans en-têtes
 *       personnalisés, ex: UptimeRobot plan gratuit)
 *
 * Recommandation de fréquence: 15-30 minutes. 15 minutes réduit mieux les cold starts;
 * 30 minutes est plus conservateur pour les quotas. Eviter <10 minutes pour ne pas abuser.
 *
 * Sécurité : la route exige le CRON_SECRET — sans lui, n'importe quel
 * visiteur pourrait déclencher des requêtes service_role à volonté
 * (abus de quota / amplification). Les messages d'erreur internes ne
 * sont JAMAIS renvoyés au client.
 */

import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
import { safeEqual } from "@/lib/security";
import { rateLimitAsync } from "@/lib/rate-limit";

export const runtime = "nodejs";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || "";

async function wakeSupabase() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase non configuré côté serveur");
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    // on ne veut pas de persistance de session pour ce ping
    auth: { persistSession: false },
  });

  // Requête très légère: lire uniquement un id d'une table existante, limitée à 1
  const { data, error } = await supabase.from("orders").select("id").limit(1);

  if (error) throw error;

  return { ok: true, rows: Array.isArray(data) ? data.length : 0 };
}

export async function GET(request: NextRequest) {
  // Anti-abus : quelques appels par minute suffisent largement.
  const limited = await rateLimitAsync(request, "ping-supabase", 10, 60_000);
  if (limited) return limited;

  // Authentification par secret partagé (comparaison à temps constant).
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return Response.json({ status: "error" }, { status: 500 });
  }
  // Secret accepté via en-tête Authorization OU paramètre d'URL ?token=
  // (les moniteurs sans en-têtes personnalisés, ex: UptimeRobot gratuit,
  // ne peuvent passer le secret que dans l'URL).
  const provided = request.headers.get("authorization") || "";
  const token = new URL(request.url).searchParams.get("token") || "";
  const authorized =
    safeEqual(provided, `Bearer ${secret}`) || safeEqual(token, secret);
  if (!authorized) {
    return Response.json({ status: "unauthorized" }, { status: 401 });
  }

  // Safety: only perform the wake ping in Production environment to avoid
  // consuming quotas for Preview/Development deployments.
  const vercelEnv = process.env.VERCEL_ENV || process.env.NODE_ENV || "";
  if (vercelEnv && vercelEnv !== "production") {
    return Response.json({ status: "skipped", reason: `env=${vercelEnv}` }, { status: 200 });
  }

  try {
    const result = await wakeSupabase();
    return Response.json({ status: "ok", ...result }, { status: 200 });
  } catch (err) {
    // Message générique : ne jamais exposer l'erreur interne au client.
    console.error("[ping-supabase] Erreur:", err);
    return Response.json({ status: "error" }, { status: 500 });
  }
}
