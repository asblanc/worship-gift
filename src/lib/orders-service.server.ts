/* ================================================================
   Worship Gift — Orders Service (SERVEUR)
   Création et mutation des commandes côté serveur via la clé
   service_role. Toute la logique sensible (montant, statut) est
   ici — jamais côté client.

   ⚠️ SERVEUR UNIQUEMENT (importe le client admin service_role).
   ================================================================ */

import { randomUUID } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import type { EventData } from "@/lib/events-config";

export interface CreateOrderParams {
  event: EventData;
  quantity: number;
  ticketType: string;
  customerName: string;
  customerEmail: string;
  telephone?: string;
}

export interface TicketEntry {
  id: string;
  ticketCode: string;
  eventTitle: string;
  ticketType: string;
}

export interface OrderResult {
  orderId: string;
  amount: number;
  tickets: TicketEntry[];
}

/* ------------------------------------------------------------------
   Identifiants : WG-AAAAMMJJ-XXXX (commande) + codes billets uniques
   crypto au lieu de Math.random (non devinable, pas de collision)
   ------------------------------------------------------------------ */

function generateOrderId(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase();
  return `WG-${date}-${random}`;
}

function generateTicketCode(orderId: string, index: number): string {
  const suffix = String(index + 1).padStart(3, "0");
  const rand = randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
  return `${orderId}-T${suffix}-${rand}`;
}

/* ------------------------------------------------------------------
   Créer une commande + billets.
   Le montant est calculé ICI à partir du prix de l'événement
   (source de vérité serveur) — jamais reçu du client.
   ------------------------------------------------------------------ */

export async function createOrder(
  params: CreateOrderParams,
): Promise<OrderResult> {
  const { event, quantity, ticketType, customerName, customerEmail } = params;
  const supabase = createAdminClient();

  const orderId = generateOrderId();
  const amount = event.priceValue * quantity; // centimes, calculé serveur

  const { error: orderErr } = await supabase.from("orders").insert({
    id: orderId,
    customer_email: customerEmail,
    customer_name: customerName,
    amount,
    currency: "MAD",
    description: `${event.title} — ${quantity} billet(s) ${ticketType}`,
    status: "pending",
    payment_provider: "cmi",
  });

  if (orderErr) {
    throw new Error(`Création commande échouée: ${orderErr.message}`);
  }

  const rows = Array.from({ length: quantity }, (_, i) => ({
    order_id: orderId,
    customer_email: customerEmail,
    customer_name: customerName,
    event_id: event.id,
    event_title: event.title,
    event_date: event.date,
    event_time: event.time,
    event_location: event.location,
    ticket_type: ticketType,
    ticket_code: generateTicketCode(orderId, i),
    status: "valid",
  }));

  const { data: inserted, error: ticketErr } = await supabase
    .from("tickets")
    .insert(rows)
    .select("id, ticket_code");

  if (ticketErr) {
    throw new Error(`Création billets échouée: ${ticketErr.message}`);
  }

  const tickets: TicketEntry[] = (inserted || []).map((t) => ({
    id: t.id as string,
    ticketCode: t.ticket_code as string,
    eventTitle: event.title,
    ticketType,
  }));

  return { orderId, amount, tickets };
}

/* ------------------------------------------------------------------
   Confirmer une réservation gratuite (pending -> reserved).
   Vérifie que la commande existe ET qu'elle est gratuite/pending
   avant de muter — empêche toute transition arbitraire.
   ------------------------------------------------------------------ */

export async function confirmFreeReservation(
  orderId: string,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = createAdminClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select("id, amount, status")
    .eq("id", orderId)
    .single();

  if (error || !order) {
    return { ok: false, error: "Commande introuvable" };
  }
  if (order.amount !== 0) {
    return { ok: false, error: "Cette commande nécessite un paiement" };
  }
  if (order.status !== "pending") {
    // déjà confirmée / dans un autre état : idempotent, on ne ré-écrit pas
    return { ok: true };
  }

  const { error: updErr } = await supabase
    .from("orders")
    .update({ status: "reserved" })
    .eq("id", orderId)
    .eq("status", "pending");

  if (updErr) {
    return { ok: false, error: updErr.message };
  }
  return { ok: true };
}

/* ------------------------------------------------------------------
   Lire le montant d'une commande (source serveur pour le paiement).
   ------------------------------------------------------------------ */

export async function getOrderForPayment(orderId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("id, amount, currency, customer_email, customer_name, description, status")
    .eq("id", orderId)
    .single();

  if (error || !data) return null;
  return data;
}
