"use client";

import { useEffect, useRef, useState } from "react";
import { billetteriesWidget as cfg } from "@/lib/ticketing-config";

/* ================================================================
   Worship Gift — Widget billetterie externe (billetteries.ma)
   Charge le script renderer.js une seule fois, puis appelle
   window.createss(formId, iframeUrl) : leur script injecte un
   spinner puis une iframe dont la HAUTEUR est fixée via postMessage
   par la page cible.

   Watchdog : si la page cible n'envoie pas sa hauteur en ~10 s
   (lien invalide, événement non publié, framing bloqué…), on bascule
   sur un secours « Ouvrir la billetterie » (nouvel onglet) au lieu
   de laisser un spinner tourner indéfiniment.
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
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${src}"]`,
    );
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

const WATCHDOG_MS = 10_000;

export default function BilletteriesWidget() {
  // loading : script + iframe en cours ; embedded : iframe affichée ;
  // fallback : échec -> on propose le lien direct
  const [phase, setPhase] = useState<"loading" | "embedded" | "fallback">("loading");
  const injected = useRef(false);

  useEffect(() => {
    let active = true;
    let watchdog: ReturnType<typeof setTimeout> | undefined;

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

          // Vérifie que l'iframe a bien reçu une hauteur exploitable.
          watchdog = setTimeout(() => {
            if (!active) return;
            const container = document.getElementById(cfg.formId);
            const stillLoading = !!container?.querySelector("#ticketingloading");
            const iframe = container?.querySelector("iframe");
            const height = iframe ? iframe.getBoundingClientRect().height : 0;
            setPhase(!stillLoading && height >= 60 ? "embedded" : "fallback");
          }, WATCHDOG_MS);
        } catch {
          setPhase("fallback");
        }
      })
      .catch(() => {
        if (active) setPhase("fallback");
      });

    return () => {
      active = false;
      if (watchdog) clearTimeout(watchdog);
    };
  }, []);

  return (
    // Fond clair : le formulaire billetteries.ma (texte foncé) doit rester
    // lisible ; overflow-x pour éviter tout débordement horizontal sur mobile.
    <div className="relative min-h-[70vh] w-full overflow-x-hidden rounded-xl bg-white">
      {/* Conteneur rempli par createss() (iframe billetteries.ma) */}
      <div id={cfg.formId} className="integrationss w-full [&_iframe]:!w-full [&_iframe]:!max-w-full" />

      {phase === "loading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white px-6 text-center">
          <span className="h-7 w-7 animate-spin rounded-full border-2 border-[#C9A84C] border-t-transparent" />
          <p className="text-sm text-gray-600">Chargement de la billetterie sécurisée…</p>
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
