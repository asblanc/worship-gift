"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { motion } from "framer-motion";

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0D0D0D] px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        {/* Logo + titre */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#C9A84C] to-[#F0CB6A] shadow-lg shadow-[#C9A84C]/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h1 className="font-heading text-3xl font-bold text-[#C9A84C]">
            Worship Gift
          </h1>
          <p className="mt-1 text-sm text-gray-400">Administration</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-xs font-medium uppercase tracking-wider text-gray-400">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@worship-gift.com"
              className="mt-2 block w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-[#C9A84C]/50 focus:ring-2 focus:ring-[#C9A84C]/20"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium uppercase tracking-wider text-gray-400">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="mt-2 block w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-[#C9A84C]/50 focus:ring-2 focus:ring-[#C9A84C]/20"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-xs text-red-400"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3.5 text-sm font-semibold transition-all duration-300 ${
              loading
                ? "cursor-not-allowed bg-gray-800 text-gray-500"
                : "bg-[#C9A84C] text-black hover:bg-[#F0CB6A] hover:shadow-lg hover:shadow-[#C9A84C]/30 active:scale-[0.98]"
            }`}
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                Connexion…
              </>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-gray-700">
          Accès réservé aux administrateurs
        </p>
      </motion.div>
    </div>
  );
}