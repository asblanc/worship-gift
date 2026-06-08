/* ================================================================
   Worship Gift — Envoi d'emails (Resend)
   No-op si RESEND_API_KEY n'est pas configurée : l'absence d'email
   ne bloque jamais le parcours commande/paiement.

   Variables d'env :
   - RESEND_API_KEY  : clé API Resend (https://resend.com)
   - RESEND_FROM     : expéditeur vérifié, ex "Worship Gift <billets@tondomaine.com>"
   - NEXT_PUBLIC_SITE_URL : pour les liens dans l'email
   ================================================================ */

import { createAdminClient } from "@/lib/supabase/admin";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://worship-gift.vercel.app";

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[c] || c,
  );
}

interface TicketLite {
  ticket_code: string;
  event_title: string;
  event_date?: string;
  event_time?: string;
  event_location?: string;
  ticket_type?: string;
}

function buildHtml(opts: {
  customerName: string;
  orderId: string;
  amount: number;
  tickets: TicketLite[];
}): string {
  const { customerName, orderId, amount, tickets } = opts;
  const total =
    amount === 0
      ? "Gratuit"
      : new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD" }).format(amount / 100);

  const ticketRows = tickets
    .map(
      (t) => `
      <tr>
        <td style="padding:12px;border-bottom:1px solid #222;">
          <strong style="color:#fff;">${escapeHtml(t.event_title)}</strong><br/>
          <span style="color:#b0b0b0;font-size:13px;">${escapeHtml(t.event_date || "")} ${escapeHtml(t.event_time || "")} — ${escapeHtml(t.event_location || "")}</span><br/>
          <span style="color:#b0b0b0;font-size:13px;">${escapeHtml(t.ticket_type || "")}</span><br/>
          <span style="font-family:monospace;color:#C9A84C;font-size:13px;">${escapeHtml(t.ticket_code)}</span>
        </td>
      </tr>`,
    )
    .join("");

  return `
  <div style="background:#0d0d0d;padding:32px 0;font-family:Inter,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#000;border:1px solid #222;border-radius:12px;overflow:hidden;">
      <div style="padding:24px;text-align:center;border-bottom:1px solid #222;">
        <h1 style="color:#C9A84C;margin:0;font-size:24px;">Worship Gift</h1>
      </div>
      <div style="padding:24px;">
        <h2 style="color:#fff;font-size:20px;margin:0 0 8px;">Réservation confirmée 🎉</h2>
        <p style="color:#b0b0b0;font-size:14px;line-height:1.5;">
          Bonjour ${escapeHtml(customerName)},<br/>
          Voici vos billets pour Worship Gift. Présente le QR code (visible sur ton compte) ou le code ci-dessous à l'entrée.
        </p>
        <p style="color:#b0b0b0;font-size:13px;">
          Référence : <span style="font-family:monospace;color:#C9A84C;">${escapeHtml(orderId)}</span> — Total : <strong style="color:#fff;">${total}</strong>
        </p>
        <table style="width:100%;border-collapse:collapse;margin-top:16px;">${ticketRows}</table>
        <div style="text-align:center;margin-top:24px;">
          <a href="${siteUrl}/account/orders/${encodeURIComponent(orderId)}"
             style="display:inline-block;background:#C9A84C;color:#000;text-decoration:none;font-weight:600;padding:12px 24px;border-radius:8px;font-size:14px;">
            Voir mes billets (QR codes)
          </a>
        </div>
      </div>
      <div style="padding:16px 24px;border-top:1px solid #222;text-align:center;">
        <span style="color:#666;font-size:12px;">Worship Gift — Mouvement Gospel</span>
      </div>
    </div>
  </div>`;
}

/**
 * Envoie l'email de confirmation pour une commande.
 * No-op silencieux si RESEND_API_KEY absente ou commande sans billets.
 */
export async function sendOrderConfirmation(orderId: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return; // email désactivé : ne bloque rien

  try {
    const supabase = createAdminClient();
    const { data: order } = await supabase
      .from("orders")
      .select("id, customer_email, customer_name, amount")
      .eq("id", orderId)
      .single();
    if (!order?.customer_email) return;

    const { data: tickets } = await supabase
      .from("tickets")
      .select("ticket_code, event_title, event_date, event_time, event_location, ticket_type")
      .eq("order_id", orderId);

    const html = buildHtml({
      customerName: order.customer_name || "cher client",
      orderId: order.id,
      amount: order.amount || 0,
      tickets: tickets || [],
    });

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || "Worship Gift <onboarding@resend.dev>",
        to: order.customer_email,
        subject: "Vos billets Worship Gift 🎟️",
        html,
      }),
    });

    if (!res.ok) {
      console.error("[Email] Echec Resend:", res.status, await res.text());
    }
  } catch (err) {
    console.error("[Email] Erreur sendOrderConfirmation:", err);
  }
}
