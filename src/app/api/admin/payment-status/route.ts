/* ================================================================
   Worship Gift — GET /api/admin/payment-status
   Renvoie l'état de configuration du paiement en ligne (CMI) pour
   l'afficher dans le tableau de bord admin. Ne divulgue JAMAIS les
   secrets : uniquement des booléens « présent / absent ».
   Réservé aux admins.
   ================================================================ */

import { NextResponse } from "next/server";
import { isRequestAdmin } from "@/lib/supabase/require-admin";

export async function GET() {
  if (!(await isRequestAdmin())) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const environment = (process.env.PAYMENT_ENV || "test") as "test" | "prod";
  const hasClientId = !!process.env.CMI_CLIENT_ID;
  const hasStoreKey = !!process.env.CMI_STORE_KEY;
  const hasCallback = !!process.env.CMI_CALLBACK_URL;

  // En test, la sandbox CMI fonctionne avec des valeurs par défaut ->
  // « prêt ». En prod, il faut les 3 identifiants réels du prestataire.
  const configured =
    environment === "prod" ? hasClientId && hasStoreKey && hasCallback : true;

  return NextResponse.json({
    provider: "cmi",
    environment,
    configured,
    hasClientId,
    hasStoreKey,
    hasCallback,
  });
}
