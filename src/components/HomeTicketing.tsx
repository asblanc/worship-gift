"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Eyebrow from "@/components/Eyebrow";
import { upcomingEvents } from "@/lib/events-config";
import { billetteriesWidget as ticketing } from "@/lib/ticketing-config";

/* ================================================================
   Worship Gift — Section billetterie sur l'accueil
   Présentation pro de l'événement + accès à la billetterie du
   prestataire (ouverture pleine page, pas d'iframe : le paiement
   bancaire refuse d'être affiché en iframe). Les valeurs encore en
   placeholder ([ … ]) sont masquées automatiquement.
   ================================================================ */

// Masque les champs encore en placeholder (ex: "[NOM DU CHANTRE]")
const real = (v?: string | null) => (v && !v.includes("[") ? v : "");

export default function HomeTicketing() {
  const event = upcomingEvents[0];
  if (!event) return null;

  const title = real(event.title) || "Concert Live de Jonathan Gambela";

  const atouts = [
    {
      icon: (
        <path d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z" />
      ),
      t: "Paiement 100 % sécurisé",
      d: "Transaction protégée, gérée par billetteries.ma.",
    },
    {
      icon: <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3" />,
      t: "Billet reçu immédiatement",
      d: "Votre e-billet vous est délivré dès le paiement validé.",
    },
    {
      icon: (
        <>
          <path d="M15 5v2" /><path d="M15 11v2" /><path d="M15 17v2" />
          <path d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z" />
        </>
      ),
      t: "Contrôle rapide à l'entrée",
      d: "QR code scanné en un instant le jour du concert live.",
    },
  ];

  return (
    <section className="relative overflow-hidden border-t border-[#282828] bg-[#0A0A0A] px-6 py-20 md:py-28">
      {/* halo aux couleurs de l'événement (rouge + vert) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 opacity-25"
        style={{
          background:
            "radial-gradient(60% 100% at 25% 0%, rgba(196,22,28,0.55), transparent 60%), radial-gradient(60% 100% at 80% 0%, rgba(15,122,61,0.45), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-col items-center text-center"
        >
          <Eyebrow centered>Billetterie officielle</Eyebrow>
          <h2 className="t-h2 text-white">Réservez votre place</h2>
          <p className="mx-auto mt-4 max-w-xl t-body text-gray-400">
            Choisissez vos billets et réglez en ligne en quelques clics —
            ou optez pour le paiement à la livraison, juste en dessous.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
          {/* Présentation événement */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            {/* Affiche officielle du concert (contient déjà toutes les infos) */}
            <div className="overflow-hidden rounded-2xl border border-[#C4161C]/30 bg-black shadow-[0_16px_50px_rgba(0,0,0,0.55)] ring-1 ring-white/5">
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={event.coverImage}
                  alt={`Affiche officielle — ${title}`}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 480px"
                />
              </div>
            </div>

            {/* Atouts / réassurance */}
            <ul className="grid gap-3">
              {atouts.map((a) => (
                <li
                  key={a.t}
                  className="flex items-start gap-3 rounded-xl border border-[#282828] bg-[#121212] p-4"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#C9A84C]/30 bg-[#C9A84C]/10 text-[#C9A84C]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      {a.icon}
                    </svg>
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-white">{a.t}</span>
                    <span className="block t-meta text-gray-400">{a.d}</span>
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Achat en ligne — ouverture de la billetterie du prestataire */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col justify-center rounded-2xl border border-[#C4161C]/35 bg-gradient-to-b from-[#2a0c0e] to-[#121212] p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.45)] md:p-10"
          >
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#C4161C]/20 text-[#ef4444]">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 5v2" /><path d="M15 11v2" /><path d="M15 17v2" />
                <path d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z" />
              </svg>
            </span>
            <h3 className="mt-5 t-h3 text-white">Réservez vos billets</h3>
            <p className="mx-auto mt-3 max-w-sm t-body text-sm text-gray-400">
              Réservez sur la billetterie sécurisée de notre partenaire :
              choisissez votre catégorie et réglez par carte ou en espèces
              (points partenaires). Billet reçu immédiatement.
            </p>
            <a
              href={ticketing.directUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-auto mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#C4161C] px-8 text-[13px] font-semibold uppercase tracking-[0.12em] text-white transition-all hover:bg-[#e0272d] hover:shadow-lg hover:shadow-[#C4161C]/30 active:scale-[0.97]"
            >
              Acheter en ligne
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7" /><path d="M7 7h10v10" /></svg>
            </a>
            <p className="mt-4 inline-flex items-center justify-center gap-1.5 text-xs text-gray-500">
              <svg className="h-3.5 w-3.5 text-[#0F7A3D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              Paiement 100 % sécurisé · billetteries.ma
            </p>
          </motion.div>
        </div>

        {/* Paiement à la livraison */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mt-8 flex flex-col items-start gap-5 rounded-2xl border border-[#25D366]/25 bg-[#25D366]/[0.06] p-6 sm:flex-row sm:items-center sm:justify-between md:p-8"
        >
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 text-[#25D366]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="1" />
                <path d="M16 8h4l3 3v5h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </span>
            <div>
              <h3 className="t-card-title text-white">Vous préférez payer à la livraison&nbsp;?</h3>
              <p className="mt-1.5 max-w-xl t-meta text-gray-300">
                Commandez sans payer en ligne : un livreur ou un agent passe
                encaisser en <strong className="text-white">espèces</strong>, puis votre
                <strong className="text-white"> billet numérique</strong> vous est envoyé (e-mail / WhatsApp).
              </p>
            </div>
          </div>
          <Link
            href={`/billetterie/${event.slug}/reserver`}
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 text-[13px] font-semibold uppercase tracking-[0.1em] text-white shadow-lg shadow-[#25D366]/20 transition-all hover:bg-[#1ebe5d] active:scale-[0.97]"
          >
            Commander à la livraison
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
