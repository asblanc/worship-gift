// ============================================================
//  Worship Gift — Événements
//  👉 C'EST ICI qu'on saisit le VRAI concert (chantre, date, salle,
//     catégories de billets, affiche). Tout le site se met à jour.
// ============================================================

// ⚙️ Numéro WhatsApp (format international, sans +, ni espaces)
// Exemple: "212600000000" pour le Maroc +212 6 00 00 00 00
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "212605426406";

/** Une catégorie de billet (tarif). */
export interface TicketType {
  /** Identifiant technique stable (minuscules, sans espace). Ex: "vip" */
  id: string;
  /** Libellé affiché. Ex: "VIP" */
  label: string;
  /** Prix unitaire en CENTIMES MAD. Ex: 20000 = 200 MAD. 0 = gratuit. */
  priceValue: number;
  /** Libellé prix affiché. Ex: "200 MAD" */
  price: string;
  /** Petite description facultative (résumé court affiché sous le libellé). */
  description?: string;
  /** Avantages détaillés de la catégorie (liste à puces). */
  perks?: string[];
  /**
   * 🔗 Lien de paiement du prestataire pour CETTE catégorie (facultatif).
   * Si vide, on utilise le paymentUrl de l'événement.
   */
  paymentUrl?: string;
  /** Passe à true quand la catégorie est épuisée. */
  soldOut?: boolean;
}

export interface EventData {
  id: string;
  title: string;
  /** 🎤 Le chantre / artiste principal invité (facultatif). */
  artist?: string;
  slug: string;
  date: string;
  time: string;
  /** Date/heure ISO 8601 — utilisée pour les rappels email automatiques. Ex: "2026-08-15T19:00:00" */
  isoDate: string;
  /** Lieu affiché, salle incluse. Ex: "Stade RUC, Casablanca" */
  location: string;
  /** 🏟️ Nom de la salle seule. Ex: "Stade RUC" (données structurées SEO). */
  venue?: string;
  /** 🏙️ Ville seule. Ex: "Casablanca" (SEO + appariement Meta). */
  city?: string;
  description: string;
  /** Prix « à partir de » en centimes (généralement = catégorie la moins chère). 0 = gratuit. */
  priceValue: number;
  /** Libellé affiché sur la liste billetterie. Ex: "À partir de 100 MAD". */
  price: string;
  ticketLink: string;
  /**
   * 🔗 Lien de paiement du prestataire EXTERNE (global à l'événement).
   * Colle ici le lien/‪code‬ fourni par ton prestataire de billetterie.
   * Sert de repli si une catégorie n'a pas son propre paymentUrl.
   */
  paymentUrl?: string;
  /** 🚚 true = « paiement à la livraison » proposé (organisé via WhatsApp). */
  deliveryAvailable?: boolean;
  /**
   * 🎟️ Catégories de billets (billetterie). Si vide/absent, l'événement
   * utilise le prix unique priceValue/price.
   */
  ticketTypes?: TicketType[];
  color: string;
  // 🖼️ Affiche de l'événement — chemin relatif dans /public/img_worship-gift/
  coverImage: string;
}

