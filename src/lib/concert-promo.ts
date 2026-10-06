/**
 * Date officielle du concert, exprimée avec le fuseau du Maroc.
 * Le 11 octobre 2026, Africa/Casablanca est à UTC+01:00.
 */
export const CONCERT_PROMO_DEADLINE = new Date("2026-10-11T15:00:00+01:00").getTime();

export const WHATSAPP_CONCERT_URL =
  "https://wa.me/212605426406?text=Bonjour%2C%20je%20veux%20des%20infos%20pour%20le%20concert%20du%2011%20octobre";

export function isConcertPromoOver(now = Date.now()) {
  return now >= CONCERT_PROMO_DEADLINE;
}

export function remainingConcertDays(now = Date.now()) {
  return Math.max(0, Math.ceil((CONCERT_PROMO_DEADLINE - now) / 86_400_000));
}
