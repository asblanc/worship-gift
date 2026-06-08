/* ================================================================
   Worship Gift — Vérification admin côté serveur (routes API)
   Lit la session depuis les cookies et confirme app_metadata.role
   = 'admin' (non modifiable par l'utilisateur). À utiliser en tête
   de toute route API réservée à l'admin.
   ================================================================ */

import { createClient } from "@/lib/supabase/server";

export async function isRequestAdmin(): Promise<boolean> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.app_metadata?.role === "admin";
  } catch {
    return false;
  }
}
