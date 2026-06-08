/* ================================================================
   Worship Gift — GET /api/cron/event-reminders
   Envoie un email de rappel aux détenteurs de billets pour les
   événements qui ont lieu dans les prochaines 48h.

   - Protégé par CRON_SECRET (header Authorization: Bearer <secret>),
     que Vercel Cron envoie automatiquement.
   - Idempotent : orders.reminder_sent_at empêche les doublons.
   - No-op d'envoi si Resend non configuré (sendEventReminder = false),
     mais on ne marque alors PAS la commande (pour réessayer plus tard).
   ================================================================ */

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEventReminder } from "@/lib/email";
import { upcomingEvents } from "@/lib/events-config";

const WINDOW_HOURS = 48;

export async function GET(request: NextRequest) {
  // Authentification du cron
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET non configuré" }, { status: 500 });
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const now = Date.now();
  const windowEnd = now + WINDOW_HOURS * 3600 * 1000;

  // Événements à venir dans la fenêtre
  const targets = upcomingEvents.filter((e) => {
    const t = new Date(e.isoDate).getTime();
    return Number.isFinite(t) && t > now && t <= windowEnd;
  });

  if (targets.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, message: "Aucun événement dans la fenêtre" });
  }

  const targetMap = new Map(targets.map((e) => [e.id, e]));
  const targetIds = targets.map((e) => e.id);

  try {
    const supabase = createAdminClient();

    // Billets valides pour ces événements
    const { data: tickets } = await supabase
      .from("tickets")
      .select("order_id, event_id")
      .in("event_id", targetIds)
      .eq("status", "valid");

    if (!tickets || tickets.length === 0) {
      return NextResponse.json({ ok: true, sent: 0, message: "Aucun billet concerné" });
    }

    // order_id -> { event_id, count }
    const byOrder = new Map<string, { eventId: string; count: number }>();
    for (const t of tickets) {
      const entry = byOrder.get(t.order_id) || { eventId: t.event_id, count: 0 };
      entry.count += 1;
      byOrder.set(t.order_id, entry);
    }

    const orderIds = [...byOrder.keys()];
    const { data: orders } = await supabase
      .from("orders")
      .select("id, customer_email, customer_name, status, reminder_sent_at")
      .in("id", orderIds);

    let sent = 0;
    for (const order of orders || []) {
      if (order.reminder_sent_at) continue; // déjà rappelé
      if (!["reserved", "paid"].includes(order.status)) continue;
      if (!order.customer_email) continue;

      const info = byOrder.get(order.id);
      const event = info ? targetMap.get(info.eventId) : undefined;
      if (!event) continue;

      const ok = await sendEventReminder({
        to: order.customer_email,
        customerName: order.customer_name || "cher client",
        orderId: order.id,
        eventTitle: event.title,
        eventDate: event.date,
        eventTime: event.time,
        eventLocation: event.location,
        ticketCount: info?.count || 1,
      });

      if (ok) {
        await supabase
          .from("orders")
          .update({ reminder_sent_at: new Date().toISOString() })
          .eq("id", order.id);
        sent += 1;
      }
    }

    return NextResponse.json({ ok: true, sent, events: targetIds, candidates: orderIds.length });
  } catch (error) {
    console.error("[Cron Reminders] Erreur:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
