import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galerie — Photos des concerts gospel Worship Gift",
  description:
    "Revivez en images les concerts et soirées d'adoration Worship Gift au Maroc. Gospel, communion et émotion : découvrez les albums photos de nos événements.",
  keywords: [
    "galerie gospel",
    "photos concert gospel Maroc",
    "Worship Gift photos",
    "concert gospel Casablanca",
    "adoration",
  ],
  alternates: { canonical: "/galerie" },
  openGraph: {
    title: "Galerie | Worship Gift",
    description:
      "Photos des concerts et soirées d'adoration gospel Worship Gift au Maroc.",
    url: "/galerie",
  },
};

export default function GalerieLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
