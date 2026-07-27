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
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.worship-gift.com";

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

/* ------------------------------------------------------------------
   Email « Commande reçue — traitement en cours »
   Envoyé automatiquement à la création d'une commande (livraison) et
   déclenchable en masse par l'admin. Design de marque : logo, affiche,
   couleurs de l'événement, coordonnées, pied de page soigné.
   ------------------------------------------------------------------ */

const CONTACT = {
  phone1: "+212 605 426 406",
  phone2: "+212 698 472 691",
  whatsapp: "212605426406",
  email: "contact@worship-gift.com",
};

function orderReceivedHtml(opts: {
  customerName: string;
  orderId: string;
  ticketType?: string | null;
  quantity?: number | null;
  amount: number;
}): string {
  const { customerName, orderId, ticketType, quantity, amount } = opts;
  const total =
    amount === 0
      ? "Gratuit"
      : new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD" }).format(amount / 100);
  const qty = Math.max(1, quantity ?? 1);
  const logo = `${siteUrl}/img_worship-gift/logo-512.png`;
  const affiche = `${siteUrl}/img_worship-gift/affiche-jonathan-gambela-carre.png`;

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:8px 0;color:#9a9a9a;font-size:13px;">${label}</td>
      <td style="padding:8px 0;color:#ffffff;font-size:13px;font-weight:600;text-align:right;">${value}</td>
    </tr>`;

  return `
  <div style="background:#0d0d0d;padding:28px 12px;font-family:Inter,Segoe UI,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#101010;border:1px solid #242424;border-radius:16px;overflow:hidden;">
      <!-- Bandeau couleurs événement -->
      <tr><td style="height:5px;background:linear-gradient(90deg,#C4161C,#C9A84C,#0F7A3D);"></td></tr>

      <!-- En-tête logo -->
      <tr><td style="padding:22px 24px 8px;text-align:center;">
        <img src="${logo}" alt="Worship Gift" width="52" height="52" style="border-radius:50%;display:inline-block;" />
        <div style="color:#C9A84C;font-size:20px;font-weight:800;letter-spacing:1px;margin-top:8px;">WORSHIP GIFT</div>
      </td></tr>

      <!-- Affiche -->
      <tr><td style="padding:8px 24px;text-align:center;">
        <img src="${affiche}" alt="Concert Live de Jonathan Gambela" width="220" style="width:220px;max-width:70%;border-radius:12px;border:1px solid #2a2a2a;" />
      </td></tr>

      <!-- Corps -->
      <tr><td style="padding:12px 28px 4px;">
        <h1 style="color:#ffffff;font-size:21px;margin:0 0 6px;">Nous avons bien reçu votre commande ✅</h1>
        <p style="color:#b6b6b6;font-size:14px;line-height:1.6;margin:0 0 14px;">
          Bonjour ${escapeHtml(customerName)},<br/>
          Merci pour votre réservation au <strong style="color:#fff;">Concert Live de Jonathan Gambela</strong>
          (Africa Tour 2026), le <strong style="color:#fff;">11 octobre 2026 à Casablanca</strong>.
          Votre commande est <strong style="color:#C9A84C;">en cours de traitement</strong> ; notre équipe
          vous recontacte avec la confirmation et les modalités <strong style="color:#fff;">dans les heures qui viennent</strong>.
        </p>
      </td></tr>

      <!-- Récap commande -->
      <tr><td style="padding:6px 28px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#161616;border:1px solid #262626;border-radius:12px;padding:6px 16px;">
          ${row("Référence", `<span style="font-family:monospace;color:#C9A84C;">${escapeHtml(orderId)}</span>`)}
          ${ticketType ? row("Catégorie", escapeHtml(ticketType)) : ""}
          ${row("Quantité", `${qty} billet(s)`)}
          ${row("Montant", `${total}`)}
        </table>
      </td></tr>

      <!-- Contacts -->
      <tr><td style="padding:18px 28px 4px;">
        <p style="color:#9a9a9a;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">Une question ?</p>
        <p style="color:#d0d0d0;font-size:14px;line-height:1.7;margin:0;">
          📞 ${CONTACT.phone1} &nbsp;·&nbsp; ${CONTACT.phone2}<br/>
          💬 <a href="https://wa.me/${CONTACT.whatsapp}" style="color:#25D366;text-decoration:none;">WhatsApp</a>
          &nbsp;·&nbsp; ✉️ <a href="mailto:${CONTACT.email}" style="color:#C9A84C;text-decoration:none;">${CONTACT.email}</a>
        </p>
      </td></tr>

      <!-- Pied de page -->
      <tr><td style="padding:22px 28px;margin-top:12px;border-top:1px solid #242424;text-align:center;">
        <div style="color:#C9A84C;font-size:14px;font-weight:700;">WORSHIP GIFT</div>
        <div style="color:#7a7a7a;font-size:12px;margin-top:4px;">Mouvement Gospel · Africa Tour 2026</div>
        <div style="color:#5f5f5f;font-size:11px;margin-top:10px;">
          Concert Live de Jonathan Gambela — 11 octobre 2026 · Casablanca
        </div>
        <div style="color:#4d4d4d;font-size:11px;margin-top:6px;">
          Cet e-mail vous est envoyé suite à votre réservation sur worship-gift.com.
        </div>
      </td></tr>
    </table>
  </div>`;
}

/**
 * Envoie l'e-mail « commande reçue / traitement en cours ».
 * Renvoie true si envoyé, false sinon (pas de clé, pas d'email client, échec).
 */
export async function sendOrderReceived(orderId: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  try {
    const supabase = createAdminClient();
    const { data: order } = await supabase
      .from("orders")
      .select("id, customer_email, customer_name, ticket_type, quantity, amount")
      .eq("id", orderId)
      .single();
    if (!order?.customer_email) return false;

    const html = orderReceivedHtml({
      customerName: order.customer_name || "cher client",
      orderId: order.id,
      ticketType: order.ticket_type,
      quantity: order.quantity,
      amount: order.amount || 0,
    });

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || "Worship Gift <onboarding@resend.dev>",
        to: order.customer_email,
        subject: "Nous avons bien reçu votre commande — Worship Gift 🎟️",
        html,
      }),
    });
    if (!res.ok) {
      console.error("[Email] Echec sendOrderReceived:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[Email] Erreur sendOrderReceived:", err);
    return false;
  }
}

/* ------------------------------------------------------------------
   Email de rappel avant l'événement
   ------------------------------------------------------------------ */

function buildReminderHtml(opts: {
  customerName: string;
  orderId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  ticketCount: number;
}): string {
  const { customerName, orderId, eventTitle, eventDate, eventTime, eventLocation, ticketCount } = opts;
  return `
  <div style="background:#0d0d0d;padding:32px 0;font-family:Inter,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#000;border:1px solid #222;border-radius:12px;overflow:hidden;">
      <div style="padding:24px;text-align:center;border-bottom:1px solid #222;">
        <h1 style="color:#C9A84C;margin:0;font-size:24px;">Worship Gift</h1>
      </div>
      <div style="padding:24px;">
        <h2 style="color:#fff;font-size:20px;margin:0 0 8px;">C'est bientôt ! 🎶</h2>
        <p style="color:#b0b0b0;font-size:14px;line-height:1.5;">
          Bonjour ${escapeHtml(customerName)},<br/>
          Petit rappel : ton événement approche. On a hâte de t'y voir !
        </p>
        <div style="margin-top:16px;padding:16px;background:#111;border-radius:8px;">
          <p style="color:#fff;font-size:16px;font-weight:bold;margin:0;">${escapeHtml(eventTitle)}</p>
          <p style="color:#C9A84C;font-size:14px;margin:6px 0 0;">${escapeHtml(eventDate)} à ${escapeHtml(eventTime)}</p>
          <p style="color:#b0b0b0;font-size:14px;margin:4px 0 0;">${escapeHtml(eventLocation)}</p>
          <p style="color:#b0b0b0;font-size:13px;margin:10px 0 0;">${ticketCount} billet(s) — présente ton QR code à l'entrée.</p>
        </div>
        <div style="text-align:center;margin-top:24px;">
          <a href="${siteUrl}/account/orders/${encodeURIComponent(orderId)}"
             style="display:inline-block;background:#C9A84C;color:#000;text-decoration:none;font-weight:600;padding:12px 24px;border-radius:8px;font-size:14px;">
            Voir mes billets
          </a>
        </div>
      </div>
      <div style="padding:16px 24px;border-top:1px solid #222;text-align:center;">
        <span style="color:#666;font-size:12px;">Worship Gift — Mouvement Gospel</span>
      </div>
    </div>
  </div>`;
}

/* ------------------------------------------------------------------
   Message du formulaire de contact -> boîte de l'équipe
   ------------------------------------------------------------------ */

export async function sendContactEmail(opts: {
  name: string;
  email: string;
  message: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const to = process.env.CONTACT_EMAIL || "contact@worship-gift.com";
  const html = `
  <div style="font-family:Inter,Arial,sans-serif;color:#111;line-height:1.5">
    <h2 style="color:#C9A84C">Nouveau message — Worship Gift</h2>
    <p><strong>Nom :</strong> ${escapeHtml(opts.name)}</p>
    <p><strong>Email :</strong> ${escapeHtml(opts.email)}</p>
    <p><strong>Message :</strong></p>
    <p style="white-space:pre-wrap;border-left:3px solid #C9A84C;padding-left:12px">${escapeHtml(opts.message)}</p>
  </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || "Worship Gift <onboarding@resend.dev>",
        to,
        reply_to: opts.email,
        subject: `Contact site — ${opts.name}`,
        html,
      }),
    });
    if (!res.ok) {
      console.error("[Email] Echec contact Resend:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[Email] Erreur sendContactEmail:", err);
    return false;
  }
}

export async function sendEventReminder(opts: {
  to: string;
  customerName: string;
  orderId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  ticketCount: number;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || "Worship Gift <onboarding@resend.dev>",
        to: opts.to,
        subject: `Rappel : ${opts.eventTitle} approche 🎟️`,
        html: buildReminderHtml(opts),
      }),
    });
    if (!res.ok) {
      console.error("[Email] Echec rappel Resend:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[Email] Erreur sendEventReminder:", err);
    return false;
  }
}
