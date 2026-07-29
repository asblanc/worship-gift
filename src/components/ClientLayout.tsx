"use client";

import { useEffect, type ReactNode } from "react";
import PageTransition from "@/components/PageTransition";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { AuthProvider } from "@/lib/supabase/auth-context";

export default function ClientLayout({ children }: { children: ReactNode }) {
  // Marque l'hydratation réussie : désactive le filet anti page-blanche
  // (voir le script dans layout.tsx). Ne s'exécute que si le JS tourne.
  useEffect(() => {
    document.documentElement.setAttribute("data-hydrated", "1");
  }, []);

  return (
    <AuthProvider>
      <PageTransition>
        {children}
      </PageTransition>
      <Footer />
      {/* Bouton WhatsApp flottant — supprimer cette ligne pour le désactiver */}
      <WhatsAppFloat />
    </AuthProvider>
  );
}
