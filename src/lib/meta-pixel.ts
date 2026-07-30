/* ================================================================
   Worship Gift — Meta Pixel (Facebook / Instagram)

   Helpers CÔTÉ CLIENT pour envoyer les évènements standards Meta.

   ⚙️ Activation : renseigner NEXT_PUBLIC_META_PIXEL_ID.
      Sans cette variable, AUCUN script de tracking n'est chargé et
      tous les appels ci-dessous sont des no-op (même logique que GA).

   🔁 Déduplication : chaque évènement « métier » (Lead, Purchase…)
      est envoyé DEUX fois — une fois par le navigateur (ici) et une
      fois par le serveur (Conversions API, voir meta-capi.server.ts).
      Les deux portent le MÊME eventId, Meta ne les compte qu'une fois
      mais gagne en fiabilité (bloqueurs de pub, iOS, WebView Android).
   ================================================================ */

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

/** true si le pixel est configuré (donc chargé). */
export const metaPixelEnabled = META_PIXEL_ID.length > 0;

/** Devise de la billetterie — utilisée dans tous les évènements à valeur. */
export const META_CURRENCY = "MAD";

/** Évènements standards Meta utilisés sur le site. */
export type MetaStandardEvent =
  | "PageView"
  | "ViewContent"
  | "AddToCart"
  | "InitiateCheckout"
  | "Lead"
  | "Contact"
  | "Purchase"
  | "CompleteRegistration"
  | "Search";

type FbqArgs = [string, ...unknown[]];

declare global {
  interface Window {
    fbq?: ((...args: FbqArgs) => void) & { queue?: unknown[] };
    _fbq?: unknown;
  }
}

/**
 * Identifiant unique d'évènement, partagé entre le pixel navigateur et
 * la Conversions API pour que Meta déduplique les deux envois.
 */
export function newMetaEventId(): string {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
  } catch {
    /* WebView anciens : on retombe sur la version simple ci-dessous */
  }
  return `wg-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Envoie un évènement standard au pixel.
 * No-op si le pixel n'est pas configuré ou pas encore chargé.
 */
export function trackMeta(
  event: MetaStandardEvent,
  params?: Record<string, unknown>,
  eventId?: string,
): void {
  if (!metaPixelEnabled || typeof window === "undefined" || !window.fbq) return;
  try {
    window.fbq("track", event, params ?? {}, eventId ? { eventID: eventId } : undefined);
  } catch {
    /* Le tracking ne doit jamais casser le parcours d'achat */
  }
}

/** Évènement personnalisé (hors liste standard Meta). */
export function trackMetaCustom(
  name: string,
  params?: Record<string, unknown>,
  eventId?: string,
): void {
  if (!metaPixelEnabled || typeof window === "undefined" || !window.fbq) return;
  try {
    window.fbq("trackCustom", name, params ?? {}, eventId ? { eventID: eventId } : undefined);
  } catch {
    /* idem */
  }
}

/* ----------------------------------------------------------------
   Payloads « e-commerce » — format attendu par Meta pour que
   l'algorithme comprenne QUOI est acheté et pour COMBIEN.
   ---------------------------------------------------------------- */

export interface MetaContentInput {
  /** id de l'évènement (concert) — ex: "concert-gospel-2026" */
  eventId: string;
  /** titre affiché — ex: "Concert Live de Jonathan Gambela" */
  eventTitle: string;
  /** id de la catégorie de billet — ex: "gold" */
  tierId?: string;
  /** libellé de la catégorie — ex: "Gold" */
  tierLabel?: string;
  /** prix unitaire en CENTIMES MAD (comme dans events-config) */
  unitPriceValue?: number;
  /** nombre de billets */
  quantity?: number;
}

/**
 * Construit les paramètres standards (content_ids, contents, value…)
 * à partir d'un évènement + d'une catégorie de billet.
 */
export function metaContentParams(input: MetaContentInput): Record<string, unknown> {
  const qty = Math.max(1, input.quantity ?? 1);
  const contentId = input.tierId ? `${input.eventId}:${input.tierId}` : input.eventId;
  const unitMad = (input.unitPriceValue ?? 0) / 100;

  return {
    content_type: "product",
    content_ids: [contentId],
    content_name: input.tierLabel
      ? `${input.eventTitle} — ${input.tierLabel}`
      : input.eventTitle,
    content_category: "Billetterie / Concert",
    contents: [{ id: contentId, quantity: qty, item_price: unitMad }],
    num_items: qty,
    value: unitMad * qty,
    currency: META_CURRENCY,
  };
}
