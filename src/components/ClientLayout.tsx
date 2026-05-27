"use client";

import { type ReactNode } from "react";
import PageTransition from "@/components/PageTransition";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/lib/supabase/auth-context";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <PageTransition>
        {children}
      </PageTransition>
      <Footer />
    </AuthProvider>
  );
}