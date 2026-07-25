/* ================================================================
   Worship Gift — POST /api/orders/confirm
   Confirme une réservation GRATUITE (pending -> reserved).
   La transition de statut est gérée côté serveur via service_role :
   le client ne peut pas muter directement une commande.

   Corps : { "orderId": "WG-..." }
   ================================================================ */

import { NextRequest, NextResponse } from "next/server";
import { confirmFreeReservation } from "@/lib/orders-service.server";
import { rateLimitAsync } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Distribué (Upstash) si configuré : protège réellement contre le
    // brute-force d'orderId, pas seulement sur une instance chaude.
    const limited = await rateLimitAsync(request, "orders-confirm", 20, 60_000);
    if (limited) return limited;

    const body = await request.json();
    const orderId = typeof body.orderId === "string" ? body.orderId.trim() : "";

    if (!orderId || !/^WG-\d{8}-[A-Z0-9]+$/.test(orderId)) {
      return NextResponse.json(
        { success: false, error: "orderId invalide" },
        { status: 400 },
      );
    }

    const result = await confirmFreeReservation(orderId);
    if (!result.ok) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API Orders Confirm] Erreur:", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}
