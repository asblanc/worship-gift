"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

/* ================================================================
   Worship Gift — /admin/login
   Page de connexion admin.
   Vérifie que l'utilisateur a le rôle "admin" dans user_metadata.
   
   Pour créer un admin : dans le dashboard Supabase > Auth > Users,
   ajouter {"role": "admin"} dans le champ user_metadata.
   ================================================================ */

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: authErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authErr) throw authErr;

      // Vérifier le rôle admin
      const isAdmin = data.user?.user_metadata?.role === "admin";
      if (!isAdmin) {
        await supabase.auth.signOut();
        throw new Error("Accès refusé : vous n'êtes pas administrateur.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erreur de connexion";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
        <h1 className="font-heading text-2xl font-bold text-white text-center">
          Administration
        </h1>
        <p className="mt-2 text-center text-sm text-gray-400">
          Worship Gift
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@worshipgift.ma"
              className="mt-1 block w-full rounded-md border border-gray-700 bg-black px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="mt-1 block w-full rounded-md border border-gray-700 bg-black px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]"
            />
          </div>

          {error && (
            <p className="rounded-md bg-red-500/10 px-3 py-2 text-xs text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-semibold transition-all ${
              loading
                ? "cursor-not-allowed bg-gray-700 text-gray-400"
                : "bg-[#C9A84C] text-black hover:bg-[#F0CB6A]"
            }`}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-600">
          Réservé aux administrateurs
        </p>
      </div>
    </div>
  );
}