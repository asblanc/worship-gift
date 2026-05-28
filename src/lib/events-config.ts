// ============================================================
//  Worship Gift — Événements
//  Modifier les données ici pour mettre à jour tout le site.
// ============================================================

export const nextEvent = {
  title: "Worship Gift – Concert de Louange",
  subtitle: "Une soirée d'adoration et de communion",
  date: new Date("2026-08-15T19:00:00"),
  dateLabel: "15 août 2026",
  time: "19h00",
  location: "Casablanca, Maroc",
  description:
    "Viens vivre un moment unique de louange et d'adoration au cœur du mouvement Worship Gift. Une soirée placée sous le signe de l'unité, de la joie et de la puissance du gospel.",
  coverImage: "/img_worship-gift/hero-1.jpg",
};

export interface EventData {
  id: string;
  title: string;
  slug: string;
  date: string;
  time: string;
  location: string;
  description: string;
  /** Prix unitaire en centimes (MAD). 0 = gratuit. Ex: 5000 = 50 MAD */
  priceValue: number;
  /** Libellé affiché (ex: "Gratuit", "50 MAD", "VIP 150 MAD") */
  price: string;
  ticketLink: string;
  color: string;
}

export const upcomingEvents: EventData[] = [
  {
    id: "evt-001",
    title: "Worship Gift – Concert de Louange",
    slug: "worship-gift-concert-louange",
    date: "15 août 2026",
    time: "19h00",
    location: "Casablanca, Maroc",
    description:
      "Une soirée de louange et d'adoration pour célébrer ensemble la puissance du gospel.",
    priceValue: 0, // Gratuit
    price: "Gratuit",
    ticketLink: "#",
    color: "#C9A84C",
  },
  {
    id: "evt-002",
    title: "Soirée d'adoration – Session Spéciale",
    slug: "soiree-adoration-speciale",
    date: "20 septembre 2026",
    time: "18h30",
    location: "Rabat, Maroc",
    description:
      "Un moment d'intimité et de prière à travers la musique et la louange.",
    priceValue: 5000, // 50 MAD
    price: "50 MAD",
    ticketLink: "#",
    color: "#F0CB6A",
  },
  {
    id: "evt-003",
    title: "Gospel Night – Rassemblement d'été",
    slug: "gospel-night-rassemblement-ete",
    date: "10 octobre 2026",
    time: "20h00",
    location: "Marrakech, Maroc",
    description:
      "Le grand rassemblement gospel de l'été avec plusieurs chorales invitées.",
    priceValue: 7500, // 75 MAD
    price: "75 MAD",
    ticketLink: "#",
    color: "#C9A84C",
  },
];

export const marqueeTexts = [
  "WORSHIP GIFT",
  "CONCERT DE LOUANGE",
  "GOSPEL & ADORATION",
  "UNITÉ & COMMUNION",
  "RASSEMBLEMENT D'ÉTÉ",
  "LOUANGE EN DIRECT",
];