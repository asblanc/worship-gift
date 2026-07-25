/* ================================================================
   Worship Gift — POST /api/admin/orders/[id]/status
   Change le statut d'une commande (réservé aux admins).
   - status "paid"  -> markOrderPaid() : génère les billets + paid_at
                       (idempotent, aucun doublon).
   - autre statut   -> mise à jour simple (ex: cancelled).
   Les écritures passent par le service_role côté serveur (RLS ne
   permet aucune écriture client).

   Corps : { "status": "paid" | "cancelled" | "pending" | ... }
   ================================================================ */

import { NextRequest, NextResponse } from "next/server";
import { isRequestAdmin } from "@/lib/supabase/require-admin";
import { rateLimitAsync } from "@/lib/rate-limit";
import { setOrderPaid, updateOrderStatus } from "@/lib/orders-service.server";

const ALLOWED = ["pending", "reserved", "paid", "cancelled", "failed", "refunded", "expired"];

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const limited = await rateLimitAsync(request, "admin-order-status", 60, 60_000);
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
    const body = await request.json();
    const status = typeof body.status === "string" ? body.status.trim() : "";
    if (!ALLOWED.includes(status)) {
      return NextResponse.json({ success: false, error: "Statut invalide" }, { status: 400 });
    }

    if (status === "paid") {
      // Nouveau modèle : le billet est émis par le prestataire (billetteries.ma).
      // On ne génère plus de billet interne — on trace seulement le paiement.
      const res = await setOrderPaid(orderId);
      if (!res.ok) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, status: "paid" });
    }

    const res = await updateOrderStatus(orderId, status);
    if (!res.ok) {
      return NextResponse.json({ success: false, error: res.error }, { status: 400 });
    }
    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error("[API Admin Order Status] Erreur:", error);
    return NextResponse.json({ success: false, error: "Erreur interne" }, { status: 500 });
  }
}
