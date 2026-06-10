import type { Metadata } from "next";
import { nextEvent } from "@/lib/events-config";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.worship-gift.com";

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
    // Utiliser la version "tile" (carrée) pour les rich results / structured data
    logo: `${siteUrl}/img_worship-gift/logo-tile.png`,
    description:
      "Mouvement gospel dédié au gospel, à l'adoration et à l'unité à travers la musique.",
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Worship Gift",
    url: siteUrl,
  };

  const musicEvent = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: nextEvent.title,
    description: nextEvent.description,
    startDate: nextEvent.date.toISOString(),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: `${siteUrl}${nextEvent.coverImage}`,
    location: {
      "@type": "Place",
      name: nextEvent.location,
      address: nextEvent.location,
    },
    organizer: {
      "@type": "Organization",
      name: "Worship Gift",
      url: siteUrl,
    },
  };

  return [organization, website, musicEvent];
}

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Worship Gift | Concerts & Billetterie Gospel au Maroc",
    template: "%s | Worship Gift",
  },
  description:
    "Worship Gift, mouvement gospel au Maroc. Vivez des concerts et sessions d'adoration uniques à Casablanca, Rabat et Marrakech. Réservez vos billets en ligne pour la musique gospel en direct.",
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
    title: "Worship Gift | Concerts & Billetterie Gospel au Maroc",
    description:
      "Mouvement gospel au Maroc : concerts, événements et sessions d'adoration à Casablanca, Rabat et Marrakech. Réservez vos billets en ligne.",
    url: siteUrl,
    // L'image OG est fournie par app/opengraph-image.tsx (1200x630)
  },
  twitter: {
    card: "summary_large_image",
    title: "Worship Gift | Concerts & Billetterie Gospel au Maroc",
    description:
      "Mouvement gospel au Maroc : concerts, événements et sessions d'adoration. Réservez vos billets en ligne.",
    // L'image Twitter est fournie par app/opengraph-image.tsx
  },
  robots: {
    index: true,
    follow: true,
  },
  // Favicons : app/icon.png + app/apple-icon.png (convention Next)
};