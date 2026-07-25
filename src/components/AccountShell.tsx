"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import AccountSidebar from "@/components/AccountSidebar";

/* ================================================================
   Worship Gift — Coquille client de l'espace utilisateur /account
   Protégé : redirige vers /auth/login si non connecté.
   (Le metadata/noindex est porté par app/account/layout.tsx.)
   ================================================================ */

export default function AccountShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      const name =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "";
      setUserName(name);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#C9A84C] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link
            href="/"
            className="font-heading text-lg font-bold tracking-wider text-white"
          >
            Worship Gift
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-gray-300 sm:inline">
              {userName}
            </span>
            <button
              onClick={handleLogout}
              className="rounded-md border border-white/20 px-3 py-1.5 text-xs text-gray-300 transition-colors hover:border-red-500/50 hover:text-red-400"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 md:flex-row md:gap-8 md:px-4 md:py-8">
        {/* Sidebar (desktop fixe) */}
        <aside className="w-full shrink-0 md:w-56">
          <div className="space-y-4 md:sticky md:top-24 md:space-y-6">
            <div className="rounded-lg border border-white/10 bg-white/[0.08] p-3 md:p-4">
              <p className="text-sm font-medium text-white">👋 {userName}</p>
              <p className="mt-1 text-xs text-gray-300">Mon espace</p>
            </div>
            <AccountSidebar />
          </div>
        </aside>

        {/* Contenu principal */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}