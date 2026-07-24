/* ================================================================
   Worship Gift — POST /api/admin/orders/[id]/prepare-tickets
   Prépare (génère) les billets d'une commande « à la livraison »
   AVANT encaissement, pour pouvoir les imprimer et les livrer.
   Réservé aux admins. Idempotent (voir prepareDeliveryTickets).
   ================================================================ */

import { NextRequest, NextResponse } from "next/server";
import { isRequestAdmin } from "@/lib/supabase/require-admin";
import { rateLimitAsync } from "@/lib/rate-limit";
import { prepareDeliveryTickets } from "@/lib/orders-service.server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const limited = await rateLimitAsync(request, "admin-prepare-tickets", 60, 60_000);
  if (limited) return limited;

  if (!(await isRequestAdmin())) {
    return NextResponse.json({ success: false, error: "Accès refusé" }, { status: 403 });
  }

  const { id } = await params;
  const orderId = (id || "").trim();
  if (!/^WG-\d{8}-[A-Z0-9]+$/.test(orderId)) {
    return NextResponse.json({ success: false, error: "Référence invalide" }, { status: 400 });
  }

  try {
    const res = await prepareDeliveryTickets(orderId);
    if (!res.ok) {
      return NextResponse.json({ success: false, error: res.error }, { status: 400 });
    }
    return NextResponse.json({ success: true, tickets: res.tickets });
  } catch (error) {
    console.error("[API Admin Prepare Tickets] Erreur:", error);
    return NextResponse.json({ success: false, error: "Erreur interne" }, { status: 500 });
  }
}
