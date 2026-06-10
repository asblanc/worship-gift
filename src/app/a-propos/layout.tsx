import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos — Le mouvement gospel Worship Gift au Maroc",
  description:
    "Découvrez Worship Gift : vision, mission et histoire du mouvement gospel au Maroc. Unité, adoration et excellence au service de la musique gospel à Casablanca, Rabat et Marrakech.",
  keywords: [
    "Worship Gift",
    "mouvement gospel Maroc",
    "à propos Worship Gift",
    "gospel Maroc",
    "adoration",
    "vision gospel",
  ],
  alternates: { canonical: "/a-propos" },
  openGraph: {
    title: "À propos | Worship Gift",
    description:
      "Vision, mission et histoire du mouvement gospel Worship Gift au Maroc.",
    url: "/a-propos",
  },
};

export default function AProposLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
