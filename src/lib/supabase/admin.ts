/* ================================================================
   Worship Gift — Client Supabase "admin" (service_role)
   ⚠️ SERVEUR UNIQUEMENT — ne JAMAIS importer ce fichier dans un
   composant client. La clé service_role contourne les RLS et a
   tous les privilèges sur la base.

   Utilisé pour :
   - Créer/mettre à jour des commandes côté serveur (routes API)
   - Le callback CMI (mise à jour du statut de paiement)
   ================================================================ */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

export function createAdminClient(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!url || !key) {
    // Fail-closed : on refuse de fonctionner sans la clé service_role
    throw new Error(
      "[admin] Configuration Supabase serveur manquante (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)",
    );
  }

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return cached;
}
