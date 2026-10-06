"use client";

import { useEffect, type ReactNode } from "react";
import PageTransition from "@/components/PageTransition";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ConcertAnnouncement from "@/components/ConcertAnnouncement";
import MobileReservationBar from "@/components/MobileReservationBar";
import MetaClickTracking from "@/components/MetaClickTracking";
import { AuthProvider } from "@/lib/supabase/auth-context";

export default function ClientLayout({ children }: { children: ReactNode }) {
  // Marque l'hydratation réussie : désactive le filet anti page-blanche
  // (voir le script dans layout.tsx). Ne s'exécute que si le JS tourne.
  useEffect(() => {
    document.documentElement.setAttribute("data-hydrated", "1");
  }, []);

  return (
    <AuthProvider>
      <MetaClickTracking />
      <ConcertAnnouncement />
      <PageTransition>
        {children}
      </PageTransition>
      <Footer />
      <MobileReservationBar />
      {/* Bouton WhatsApp desktop — le CTA mobile est géré séparément. */}
      <WhatsAppFloat />
    </AuthProvider>
  );
}
