import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galerie",
  description:
    "Revivez les meilleurs moments des rencontres Worship Gift à travers notre galerie d'images. Louange, adoration et communion en photos.",
  openGraph: {
    title: "Galerie | Worship Gift",
    description:
      "Revivez les meilleurs moments des rencontres Worship Gift à travers notre galerie d'images.",
  },
};

export default function GalerieLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}