"use client";

import { type ReactNode } from "react";
import PageTransition from "@/components/PageTransition";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { AuthProvider } from "@/lib/supabase/auth-context";

export default function ClientLayout({ children }: { children: ReactNode }) {
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
