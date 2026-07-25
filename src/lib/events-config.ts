// ============================================================
//  Worship Gift — Événements
//  👉 C'EST ICI qu'on saisit le VRAI concert (chantre, date, salle,
//     catégories de billets, affiche). Tout le site se met à jour.
// ============================================================

// ⚙️ Numéro WhatsApp (format international, sans +, ni espaces)
// Exemple: "212600000000" pour le Maroc +212 6 00 00 00 00
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "212698472691";

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
  /** Petite description facultative (ce que la catégorie inclut). */
  description?: string;
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
  location: string;
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
    title: "Concert Gospel Worship Gift",
    // 🎤 Le chantre invité
    artist: "Jonathan Gambela",
    // 🔗 slug URL (minuscules, tirets) — évite de le changer une fois partagé
    slug: "concert-gospel-2026",
    date: "11 octobre 2026",
    time: "15h00",
    isoDate: "2026-10-11T15:00:00", // date/heure réelle (pour les rappels)
    location: "Casablanca",
    description:
      "Une soirée exceptionnelle de gospel et d'adoration avec le chantre Jonathan Gambela. Réserve ta place dès maintenant.",
    // « à partir de » = tarif le plus bas ci-dessous
    priceValue: 10000,
    price: "À partir de 100 MAD",
    ticketLink: "#",
    // 🔗 Colle ici le lien/code du prestataire (paiement en ligne). Vide pour l'instant.
    paymentUrl: "",
    // 🚚 Paiement à la livraison activé
    deliveryAvailable: true,
    // 🎟️ Catégories de billets — ajuste libellés et PRIX (en centimes MAD)
    ticketTypes: [
      {
        id: "standard",
        label: "Standard",
        priceValue: 10000, // 100 MAD ✏️
        price: "100 MAD",
        description: "Accès général",
        paymentUrl: "", // 🔗 lien prestataire pour cette catégorie (facultatif)
      },
      {
        id: "vip",
        label: "VIP",
        priceValue: 20000, // 200 MAD ✏️
        price: "200 MAD",
        description: "Placement privilégié",
        paymentUrl: "",
      },
      {
        id: "carre-or",
        label: "Carré Or",
        priceValue: 30000, // 300 MAD ✏️
        price: "300 MAD",
        description: "Premiers rangs + accueil privilégié",
        paymentUrl: "",
      },
    ],
    color: "#C9A84C",
    // 🖼️ AFFICHE : dépose la vraie affiche dans public/img_worship-gift/ et mets son chemin ici.
    // (placeholder existant en attendant la vraie affiche)
    coverImage: "/img_worship-gift/img_m16.jpg",
  },
];

// 🏠 Bloc « prochain événement » mis en avant sur l'accueil (home).
// Garde-le aligné avec le concert ci-dessus.
export const nextEvent = {
  title: "Concert Gospel Worship Gift",
  subtitle: "Une soirée Gospel avec Jonathan Gambela",
  date: new Date("2026-10-11T15:00:00"), // date réelle (compte à rebours)
  dateLabel: "11 octobre 2026",
  time: "15h00",
  location: "Casablanca",
  description:
    "Viens vivre un moment unique de Gospel avec le chantre Jonathan Gambela, au cœur du mouvement Worship Gift.",
  // 🖼️ Affiche du prochain concert — même image que ci-dessus idéalement
  coverImage: "/img_worship-gift/img_m16.jpg",
};

// 🎟️ Textes du bandeau défilant (Marquee)
export const marqueeTexts = [
  "WORSHIP GIFT",
  "GOSPEL EXPÉRIENCE",
  "GOSPEL & COMMUNION",
  "UNITÉ & CÉLÉBRATION",
  "CONCERT GOSPEL",
  "GOSPEL EN DIRECT",
];
