import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boutique — Collection JE SUIS CHOISI | Worship Gift",
  description: "Découvrez la collection Édition Limitée JE SUIS CHOISI de Worship Gift. Commande par WhatsApp ou téléphone.",
  alternates: { canonical: "/boutique" },
};

export default function BoutiqueLayout({ children }: { children: React.ReactNode }) {
  return children;
}
