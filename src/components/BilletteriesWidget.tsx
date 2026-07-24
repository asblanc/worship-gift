"use client";

import { useEffect, useRef, useState } from "react";
import { billetteriesWidget as cfg } from "@/lib/ticketing-config";

/* ================================================================
   Worship Gift — Widget billetterie externe (billetteries.ma)
   Charge le script renderer.js une seule fois, puis appelle
   window.createss(formId, iframeUrl) pour injecter le formulaire de
   vente/paiement dans le <div>. Gère un état de chargement et un
   secours (lien direct) si le script est bloqué / indisponible.
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

export default function BilletteriesWidget() {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const injected = useRef(false);

  useEffect(() => {
    let active = true;

    loadRenderer(cfg.scriptUrl)
      .then(() => {
        if (!active || injected.current) return;
        if (typeof window.createss !== "function") {
          setState("error");
          return;
        }
        try {
          // Garde anti double-injection (StrictMode / re-render)
          injected.current = true;
          window.createss(cfg.formId, cfg.iframeUrl);
          setState("ready");
        } catch {
          setState("error");
        }
      })
      .catch(() => {
        if (active) setState("error");
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="relative min-h-[520px]">
      {/* Conteneur rempli par createss() */}
      <div id={cfg.formId} className="integrationss" />

      {state === "loading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
          <span className="h-7 w-7 animate-spin rounded-full border-2 border-[#C9A84C] border-t-transparent" />
          <p className="text-sm text-gray-400">Chargement de la billetterie sécurisée…</p>
        </div>
      )}

      {state === "error" && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center">
          <p className="text-sm text-gray-300">
            La billetterie n&rsquo;a pas pu se charger ici. Vous pouvez
            l&rsquo;ouvrir directement pour réserver et payer en toute sécurité.
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
