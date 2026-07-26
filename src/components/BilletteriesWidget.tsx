"use client";

import { useEffect, useRef, useState } from "react";
import { billetteriesWidget as cfg } from "@/lib/ticketing-config";

/* ================================================================
   Worship Gift — Widget billetterie externe (billetteries.ma)

   Optimisations UX :
   - Chargement PARESSEUX : l'iframe n'est initialisée que lorsque le
     bloc entre dans le champ de vision (IntersectionObserver) — pas à
     chaque rendu de page.
   - Preconnect vers billetteries.ma pour accélérer le premier chargement.
   - Squelette discret (pas de spinner) pendant le chargement, révélé
     dès que l'iframe a reçu sa hauteur (poll rapide au lieu d'un délai
     fixe) → temps de chargement quasi invisible.
   - Secours « Ouvrir la billetterie » si l'embed échoue.
   ================================================================ */

declare global {
  interface Window {
    createss?: (formId: string, url: string) => void;
  }
}

// Chargement idempotent du script (une seule balise pour toute la page)
let scriptPromise: Promise<void> | null = null;
function loadRenderer(src: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (typeof window.createss === "function") return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("renderer")));
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      scriptPromise = null; // autorise une nouvelle tentative
      reject(new Error("renderer"));
    };
    document.body.appendChild(s);
  });
  return scriptPromise;
}

const MAX_WAIT_MS = 12_000;
const POLL_MS = 350;

export default function BilletteriesWidget() {
  // idle : pas encore visible ; loading : en cours ; embedded : iframe ok ;
  // fallback : échec -> lien direct
  const [phase, setPhase] = useState<"idle" | "loading" | "embedded" | "fallback">("idle");
  const rootRef = useRef<HTMLDivElement>(null);
  const injected = useRef(false);

  // 1) Déclenche le chargement uniquement quand le bloc approche du viewport
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setPhase((p) => (p === "idle" ? "loading" : p));
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" }, // précharge un peu avant d'arriver
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // 2) Charge le script + injecte l'iframe quand phase === "loading"
  useEffect(() => {
    if (phase !== "loading" || injected.current) return;
    let active = true;
    let poll: ReturnType<typeof setInterval> | undefined;

    loadRenderer(cfg.scriptUrl)
      .then(() => {
        if (!active || injected.current) return;
        if (typeof window.createss !== "function") {
          setPhase("fallback");
          return;
        }
        try {
          injected.current = true;
          window.createss(cfg.formId, cfg.iframeUrl);

          // Révèle l'iframe DÈS qu'elle a une hauteur exploitable
          const start = Date.now();
          poll = setInterval(() => {
            if (!active) return;
            const container = document.getElementById(cfg.formId);
            const stillLoading = !!container?.querySelector("#ticketingloading");
            const iframe = container?.querySelector("iframe");
            const height = iframe ? iframe.getBoundingClientRect().height : 0;
            if (!stillLoading && height >= 60) {
              if (poll) clearInterval(poll);
              setPhase("embedded");
            } else if (Date.now() - start >= MAX_WAIT_MS) {
              if (poll) clearInterval(poll);
              setPhase("fallback");
            }
          }, POLL_MS);
        } catch {
          setPhase("fallback");
        }
      })
      .catch(() => {
        if (active) setPhase("fallback");
      });

    return () => {
      active = false;
      if (poll) clearInterval(poll);
    };
  }, [phase]);

  const showSkeleton = phase === "idle" || phase === "loading";

  return (
    <div
      ref={rootRef}
      className="relative min-h-[70vh] w-full overflow-x-hidden rounded-xl bg-white"
    >
      {/* Preconnect : accélère le 1er chargement de billetteries.ma */}
      <link rel="preconnect" href="https://www.billetteries.ma" crossOrigin="" />
      <link rel="preconnect" href="https://www.app.billetteries.ma" crossOrigin="" />

      {/* Conteneur rempli par createss() (iframe billetteries.ma) */}
      <div
        id={cfg.formId}
        className="integrationss w-full [&_iframe]:!w-full [&_iframe]:!max-w-full"
      />

      {/* Squelette discret pendant le chargement (couvre le spinner tiers) */}
      {showSkeleton && (
        <div className="absolute inset-0 flex flex-col gap-4 rounded-xl bg-white p-6">
          <div className="h-6 w-2/3 animate-pulse rounded-md bg-gray-200" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
          <div className="mt-2 space-y-3">
            {[0, 1, 2].map((k) => (
              <div key={k} className="flex items-center gap-3">
                <div className="h-11 flex-1 animate-pulse rounded-lg bg-gray-100" />
                <div className="h-11 w-20 animate-pulse rounded-lg bg-gray-200" />
              </div>
            ))}
          </div>
          <div className="mt-2 h-12 w-full animate-pulse rounded-lg bg-gray-200" />
          <div className="mt-auto h-12 w-40 animate-pulse self-end rounded-full bg-[#C9A84C]/30" />
        </div>
      )}

      {phase === "fallback" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-xl bg-white px-6 py-12 text-center">
          <p className="max-w-md text-sm text-gray-700">
            La billetterie ne s&rsquo;affiche pas ici pour le moment. Vous pouvez
            l&rsquo;ouvrir dans un nouvel onglet pour réserver et payer en toute
            sécurité.
          </p>
          <a
            href={cfg.directUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-full bg-[#C9A84C] px-8 text-[13px] font-semibold uppercase tracking-[0.12em] text-black transition-all hover:bg-[#F0CB6A] active:scale-[0.97]"
          >
            Ouvrir la billetterie
          </a>
        </div>
      )}
    </div>
  );
}
