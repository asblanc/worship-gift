import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez le mouvement gospel Worship Gift : téléphone, email, Facebook, Instagram et YouTube. Rejoignez-nous pour vivre une expérience Gospel unique.",
  openGraph: {
    title: "Contact | Worship Gift",
    description:
      "Contactez le mouvement gospel Worship Gift : téléphone, email, Facebook et YouTube.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}