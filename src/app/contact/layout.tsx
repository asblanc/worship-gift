import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Worship Gift, mouvement gospel au Maroc",
  description:
    "Contactez Worship Gift : téléphone, email, WhatsApp et réseaux sociaux. Une question sur nos concerts gospel au Maroc ou pour rejoindre le mouvement ? Écris-nous.",
  keywords: [
    "contact Worship Gift",
    "gospel Maroc contact",
    "rejoindre mouvement gospel",
    "Worship Gift WhatsApp",
  ],
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | Worship Gift",
    description:
      "Contactez le mouvement gospel Worship Gift : téléphone, email, WhatsApp et réseaux sociaux.",
    url: "/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
