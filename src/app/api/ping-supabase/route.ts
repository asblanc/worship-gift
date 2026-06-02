/**
 * API Route: /api/ping-supabase
 * Purpose: envoyer une requête très légère côté serveur vers Supabase
 * afin de garder la base "chaude" et réduire les cold starts.
 *
 * Usage:
 * - Définir en environnement (Vercel) :
 *   - `SUPABASE_URL` (ex: https://xyz.supabase.co)
 *   - `SUPABASE_SERVICE_ROLE_KEY` (clé serveur - NE PAS exposer côté client)
 * - Appeler `GET /api/ping-supabase` depuis un cron externe (Vercel Cron, UptimeRobot, etc.)
 *
 * Recommandation de fréquence: 15-30 minutes. 15 minutes réduit mieux les cold starts;
 * 30 minutes est plus conservateur pour les quotas. Eviter <10 minutes pour ne pas abuser.
 *
 * Pour désactiver: supprimer le cron externe ou retirer/renommer la route.
 */

import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || "";

async function wakeSupabase() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase URL / service key not configured on server");
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    // on ne veut pas de persistance de session pour ce ping
    auth: { persistSession: false },
  });

  // Requête très légère: lire uniquement un id d'une table existante, limitée à 1
  // Remplacez 'orders' par une petite table si vous en avez une plus adaptée.
  const { data, error } = await supabase.from("orders").select("id").limit(1);

  if (error) throw error;

  return { ok: true, rows: Array.isArray(data) ? data.length : 0 };
}

export async function GET() {
  try {
    const result = await wakeSupabase();
    return new Response(JSON.stringify({ status: "ok", ...result }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ status: "error", message: err.message || String(err) }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
