/**
 * API Route: /api/ping-supabase
 * Purpose: envoyer une requête très légère côté serveur vers Supabase
 * afin de garder la base "chaude" et réduire les cold starts.
 *
 * Usage:
 * - Définir en environnement (Vercel) :
 *   - `SUPABASE_URL` (ex: https://xyz.supabase.co)
 *   - `SUPABASE_SERVICE_ROLE_KEY` (clé serveur - NE PAS exposer côté client)
 * - Appeler `GET /api/ping-supabase` depuis un moniteur externe (UptimeRobot,
 *   cron-job.org…) toutes les 15–30 min. AUCUN secret requis : l'endpoint est
 *   volontairement public pour fonctionner avec n'importe quel moniteur.
 *
 * Sécurité : endpoint anodin — il ne renvoie AUCUNE donnée (juste { ok, rows })
 * et ne s'exécute qu'en production. Protégé contre l'abus par un rate-limit
 * (distribué si Upstash configuré). Les erreurs internes ne sont jamais
 * exposées au client.
 */

import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
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
  // Anti-abus : quelques appels par minute suffisent largement pour un
  // keep-warm. Rate-limit distribué si Upstash est configuré.
  const limited = await rateLimitAsync(request, "ping-supabase", 10, 60_000);
  if (limited) return limited;

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
