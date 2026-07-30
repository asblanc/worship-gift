/* ================================================================
   Worship Gift — Meta Conversions API (CAPI), côté SERVEUR

   Pourquoi ? Le pixel navigateur perd aujourd'hui une grosse partie
   des conversions (bloqueurs de pub, iOS/ITP, WebView Android, connexions
   coupées). La Conversions API envoie le même évènement depuis le serveur :
   Meta recoupe les deux, déduplique via `event_id`, et l'algorithme
   d'optimisation reçoit un signal beaucoup plus complet.

   ⚙️ Activation : NEXT_PUBLIC_META_PIXEL_ID + META_CAPI_ACCESS_TOKEN.
      Sans le token, la fonction est un no-op silencieux — le site et le
      pixel navigateur continuent de fonctionner normalement.

   🔒 Vie privée : les données personnelles (email, téléphone, nom) ne
      sont JAMAIS envoyées en clair. Meta impose un hachage SHA-256 sur
      des valeurs normalisées (minuscules, sans espaces) — c'est ce que
      fait `sha256()` ci-dessous.
   ================================================================ */

import { createHash } from "crypto";
import type { NextRequest } from "next/server";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN || "";
/** Code de test facultatif : affiche les évènements dans « Test Events ». */
const TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE || "";
const GRAPH_VERSION = process.env.META_GRAPH_VERSION || "v23.0";

export const metaCapiEnabled = Boolean(PIXEL_ID && ACCESS_TOKEN);

/** Hachage SHA-256 d'une valeur normalisée (exigence Meta). */
function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

/** Téléphone : chiffres uniquement, indicatif pays inclus (212… pour le Maroc). */
function normalizePhone(raw: string): string | undefined {
  let digits = raw.replace(/\D/g, "");
  if (!digits) return undefined;
  // 0612345678 (format local marocain) → 212612345678
  if (digits.startsWith("0")) digits = `212${digits.slice(1)}`;
  return digits.length >= 8 ? digits : undefined;
}

export interface MetaCapiUserData {
  email?: string;
  phone?: string;
  /** Nom complet — découpé en prénom / nom pour l'appariement Meta. */
  fullName?: string;
  city?: string;
  countryCode?: string;
}

export interface MetaCapiEvent {
  /** Nom standard Meta — ex: "Lead", "Purchase", "InitiateCheckout". */
  eventName: string;
  /** MÊME identifiant que celui utilisé par le pixel navigateur. */
  eventId: string;
  /** URL de la page d'origine (améliore l'attribution). */
  eventSourceUrl?: string;
  userData?: MetaCapiUserData;
  customData?: Record<string, unknown>;
}

/** Extrait les infos de la requête utiles à l'appariement (IP, UA, cookies Meta). */
function requestContext(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for") || "";
  const clientIp = forwarded.split(",")[0]?.trim() || undefined;
  return {
    clientIp,
    userAgent: request.headers.get("user-agent") || undefined,
    // _fbp / _fbc sont déposés par le pixel : ce sont les meilleurs
    // signaux d'appariement disponibles, bien avant l'email.
    fbp: request.cookies.get("_fbp")?.value,
    fbc: request.cookies.get("_fbc")?.value,
  };
}

/**
 * Envoie un évènement à la Conversions API.
 * Ne lève jamais : une erreur de tracking ne doit pas casser une commande.
 */
export async function sendMetaCapiEvent(
  request: NextRequest,
  event: MetaCapiEvent,
): Promise<void> {
  if (!metaCapiEnabled) return;

  try {
    const ctx = requestContext(request);
    const u = event.userData ?? {};

    const user_data: Record<string, unknown> = {};
    if (u.email) user_data.em = [sha256(u.email)];
    if (u.phone) {
      const phone = normalizePhone(u.phone);
      if (phone) user_data.ph = [sha256(phone)];
    }
    if (u.fullName) {
      const parts = u.fullName.trim().split(/\s+/);
      if (parts[0]) user_data.fn = [sha256(parts[0])];
      if (parts.length > 1) user_data.ln = [sha256(parts[parts.length - 1])];
    }
    if (u.city) user_data.ct = [sha256(u.city.replace(/\s/g, ""))];
    user_data.country = [sha256(u.countryCode || "ma")];
    if (ctx.clientIp) user_data.client_ip_address = ctx.clientIp;
    if (ctx.userAgent) user_data.client_user_agent = ctx.userAgent;
    if (ctx.fbp) user_data.fbp = ctx.fbp;
    if (ctx.fbc) user_data.fbc = ctx.fbc;

    const payload: Record<string, unknown> = {
      data: [
        {
          event_name: event.eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: event.eventId,
          event_source_url: event.eventSourceUrl,
          action_source: "website",
          user_data,
          custom_data: event.customData ?? {},
        },
      ],
    };
    if (TEST_EVENT_CODE) payload.test_event_code = TEST_EVENT_CODE;

    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(ACCESS_TOKEN)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        // Le tracking ne doit jamais bloquer la réponse à l'utilisateur.
        signal: AbortSignal.timeout(4000),
      },
    );

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[Meta CAPI] Envoi refusé:", res.status, detail.slice(0, 400));
    }
  } catch (error) {
    console.error("[Meta CAPI] Erreur:", error);
  }
}
