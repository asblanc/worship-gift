/* ================================================================
   Worship Gift — Orders Service
   Logique metier pour la creation et le suivi des commandes.
   
   Statuts :
   - pending  : commande creee, en attente de paiement
   - reserved : reservation confirmee sans paiement (evenements gratuits)
   - paid     : paiement recu (via CMI ou autre)
   - cancelled: commande annulee
   - failed   : paiement echoue
   
   ================================================================ */

import { supabase } from "@/lib/supabase/client";
import type { EventData } from "@/lib/events-config";

/* ------------------------------------------------------------------
   Types internes
   ------------------------------------------------------------------ */

export interface CreateOrderParams {
  event: EventData;
  quantity: number;
  ticketType: string;
  customerName: string;
  customerEmail: string;
  telephone?: string;
}

export interface OrderResult {
  orderId: string;
  tickets: TicketEntry[];
}

export interface TicketEntry {
  id: string;
  ticketCode: string;
  eventTitle: string;
  ticketType: string;
  quantity: number;
}

/* ------------------------------------------------------------------
   Generer un ID de commande unique : WG-AAAAMMJJ-RANDOM
   ------------------------------------------------------------------ */

function generateOrderId(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `WG-${date}-${random}`;
}

/* ------------------------------------------------------------------
   Generer un code de billet unique (pour QR code futur)
   ------------------------------------------------------------------ */

function generateTicketCode(orderId: string, index: number): string {
  const suffix = String(index + 1).padStart(3, "0");
  return `${orderId}-T${suffix}`;
}

/* ------------------------------------------------------------------
   Creer une commande + tickets dans Supabase
   
   Flow :
   1. Creer la commande dans la table orders (statut: pending)
   2. Creer un ticket par place reservee dans la table tickets
   3. Retourner l'orderId et la liste des tickets
   
   Si la table orders n'existe pas encore en dev, on simule.
   ------------------------------------------------------------------ */

export async function createOrder(
  params: CreateOrderParams
): Promise<OrderResult> {
  const { event, quantity, ticketType, customerName, customerEmail } = params;
  const orderId = generateOrderId();
  const totalAmount = event.priceValue * quantity;

  const tickets: TicketEntry[] = [];

  try {
    // 1. Inserer la commande
    const { error: orderErr } = await supabase.from("orders").insert({
      id: orderId,
      customer_email: customerEmail,
      customer_name: customerName,
      amount: totalAmount,
      currency: "MAD",
      description: `${event.title} — ${quantity} billet(s) ${ticketType}`,
      status: "pending",
      payment_provider: "cmi",
    });

    if (orderErr) {
      // Si la table n'existe pas encore (dev local), on simule
      if (orderErr.code === "42P01") {
        console.warn(
          "[Orders] Table orders non creee — commande simulee:",
          orderId
        );
      } else {
        throw orderErr;
      }
    }

    // 2. Creer les billets (un par place)
    for (let i = 0; i < quantity; i++) {
      const ticketCode = generateTicketCode(orderId, i);

      const { data: ticket, error: ticketErr } = await supabase
        .from("tickets")
        .insert({
          order_id: orderId,
          customer_email: customerEmail,
          customer_name: customerName,
          event_id: event.id,
          event_title: event.title,
          event_date: event.date,
          event_time: event.time,
          event_location: event.location,
          ticket_type: ticketType,
          ticket_code: ticketCode,
          status: "valid",
        })
        .select("id")
        .single();

      if (ticketErr) {
        if (ticketErr.code === "42P01") {
          console.warn(
            "[Orders] Table tickets non creee — ticket simule:",
            ticketCode
          );
          tickets.push({
            id: `sim-${i}`,
            ticketCode,
            eventTitle: event.title,
            ticketType,
            quantity: 1,
          });
        } else {
          console.error("[Orders] Erreur creation ticket:", ticketErr);
        }
      } else if (ticket) {
        tickets.push({
          id: ticket.id,
          ticketCode,
          eventTitle: event.title,
          ticketType,
          quantity: 1,
        });
      }
    }
  } catch (err) {
    console.error("[Orders] Erreur createOrder:", err);
    // Meme en cas d'erreur, on retourne l'orderId simule
    // pour ne pas bloquer le parcours utilisateur
    for (let i = 0; i < quantity; i++) {
      tickets.push({
        id: `fallback-${i}`,
        ticketCode: generateTicketCode(orderId, i),
        eventTitle: event.title,
        ticketType,
        quantity: 1,
      });
    }
  }

  return { orderId, tickets };
}

/* ------------------------------------------------------------------
   Changer le statut d'une commande
   Utile pour le passage pending -> reserved (evenements gratuits)
   ou pending -> paid (apres paiement CMI).
   ------------------------------------------------------------------ */

export async function updateOrderStatus(
  orderId: string,
  status: "pending" | "reserved" | "paid" | "cancelled" | "failed",
  transactionId?: string
): Promise<boolean> {
  try {
    const updateData: Record<string, unknown> = { status };

    if (transactionId) {
      updateData.transaction_id = transactionId;
    }
    if (status === "paid") {
      updateData.paid_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", orderId);

    if (error && error.code !== "42P01") {
      console.error("[Orders] Erreur updateOrderStatus:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[Orders] Erreur updateOrderStatus:", err);
    return false;
  }
}

/* ------------------------------------------------------------------
   Recuperer une commande par son ID
   ------------------------------------------------------------------ */

export async function getOrder(orderId: string) {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (error && error.code !== "42P01") {
      console.error("[Orders] Erreur getOrder:", error);
      return null;
    }
    return data;
  } catch (err) {
    console.error("[Orders] Erreur getOrder:", err);
    return null;
  }
}

/* ------------------------------------------------------------------
   Recuperer les tickets d'une commande
   ------------------------------------------------------------------ */

export async function getOrderTickets(orderId: string) {
  try {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("order_id", orderId);

    if (error && error.code !== "42P01") {
      console.error("[Orders] Erreur getOrderTickets:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("[Orders] Erreur getOrderTickets:", err);
    return [];
  }
}