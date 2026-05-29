import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Billetterie",
  description:
    "Réservez vos places pour les événements Worship Gift : concerts gospel, soirées d'adoration et rassemblements gospel.",
  openGraph: {
    title: "Billetterie | Worship Gift",
    description:
      "Réservez vos places pour les événements Worship Gift : concerts gospel, soirées d'adoration et rassemblements gospel.",
  },
};

export default function BilletterieLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}