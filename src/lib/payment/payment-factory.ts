/* ================================================================
   Worship Gift — Payment Factory
   Permet d'obtenir le provider de paiement actif.
   Extensible : ajouter un nouveau provider ici quand tu auras
   besoin d'une passerelle internationale (ex: Stripe).
   ================================================================ */

import type { PaymentProvider, Currency } from "./types";
import { CmiProvider } from "./cmi-provider";

/**
 * Providers disponibles.
 * Pour l'instant seul CMI est implemente.
 *
 * Pour ajouter Stripe plus tard :
 * 1. Creer src/lib/payment/stripe-provider.ts (implemente PaymentProvider)
 * 2. L'importer ici
 * 3. L'ajouter au tableau providers
 */
const providers: PaymentProvider[] = [
  new CmiProvider(),
  // Futur: new StripeProvider(),
  // Futur: new PayPalProvider(),
];

/**
 * Retourne le provider correspondant au nom donne.
 * @param name - "cmi" | "stripe" (futur)
 */
export function getPaymentProvider(name: string): PaymentProvider | undefined {
  return providers.find((p) => p.name === name);
}

/**
 * Retourne le provider par defaut (CMI pour le Maroc).
 */
export function getDefaultPaymentProvider(): PaymentProvider {
  return providers[0]; // CMI
}

/**
 * Retourne les providers disponibles pour une devise donnee.
 * Utile pour afficher les options de paiement filtrees.
 */
export function getProvidersForCurrency(
  currency: Currency
): PaymentProvider[] {
  return providers.filter((p) => p.supportedCurrencies.includes(currency));
}

/**
 * Retourne tous les providers disponibles.
 * Utile pour la page checkout qui affiche les options.
 */
export function getAvailableProviders(): PaymentProvider[] {
  return [...providers];
}