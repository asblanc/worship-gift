// ============================================================
//  Worship Gift — Événements
//  Modifier les données ici pour mettre à jour tout le site.
// ============================================================

// ⚙️ Numéro WhatsApp (format international, sans +, ni espaces)
// Exemple: "212600000000" pour le Maroc +212 6 00 00 00 00
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "212698472691";

export const nextEvent = {
  title: "Worship Gift – Gospel Expérience",
  subtitle: "Une soirée Gospel et de communion",
  date: new Date("2026-08-15T19:00:00"),
  dateLabel: "15 août 2026",
  time: "19h00",
  location: "Casablanca, Maroc",
  description:
    "Viens vivre un moment unique de Gospel au cœur du mouvement Worship Gift. Une soirée placée sous le signe de l'unité, de la joie et de la puissance du gospel.",
  // 🖼️ Affiche du prochain concert — changer ici pour mettre à jour la home
  coverImage: "/img_worship-gift/img_m15.jpg",
};

export interface EventData {
  id: string;
  title: string;
  slug: string;
  date: string;
  time: string;
  /** Date/heure ISO 8601 — utilisée pour les rappels email automatiques. Ex: "2026-08-15T19:00:00" */
  isoDate: string;
  location: string;
  description: string;
  /** Prix unitaire en centimes (MAD). 0 = gratuit. Ex: 5000 = 50 MAD */
  priceValue: number;
  /** Libellé affiché (ex: "Gratuit", "50 MAD", "VIP 150 MAD") */
  price: string;
  ticketLink: string;
  color: string;
  // 🖼️ Affiche de l'événement — chemin relatif /img_worship-gift/
  coverImage: string;
}

export const upcomingEvents: EventData[] = [
  {
    id: "evt-001",
    // 🏷️ Titre de l'événement 1
    title: "Worship Gift – Gospel Expérience",
    slug: "worship-gift-gospel-experience",
    date: "15 août 2026",
    time: "19h00",
    isoDate: "2026-08-15T19:00:00",
    location: "Casablanca, Maroc",
    description:
      "Une soirée Gospel pour célébrer ensemble la puissance et la joie du gospel.",
    priceValue: 0, // Gratuit
    price: "Gratuit",
    ticketLink: "#",
    color: "#C9A84C",
    // 🖼️ Affiche événement 1 — modifier ici
    coverImage: "/img_worship-gift/img_m16.jpg",
  },
  {
    id: "evt-002",
    // 🏷️ Titre de l'événement 2
    title: "Worship Gift – Gospel Expérience Vol. 2",
    slug: "worship-gift-gospel-experience-vol2",
    date: "15 août 2026",
    time: "21h00",
    isoDate: "2026-08-15T21:00:00",
    location: "Casablanca, Maroc",
    description:
      "La seconde session de la soirée Gospel — une expérience encore plus profonde et vibrante.",
    priceValue: 0, // Gratuit
    price: "Gratuit",
    ticketLink: "#",
    color: "#C9A84C",
    // 🖼️ Affiche événement 2 — modifier ici
    coverImage: "/img_worship-gift/img_m18.jpg",
  },
  {
    id: "evt-003",
    // 🏷️ Titre de l'événement 3
    title: "Session Gospel – Spéciale",
    slug: "session-gospel-speciale",
    date: "20 septembre 2026",
    time: "18h30",
    isoDate: "2026-09-20T18:30:00",
    location: "Rabat, Maroc",
    description:
      "Un moment d'intimité et de prière à travers la musique et le gospel.",
    priceValue: 5000, // 50 MAD
    price: "50 MAD",
    ticketLink: "#",
    color: "#F0CB6A",
    // 🖼️ Affiche événement 3 — modifier ici
    coverImage: "/img_worship-gift/img_m14.jpg",
  },
  {
    id: "evt-004",
    // 🏷️ Titre de l'événement 4
    title: "Gospel Night – Rassemblement d'été",
    slug: "gospel-night-rassemblement-ete",
    date: "10 octobre 2026",
    time: "20h00",
    isoDate: "2026-10-10T20:00:00",
    location: "Marrakech, Maroc",
    description:
      "Le grand rassemblement gospel de l'été avec plusieurs chorales invitées.",
    priceValue: 7500, // 75 MAD
    price: "75 MAD",
    ticketLink: "#",
    color: "#C9A84C",
    // 🖼️ Affiche événement 4 — modifier ici
    coverImage: "/img_worship-gift/img_d17.jpg",
  },
];

// 🎟️ Textes du bandeau défilant (Marquee)
export const marqueeTexts = [
  "WORSHIP GIFT",
  "GOSPEL EXPÉRIENCE",
  "GOSPEL & COMMUNION",
  "UNITÉ & CÉLÉBRATION",
  "RASSEMBLEMENT D'ÉTÉ",
  "GOSPEL EN DIRECT",
];
