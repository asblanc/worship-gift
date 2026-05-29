import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://worship-gift.vercel.app";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Worship Gift | Mouvement Gospel",
    template: "%s | Worship Gift",
  },
  description:
    "Mouvement gospel dédié au gospel, à l'adoration et à l'unité à travers la musique. Concerts, événements et sessions gospel.",
  keywords: [
    "gospel",
    "musique gospel",
    "adoration",
    "Worship Gift",
    "concert gospel",
    "musique chrétienne",
    "mouvement gospel",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Worship Gift",
    title: "Worship Gift | Mouvement Gospel",
    description:
      "Mouvement gospel dédié au gospel, à l'adoration et à l'unité à travers la musique.",
    url: siteUrl,
    images: [
      {
        url: "/img_worship-gift/logo-worship-gift2.jpeg",
        width: 1200,
        height: 1200,
        alt: "Worship Gift – Mouvement Gospel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Worship Gift | Mouvement Gospel",
    description:
      "Mouvement gospel dédié au gospel, à l'adoration et à l'unité à travers la musique.",
    images: ["/img_worship-gift/logo-worship-gift2.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/img_worship-gift/logo-worship-gift.png",
    apple: "/img_worship-gift/logo-worship-gift.png",
  },
};