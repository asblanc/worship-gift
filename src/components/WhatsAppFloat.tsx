"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WHATSAPP_NUMBER } from "@/lib/events-config";

/* ═══════════════════════════════════════════════════════════
   CONFIGURATION — le numéro WhatsApp est centralisé dans
   src/lib/events-config.ts (WHATSAPP_NUMBER), configurable via
   la variable d'env NEXT_PUBLIC_WHATSAPP_NUMBER.
   ═══════════════════════════════════════════════════════════ */

/** Messages préremplis par option */
const MESSAGES = {
  billet:
    "Bonjour, j'ai un problème avec mon billet.",
  concert:
    "Bonjour, j'aimerais plus d'informations sur le concert.",
  agent:
    "Bonjour, je souhaite parler à un agent.",
} as const;

/** Options du mini-menu */
const OPTIONS = [
  {
    label: "Problème de billet",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M10 4v4" />
        <path d="M14 4v4" />
        <path d="M2 8h20" />
        <path d="M6 4v4" />
      </svg>
    ),
    key: "billet" as keyof typeof MESSAGES,
  },
  {
    label: "Infos concert",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    ),
    key: "concert" as keyof typeof MESSAGES,
  },
  {
    label: "Parler à un agent",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    key: "agent" as keyof typeof MESSAGES,
  },
];

/* ═══════════════════════════════════════════════════════════
   COMPOSANT
   ═══════════════════════════════════════════════════════════ */

export default function WhatsAppFloat() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Fermer au clavier (Échap)
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  // Lien WhatsApp natif : on privilégie un <a> (pas window.open) pour éviter
  // le popup « about:blank » qui s'affichait brièvement avant la redirection.
  const waHref = (key: keyof typeof MESSAGES) =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGES[key])}`;

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
    >
      {/* Mini-menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="whatsapp-menu"
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-64 rounded-xl border border-[#2A2A2A] bg-[#111111] p-4 shadow-lg shadow-black/40 backdrop-blur-lg"
          >
            {/* En-tête */}
            <p className="font-heading text-lg font-semibold text-white">
              Besoin d'aide&nbsp;?
            </p>
            <p className="mt-1 text-xs leading-relaxed text-gray-300">
              Choisissez le service concerné
            </p>

            {/* Options */}
            <div className="mt-4 flex flex-col gap-2">
              {OPTIONS.map((opt) => (
                <a
                  key={opt.key}
                  href={waHref(opt.key)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg border border-white/10 px-3 py-2.5 text-left text-sm text-gray-200 transition-colors hover:border-[#C9A84C]/40 hover:bg-[#C9A84C]/10 hover:text-white active:scale-[0.98]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C9A84C]/15 text-[#C9A84C]">
                    {opt.icon}
                  </span>
                  <span className="font-medium">{opt.label}</span>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouton principal WhatsApp */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Fermer le menu WhatsApp" : "Ouvrir le menu WhatsApp"}
        aria-expanded={open}
        aria-controls="whatsapp-menu"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/25 transition-transform duration-200 hover:scale-105 active:scale-95"
      >
        {/* SVG WhatsApp */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="white"
          className="relative z-10"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
        </svg>

        {/* Indicateur de notification */}
        {!open && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#C9A84C] text-[10px] font-bold text-black shadow-sm shadow-[#C9A84C]/30">
            ?
          </span>
        )}
      </button>
    </div>
  );
}