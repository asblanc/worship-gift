"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Eyebrow from "@/components/Eyebrow";
import { upcomingEvents } from "@/lib/events-config";

/* ================================================================
   Worship Gift — Section billetterie sur l'accueil
   Présentation pro de l'événement + widget de vente/paiement
   billetteries.ma (carte blanche lisible). Les valeurs encore en
   placeholder ([ … ]) sont masquées automatiquement.
   ================================================================ */

const BilletteriesWidget = dynamic(
  () => import("@/components/BilletteriesWidget"),
  { ssr: false },
);

// Masque les champs encore en placeholder (ex: "[NOM DU CHANTRE]")
const real = (v?: string | null) => (v && !v.includes("[") ? v : "");

export default function HomeTicketing() {
  const event = upcomingEvents[0];
  if (!event) return null;

  const title = real(event.title) || "Concert Gospel Worship Gift";
  const artist = real(event.artist);
  const date = real(event.date);
  const time = real(event.time);
  const location = real(event.location);

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
      d: "QR code scanné en un instant le jour du concert.",
    },
  ];

  return (
    <section className="relative overflow-hidden border-t border-[#282828] bg-[#0A0A0A] px-6 py-20 md:py-28">
      {/* halo doré discret */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-[0.12]"
        style={{ background: "radial-gradient(60% 100% at 50% 0%, rgba(201,168,76,0.55), transparent 70%)" }}
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
            <div className="overflow-hidden rounded-2xl border border-[#282828] bg-[#121212] shadow-[0_12px_50px_rgba(0,0,0,0.4)]">
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={event.coverImage}
                  alt={title}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 480px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
                <span className="absolute top-3 left-3 inline-block rounded-full border border-[#C9A84C]/60 bg-black/60 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#C9A84C] backdrop-blur-sm">
                  À l&rsquo;affiche
                </span>
              </div>
              <div className="p-6">
                <h3 className="t-h3 text-white">{title}</h3>
                {artist && <p className="mt-1 text-base font-medium text-[#C9A84C]">🎤 {artist}</p>}
                {(date || time || location) && (
                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 t-meta text-gray-400">
                    {date && <span>📅 {date}</span>}
                    {time && <span>⏰ {time}</span>}
                    {location && <span>📍 {location}</span>}
                  </div>
                )}
                {real(event.description) && (
                  <p className="mt-4 t-body text-sm text-gray-400">{event.description}</p>
                )}
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

          {/* Formulaire billetteries.ma (carte blanche lisible) */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="overflow-hidden rounded-2xl bg-white p-2 shadow-[0_20px_60px_rgba(0,0,0,0.5)] ring-1 ring-black/5 sm:p-3"
          >
            <div className="flex items-center justify-between px-2 pb-2 pt-1">
              <p className="text-sm font-bold text-gray-800">Choisissez vos places</p>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#1a9d4b]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#25D366]" />
                Paiement sécurisé
              </span>
            </div>
            <BilletteriesWidget />
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