// ============================================================
//  🎫 CONCERT À VENIR — remplace les [CROCHETS] par les vraies infos.
//  Pour ajouter un 2ᵉ concert, duplique tout le bloc { ... }.
// ============================================================
export const upcomingEvents: EventData[] = [
  {
    id: "concert-gospel-2026",
    // 🏷️ Nom du concert
    title: "Concert Live de Jonathan Gambela",
    // 🎤 Le chantre invité
    artist: "Jonathan Gambela",
    // 🔗 slug URL (minuscules, tirets) — évite de le changer une fois partagé
    slug: "concert-gospel-2026",
    date: "11 octobre 2026",
    time: "15h00",
    isoDate: "2026-10-11T15:00:00", // date/heure réelle (pour les rappels)
    location: "Stade RUC, Casablanca",
    venue: "Stade RUC",
    city: "Casablanca",
    description:
      "Un concert live exceptionnel de gospel et d'adoration avec le chantre Jonathan Gambela. Réserve ta place dès maintenant.",
    // « à partir de » = tarif le plus bas ci-dessous
    priceValue: 20000,
    price: "À partir de 200 MAD",
    ticketLink: "#",
    // 🔗 Colle ici le lien/code du prestataire (paiement en ligne). Vide pour l'instant.
    paymentUrl: "",
    // 🚚 Paiement à la livraison activé
    deliveryAvailable: true,
    // 🎟️ Catégories de billets (prix en centimes MAD)
    ticketTypes: [
      {
        id: "standard",
        label: "Standard",
        priceValue: 20000, // 200 MAD
        price: "200 MAD",
        description: "Gradin — place confortable",
        perks: ["Accès standard", "Place confortable (gradin)"],
      },
      {
        id: "vip",
        label: "VIP",
        priceValue: 50000, // 500 MAD
        price: "500 MAD",
        description: "Devant la scène + snacks & boissons",
        perks: [
          "Accès VIP",
          "Place VIP située devant la scène",
          "Snacks et boissons offerts",
        ],
      },
      {
        id: "vip-duo",
        label: "Duo VIP",
        priceValue: 80000, // 800 MAD
        price: "800 MAD",
        description: "Expérience VIP pour 2 personnes",
        perks: [
          "Pour 2 personnes",
          "Accès VIP",
          "Place VIP située devant la scène",
          "Snacks et boissons offerts",
        ],
      },
      {
        id: "gold",
        label: "Gold",
        priceValue: 100000, // 1000 MAD
        price: "1000 MAD",
        description: "VVIP 1er rang · Meet & Greet · photo",
        perks: [
          "Accès VVIP et place réservée",
          "Meet & Greet (rencontre avec Jonathan Gambela)",
          "Place VVIP au premier rang, devant la scène",
          "Collation premium et boissons offertes",
          "Photo souvenir avec Jonathan Gambela",
        ],
      },
      {
        id: "gold-duo",
        label: "Duo Gold",
        priceValue: 160000, // 1600 MAD
        price: "1600 MAD",
        description: "Expérience Gold pour 2 personnes",
        perks: [
          "Pour 2 personnes",
          "Accès VVIP et place réservée",
          "Meet & Greet (rencontre avec Jonathan Gambela)",
          "Place VVIP au premier rang, devant la scène",
          "Collation premium et boissons offertes",
          "Photo souvenir avec Jonathan Gambela",
        ],
      },
    ],
    color: "#C9A84C",
    // 🖼️ AFFICHE : dépose la vraie affiche dans public/img_worship-gift/ et mets son chemin ici.
    // (placeholder existant en attendant la vraie affiche)
    coverImage: "/img_worship-gift/affiche-jonathan-gambela.png",
  },
];

// 🏠 Bloc « prochain événement » mis en avant sur l'accueil (home).
// Garde-le aligné avec le concert ci-dessus.
export const nextEvent = {
  title: "Concert Live de Jonathan Gambela",
  subtitle: "Concert live de gospel et d'adoration · Worship Gift",
  date: new Date("2026-10-11T15:00:00"), // date réelle (compte à rebours)
  dateLabel: "11 octobre 2026",
  time: "15h00",
  location: "Stade RUC, Casablanca",
  venue: "Stade RUC",
  city: "Casablanca",
  description:
    "Viens vivre un concert live unique de Gospel avec le chantre Jonathan Gambela, au cœur du mouvement Worship Gift.",
  // 🖼️ Affiche du prochain concert — même image que ci-dessus idéalement
  coverImage: "/img_worship-gift/affiche-jonathan-gambela.png",
};

// 🎟️ Textes du bandeau défilant (Marquee)
export const marqueeTexts = [
  "CONCERT LIVE · JONATHAN GAMBELA",
  "11 OCTOBRE 2026 · STADE RUC, CASABLANCA",
  "BILLETS EN VENTE",
  "WORSHIP GIFT",
  "GOSPEL EXPÉRIENCE",
  "PLACES LIMITÉES",
];
