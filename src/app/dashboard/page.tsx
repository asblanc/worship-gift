"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";

interface Profile {
  nom: string;
  email: string;
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      setProfile({
        nom: user.user_metadata?.full_name || user.email?.split("@")[0] || "",
        email: user.email || "",
      });
      setLoading(false);
    };

    getProfile();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-4">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#C9A84C] border-t-transparent" />
          <p className="text-sm text-gray-300">Chargement…</p>
        </div>
      </main>
    );
  }

  if (!profile) return null;

  return (
    <main className="min-h-screen bg-black">
      {/* ─── Header ─────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 items-center justify-between px-4 sm:h-16 sm:max-w-5xl">
          <Link
            href="/"
            className="font-heading text-base font-bold tracking-wider text-white sm:text-lg"
          >
            Worship Gift
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-md border border-white/20 px-3 py-1.5 text-xs text-gray-300 transition-colors hover:border-[#C9A84C]/50 hover:text-[#C9A84C] sm:px-4 sm:py-2 sm:text-sm"
          >
            Se déconnecter
          </button>
        </div>
      </header>

      {/* ─── Contenu ────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 md:py-16">
        {/* Profil */}
        <section className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 text-base font-bold text-[#C9A84C] sm:h-16 sm:w-16 sm:text-xl">
              {profile.nom.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="truncate font-heading text-lg font-bold text-white sm:text-2xl">
                Bonjour, {profile.nom}
              </h1>
              <p className="truncate text-xs text-gray-300 sm:text-sm">
                {profile.email}
              </p>
            </div>
          </div>
        </section>

        {/* Mes billets */}
        <section className="rounded-lg border border-white/10 bg-white/[0.03] p-5 sm:p-8">
          <h2 className="font-heading text-base font-semibold text-white sm:text-xl">
            Mes billets
          </h2>
          <p className="mt-3 text-xs leading-relaxed text-gray-300 sm:text-sm">
            Tu n&rsquo;as pas encore de billet réservé. Rends-toi sur la page
            Billetterie pour réserver ta place pour nos prochains événements.
          </p>
          <Link
            href="/billetterie"
            className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-[#C9A84C] px-5 text-xs font-semibold text-black transition-all hover:bg-[#F0CB6A] hover:shadow-lg hover:shadow-[#C9A84C]/20 active:scale-[0.97] sm:mt-5 sm:px-6 sm:text-sm"
          >
            Voir la billetterie
          </Link>
        </section>
      </div>
    </main>
  );
}