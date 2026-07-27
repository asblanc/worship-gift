"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

/* ================================================================
   Icônes SVG minimales pour les providers OAuth
================================================================ */

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.785 9.169c0-.738-.06-1.276-.189-1.834h-8.42v3.328h4.942c-.1.828-.638 2.073-1.834 2.91l-.016.112 2.662 2.063.185.018c1.694-1.565 2.67-3.867 2.67-6.597z"
      />
      <path
        fill="#34A853"
        d="M9.175 17.938c2.422 0 4.455-.797 5.94-2.172l-2.83-2.193c-.758.528-1.774.897-3.11.897-2.372 0-4.385-1.564-5.102-3.727l-.105.01-2.769 2.142-.036.1c1.475 2.93 4.504 4.943 8.012 4.943z"
      />
      <path
        fill="#FBBC05"
        d="M4.073 10.743c-.19-.558-.3-1.156-.3-1.774 0-.618.11-1.216.29-1.774l-.005-.119-2.803-2.178-.092.044C.525 6.21 0 7.55 0 8.969c0 1.418.525 2.758 1.38 3.964l2.693-2.19z"
      />
      <path
        fill="#EB4335"
        d="M9.175 3.554c1.685 0 2.82.728 3.468 1.336l2.531-2.471C13.62.997 11.598 0 9.175 0 5.667 0 2.638 2.012 1.163 4.943l2.803 2.178c.727-2.163 2.74-3.567 5.21-3.567z"
      />
    </svg>
  );
}



export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const router = useRouter();

  // Lire les query params (error, message)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "auth_failed") {
      setError("La connexion a échoué. Réessaie.");
    }
  }, []);

  // Si déjà connecté, rediriger immédiatement
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const isAdmin = session.user?.app_metadata?.role === "admin";
        window.location.href = isAdmin ? "/admin" : "/account";
      }
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (err) {
      if (err.message === "Invalid login credentials") {
        setError(
          "Email ou mot de passe incorrect. Pas encore de compte ? "
        );
        setInfo("register");
      } else {
        setError(err.message);
      }
      setLoading(false);
      return;
    }

    if (data.session) {
      const isAdmin = data.session.user?.app_metadata?.role === "admin";
      // Hard redirect pour forcer le middleware à relire les cookies
      window.location.href = isAdmin ? "/admin" : "/account";
    } else {
      setError("Connexion échouée. Réessaie.");
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google") => {
    setSocialLoading(provider);
    setError("");

    const { error: err } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (err) {
      setError(err.message);
      setSocialLoading(null);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen items-center justify-center bg-black px-4 pt-24 pb-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            {/* Logo cliquable */}
            <Link href="/" className="mx-auto mb-6 block w-fit">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full ring-1 ring-[#C9A84C]/40 bg-black p-1 shadow-lg shadow-[#C9A84C]/10">
                <Image
                  src="/img_worship-gift/logo-worship-gift2.jpeg"
                  alt="Worship Gift"
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full object-cover"
                />
              </div>
              <span className="mt-3 block font-heading text-2xl font-bold tracking-wider text-white">
                Worship Gift
              </span>
            </Link>
            <h1 className="mt-6 t-h2 text-white">
              Connexion
            </h1>
            <p className="mt-2 text-sm text-gray-300">
              Connecte-toi pour accéder à ton espace personnel.
            </p>
          </div>

          {/* --- Boutons de connexion sociale --- */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleOAuth("google")}
              disabled={socialLoading !== null}
              className="flex h-11 w-full items-center justify-center gap-3 rounded-md border border-white/20 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50"
            >
              {socialLoading === "google" ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
              ) : (
                <GoogleIcon />
              )}
              Continuer avec Google
            </button>

          </div>

          {/* Séparateur "ou" */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/15" />
            <span className="text-xs text-gray-300">ou</span>
            <div className="h-px flex-1 bg-white/15" />
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
                {info === "register" && (
                  <Link
                    href="/auth/register"
                    className="ml-1 font-semibold underline text-[#C9A84C]"
                  >
                    Créer un compte
                  </Link>
                )}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center rounded-md bg-[#C4161C] text-sm font-semibold text-white transition-colors hover:bg-[#e0272d] active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                  Connexion…
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          {/* Liens rapides */}
          <div className="mt-6 flex flex-col gap-2 text-center text-sm">
            <p className="text-gray-300">
              Pas encore inscrit ?{" "}
              <Link
                href="/auth/register"
                className="font-medium text-[#C9A84C] hover:text-[#F0CB6A]"
              >
                Créer un compte
              </Link>
            </p>
            <p>
              <Link
                href="/"
                className="text-gray-300 hover:text-[#C9A84C] transition-colors"
              >
                ← Retour à l&apos;accueil
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
