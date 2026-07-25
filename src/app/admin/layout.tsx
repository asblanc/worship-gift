import type { Metadata } from "next";
import AdminShell from "@/components/AdminShell";

/* ================================================================
   Worship Gift — Layout de l'espace admin /admin
   Server component : porte le metadata (noindex — back-office privé)
   et délègue le rendu interactif à AdminShell (client).
   ================================================================ */

// Back-office : jamais indexé par les moteurs de recherche.
export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
