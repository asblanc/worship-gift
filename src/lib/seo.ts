import type { Metadata } from "next";
import { nextEvent, upcomingEvents } from "@/lib/events-config";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.worship-gift.com";

// Vrai : la valeur est encore un gabarit "[...]" (non renseigné)
const isPlaceholder = (s?: string) => !s || s.includes("[");

/* ------------------------------------------------------------------
   Donnees structurees JSON-LD (rich results Google)
   - Organization : identite du mouvement
   - WebSite : nom du site
   - MusicEvent : prochain concert (date ISO depuis nextEvent.date)
   ------------------------------------------------------------------ */
export function buildJsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Worship Gift",
    url: siteUrl,
    // Utiliser la version 512x512 sans marges pour les rich results
    logo: `${siteUrl}/img_worship-gift/logo-512.png`,
    description:
      "Mouvement gospel dédié au gospel, à l'adoration et à l'unité à travers la musique.",
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Worship Gift",
    url: siteUrl,
  };

  const concert = upcomingEvents[0];

  // Offres billetterie (tarifs) → rich results avec prix
  const offers = (concert?.ticketTypes ?? []).map((t) => ({
    "@type": "Offer",
    name: t.label,
    price: (t.priceValue / 100).toFixed(2),
    priceCurrency: "MAD",
    availability: t.soldOut
      ? "https://schema.org/SoldOut"
      : "https://schema.org/InStock",
    url: `${siteUrl}/billetterie/${concert.slug}/reserver`,
  }));

  const musicEvent = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Concert Jonathan Gambela 11 octobre 2026 Casablanca – Billets",
    description: nextEvent.description,
    startDate: "2026-10-11T15:00:00+01:00",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: `${siteUrl}${nextEvent.coverImage}`,
    url: `${siteUrl}/billetterie`,
    // Lieu détaillé : Google exige une salle + une adresse structurée pour
    // afficher l'événement en résultat enrichi (fiche avec date et lieu).
    location: {
      "@type": "Place",
      name: nextEvent.venue || nextEvent.location,
      address: {
        "@type": "PostalAddress",
        addressLocality: nextEvent.city || nextEvent.location,
        addressCountry: "MA",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "Worship Gift",
      url: siteUrl,
    },
    // Le chantre (uniquement si renseigné, jamais le gabarit)
    ...(concert && !isPlaceholder(concert.artist)
      ? { performer: { "@type": "MusicGroup", name: concert.artist } }
      : {}),
    // Les tarifs (uniquement si des catégories existent)
    ...(offers.length ? { offers } : {}),
  };

  return [organization, website, musicEvent];
}

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Concert Jonathan Gambela 11 octobre 2026 Casablanca – Billets",
    template: "%s | Worship Gift",
  },
  description:
    "Concert Jonathan Gambela le 11 octobre 2026 au Stade RUC de Casablanca. Billets de 200 à 1600 MAD pour l'Africa Tour Worship Gift.",
  keywords: [
    "Worship Gift",
    "gospel Maroc",
    "concert gospel",
    "concert gospel Casablanca",
    "billetterie gospel",
    "événement gospel Maroc",
    "musique gospel",
    "musique chrétienne",
    "adoration",
    "mouvement gospel",
    "louange",
    "concert chrétien Maroc",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Worship Gift",
    title: "Concert Jonathan Gambela 11 octobre 2026 Casablanca – Billets",
    description:
      "Concert Jonathan Gambela le 11 octobre 2026 au Stade RUC de Casablanca. Réservez vos billets pour l'Africa Tour.",
    url: siteUrl,
    images: [
      {
        url: "/img_worship-gift/affiche-africa-tour.webp",
        width: 768,
        height: 960,
        alt: "Affiche Africa Tour — Jonathan Gambela à Casablanca",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Concert Jonathan Gambela 11 octobre 2026 Casablanca – Billets",
    description:
      "Concert Jonathan Gambela le 11 octobre 2026 au Stade RUC de Casablanca. Réservez vos billets pour l'Africa Tour.",
    images: ["/img_worship-gift/affiche-africa-tour.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
  // Favicons : app/icon.png + app/apple-icon.png (convention Next)
};
