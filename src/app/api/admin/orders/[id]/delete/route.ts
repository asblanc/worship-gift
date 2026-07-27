/* ================================================================
   Worship Gift — POST /api/admin/orders/[id]/delete
   Supprime définitivement une commande (et ses éventuels billets).
   Réservé aux admins. À utiliser pour nettoyer les commandes de test.
   ================================================================ */

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isRequestAdmin } from "@/lib/supabase/require-admin";
import { rateLimitAsync } from "@/lib/rate-limit";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const limited = await rateLimitAsync(request, "admin-order-delete", 30, 60_000);
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
    const supabase = createAdminClient();
    // Supprime d'abord les billets liés (le cas échéant), puis la commande.
    await supabase.from("tickets").delete().eq("order_id", orderId);
    const { error } = await supabase.from("orders").delete().eq("id", orderId);
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API Admin Order Delete] Erreur:", error);
    return NextResponse.json({ success: false, error: "Erreur interne" }, { status: 500 });
  }
}
