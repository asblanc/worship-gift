"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (err) {
      setError(err.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="font-heading text-2xl font-bold tracking-wider text-white"
          >
            Worship Gift
          </Link>
          <h1 className="mt-6 font-heading text-3xl font-bold text-white">
            Connexion
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Connecte-toi pour accéder à ton espace personnel.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
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
              placeholder="ton@email.com"
              className="mt-1.5 block w-full rounded-md border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none ring-0 transition-colors focus:border-[#C9A84C]"
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
              className="mt-1.5 block w-full rounded-md border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none ring-0 transition-colors focus:border-[#C9A84C]"
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
            className="flex h-11 w-full items-center justify-center rounded-md bg-[#C9A84C] text-sm font-semibold text-black transition-colors hover:bg-[#F0CB6A] disabled:opacity-50"
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Pas encore de compte ?{" "}
          <Link
            href="/auth/register"
            className="font-medium text-[#C9A84C] hover:text-[#F0CB6A]"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </main>
  );
}