import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Découvrez la vision, la mission et l'histoire du mouvement gospel Worship Gift. Gospel, unité et excellence au service de l'adoration.",
  openGraph: {
    title: "À propos | Worship Gift",
    description:
      "Découvrez la vision, la mission et l'histoire du mouvement gospel Worship Gift.",
  },
};

export default function AProposLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}