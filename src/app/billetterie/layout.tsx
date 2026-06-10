import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Billetterie — Réservez vos billets de concert gospel au Maroc",
  description:
    "Réservez vos billets pour les concerts et événements gospel Worship Gift à Casablanca, Rabat et Marrakech. Paiement par carte bancaire (CMI) ou réservation WhatsApp avec livraison.",
  keywords: [
    "billetterie gospel",
    "billets concert gospel Maroc",
    "réserver concert gospel Casablanca",
    "événement gospel Maroc",
    "Worship Gift billetterie",
    "concert gospel",
  ],
  alternates: { canonical: "/billetterie" },
  openGraph: {
    title: "Billetterie | Worship Gift",
    description:
      "Réservez vos billets pour les concerts et événements gospel Worship Gift au Maroc.",
    url: "/billetterie",
  },
};

export default function BilletterieLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
