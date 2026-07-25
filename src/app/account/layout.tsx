import type { Metadata } from "next";
import AccountShell from "@/components/AccountShell";

/* ================================================================
   Worship Gift — Layout de l'espace utilisateur /account
   Server component : porte le metadata (noindex — page privée) et
   délègue le rendu interactif à AccountShell (client).
   ================================================================ */

// Espace personnel connecté : jamais indexé par les moteurs de recherche.
export const metadata: Metadata = {
  title: "Mon espace",
  robots: { index: false, follow: false },
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AccountShell>{children}</AccountShell>;
}
