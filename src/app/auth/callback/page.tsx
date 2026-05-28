"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

/* ================================================================
   Page callback OAuth
   Supabase redirige ici après connexion sociale.
   getSession() récupère automatiquement la session depuis le hash.
================================================================ */

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      const {
        data: { session },
        error: err,
      } = await supabase.auth.getSession();

      if (err) {
        setError(err.message);
        return;
      }

      if (session) {
        const isAdmin = session.user?.user_metadata?.role === "admin";
        router.push(isAdmin ? "/admin" : "/account");
        router.refresh();
      } else {
        setError(
          "Impossible de finaliser la connexion. Réessaie.",
        );
      }
    };

    handleCallback();
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4">
      {error ? (
        <div className="text-center">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => router.push("/auth/login")}
            className="mt-4 inline-flex h-10 items-center rounded-md bg-[#C9A84C] px-6 text-sm font-semibold text-black"
          >
            Retour à la connexion
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#C9A84C] border-t-transparent" />
          <p className="text-sm text-gray-400">Connexion en cours…</p>
        </div>
      )}
    </main>
  );
}