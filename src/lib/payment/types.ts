/* ================================================================
   Worship Gift — Payment Provider Types
   Interface abstraite pour toutes les passerelles de paiement.
   Ajouter un nouveau provider = implémenter cette interface.
   ================================================================ */

/** Devise supportée */
export type Currency = "MAD" | "EUR" | "USD";

/** Statut d'une commande */
export type OrderStatus = "pending" | "paid" | "failed" | "expired" | "refunded";

/** Données d'initialisation d'un paiement */
export interface PaymentInitRequest {
  /** Référence unique de la commande (générée par nous) */
  orderId: string;
  /** Montant en centimes (ex: 5000 = 50.00 MAD) */
  amount: number;
  /** Devise ISO (MAD par défaut) */
  currency: Currency;
  /** Email du client */
  customerEmail: string;
  /** Nom du client */
  customerName: string;
  /** Description (ex: "Concert Worship Gift - 2 billets VIP") */
  description: string;
  /** URL de retour après paiement réussi */
  okUrl: string;
  /** URL de retour après échec */
  failUrl: string;
  /** Métadonnées additionnelles */
  metadata?: Record<string, string | number>;
}

/** Résultat de l'initialisation : redirection ou formulaire HTML */
export interface PaymentInitResponse {
  /** URL de redirection vers la passerelle */
  redirectUrl?: string;
  /** Formulaire HTML auto-submit (méthode CMI classique) */
  formHtml?: string;
  /** Identifiant transaction chez le provider */
  transactionId?: string;
}

/** Données reçues par le callback serveur */
export interface PaymentCallback {
  /** Identifiant de transaction CMI */
  TransId?: string;
  /** Référence commande (notre orderId) */
  oid?: string;
  /** Montant payé */
  amount?: string;
  /** Code réponse (00 = succès) */
  Response?: string;
  /** Hash de vérification */
  HASH?: string;
  /** Résultat textuel */
  ProcReturnCode?: string;
  /** Code erreur */
  ErrMsg?: string;
  /** Données POST brutes */
  rawBody: Record<string, string | string[]>;
}

/** Résultat de vérification du callback */
export interface PaymentVerificationResult {
  /** true si le paiement est confirmé */
  success: boolean;
  /** Référence commande */
  orderId: string;
  /** Montant payé en centimes */
  amount: number;
  /** ID transaction chez le provider */
  transactionId?: string;
  /** Code erreur éventuel */
  errorCode?: string;
  /** Message erreur éventuel */
  errorMessage?: string;
}

/** Interface abstraite — à implémenter par chaque passerelle */
export interface PaymentProvider {
  readonly name: string;
  readonly displayName: string;
  readonly supportedCurrencies: Currency[];

  /** Génère les données pour initier un paiement */
  initiatePayment(req: PaymentInitRequest): Promise<PaymentInitResponse>;

  /** Vérifie la réponse du callback */
  verifyCallback(callback: PaymentCallback): Promise<PaymentVerificationResult>;
}