/* ================================================================
   Worship Gift — GET /api/orders/[id]
   Lecture publique d'une commande par son identifiant (orderId),
   pour la page de confirmation (success) — y compris pour un invité
   non connecté que les RLS empêcheraient de lire.

   L'orderId joue le rôle de jeton : il est connu uniquement de
   l'acheteur (présent dans son URL de retour). On ne renvoie que des
   informations non sensibles (statut + billets de la commande).
   Rate-limité pour limiter le brute-force d'identifiants.
   ================================================================ */

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimitAsync } from "@/lib/rate-limit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  // L'orderId est un jeton d'accès : le rate-limit distribué (Upstash si
  // configuré) rend le brute-force irréaliste à l'échelle de la flotte.
  const limited = await rateLimitAsync(request, "order-read", 30, 60_000);
  if (limited) return limited;

  const { id } = await params;
  const orderId = (id || "").trim();

  if (!/^WG-\d{8}-[A-Z0-9]+$/.test(orderId)) {
    return NextResponse.json({ error: "orderId invalide" }, { status: 400 });
  }

  try {
    const supabase = createAdminClient();

    const { data: order } = await supabase
      .from("orders")
      .select("id, description, amount, currency, status, created_at")
      .eq("id", orderId)
      .single();

    if (!order) {
      return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
    }

    const { data: tickets } = await supabase
      .from("tickets")
      .select("ticket_code, event_title, event_date, event_time, event_location, ticket_type, status")
      .eq("order_id", orderId);

    return NextResponse.json({ order, tickets: tickets || [] });
  } catch (error) {
    console.error("[API Order Read] Erreur:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
