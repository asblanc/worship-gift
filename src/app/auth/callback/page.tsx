"use client";

import { useEffect, useState } from "react";

/* ================================================================
   Page callback OAuth
   Supabase redirige ici après connexion sociale.
   On récupère la session via onAuthStateChange puis on redirige.
================================================================ */

export default function AuthCallbackPage() {
  const [error, setError] = useState("");

  useEffect(() => {
    // Importer dynamiquement pour éviter le SSR
    import("@/lib/supabase/client").then(({ supabase }) => {
      // Écouter le changement d'état d'auth (SIGNED_IN déclenché après le hash)
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (event === "SIGNED_IN" && session) {
            subscription.unsubscribe();
            const isAdmin = session.user?.user_metadata?.role === "admin";
            window.location.href = isAdmin ? "/admin" : "/account";
          } else if (event === "SIGNED_OUT") {
            subscription.unsubscribe();
            window.location.href = "/auth/login";
          }
        }
      );

      // Vérifier si une session existe déjà
      supabase.auth.getSession().then(({ data: { session }, error: err }) => {
        if (err) {
          setError(err.message);
          return;
        }
        if (session) {
          subscription.unsubscribe();
          const isAdmin = session.user?.user_metadata?.role === "admin";
          window.location.href = isAdmin ? "/admin" : "/account";
        }
      });

      // Timeout de sécurité si rien ne se passe
      const timeout = setTimeout(() => {
        subscription.unsubscribe();
        setError("Délai de connexion dépassé. Réessaie.");
      }, 10000);

      return () => {
        clearTimeout(timeout);
        subscription.unsubscribe();
      };
    });
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4">
      {error ? (
        <div className="text-center">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => (window.location.href = "/auth/login")}
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
