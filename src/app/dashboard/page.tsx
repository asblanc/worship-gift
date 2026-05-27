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
      <main className="flex min-h-screen items-center justify-center bg-black">
        <p className="text-gray-400">Chargement…</p>
      </main>
    );
  }

  if (!profile) return null;

  return (
    <main className="min-h-screen bg-black">
      {/* Header du dashboard */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link
            href="/"
            className="font-heading text-lg font-bold tracking-wider text-white"
          >
            Worship Gift
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-md border border-white/20 px-4 py-2 text-sm text-gray-300 transition-colors hover:border-[#C9A84C]/50 hover:text-[#C9A84C]"
          >
            Se déconnecter
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
        {/* Profil */}
        <section className="mb-12">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 text-xl font-bold text-[#C9A84C]">
              {profile.nom.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-white">
                Bonjour, {profile.nom}
              </h1>
              <p className="text-sm text-gray-400">{profile.email}</p>
            </div>
          </div>
        </section>

        {/* Mes billets */}
        <section className="rounded-lg border border-white/10 p-8">
          <h2 className="font-heading text-xl font-semibold text-white">
            Mes billets
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-400">
            Tu n'as pas encore de billet réservé. Rends-toi sur la page
            Billetterie pour réserver ta place pour nos prochains événements.
          </p>
          <Link
            href="/billetterie"
            className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-[#C9A84C] px-6 text-sm font-semibold text-black transition-colors hover:bg-[#F0CB6A]"
          >
            Voir la billetterie
          </Link>
        </section>
      </div>
    </main>
  );
}