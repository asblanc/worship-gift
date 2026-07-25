/* ================================================================
   Worship Gift — Utilitaires de sécurité (serveur)
   ================================================================ */

import { timingSafeEqual } from "crypto";

/**
 * Comparaison de chaînes à TEMPS CONSTANT (anti timing-attack).
 *
 * Une comparaison classique (`a === b`) court-circuite dès le premier
 * octet différent : un attaquant peut mesurer le temps de réponse pour
 * deviner un secret octet par octet (hash de paiement, secret de cron…).
 * `timingSafeEqual` compare toujours toute la longueur.
 *
 * Renvoie false (sans fuite de longueur) si les tailles diffèrent.
 */
export function safeEqual(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/**
 * Valide un chemin de redirection interne : doit commencer par "/"
 * sans être un chemin protocolaire ("//evil.com", "/\evil.com").
 * Empêche les open-redirects après authentification.
 */
export function safeRedirectPath(path: string | null | undefined, fallback = "/"): string {
  if (!path || typeof path !== "string") return fallback;
  if (!path.startsWith("/")) return fallback;
  if (path.startsWith("//")) return fallback;
  if (path.startsWith("/\\")) return fallback;
  return path;
}
