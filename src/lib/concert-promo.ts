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

function moroccoCalendarDay(timestamp: number) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Casablanca",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(timestamp));

  const values = Object.fromEntries(
    parts
      .filter(({ type }) => type !== "literal")
      .map(({ type, value }) => [type, value]),
  );

  return Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
  );
}

export function remainingConcertDays(now = Date.now()) {
  // Le bandeau communique un nombre de jours calendaires, et non des tranches
  // de 24 h restantes : le 7 octobre doit donc afficher 4 jours avant le 11.
  return Math.max(
    0,
    Math.round(
      (moroccoCalendarDay(CONCERT_PROMO_DEADLINE) - moroccoCalendarDay(now)) /
        86_400_000,
    ),
  );
}
