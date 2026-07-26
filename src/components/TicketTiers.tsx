"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Eyebrow from "@/components/Eyebrow";
import { upcomingEvents } from "@/lib/events-config";

/* ================================================================
   Worship Gift — Formules de billets (cartes marketing)
   Cartes colorées par catégorie, entièrement cliquables : elles
   ramènent à la billetterie pour finaliser l'achat.
   Prop `href` : destination du clic (défaut = /billetterie).
   ================================================================ */

type Theme = {
  border: string;
  bg: string;
  price: string;
  check: string;
  badge?: { label: string; cls: string };
  featured?: boolean;
};

const THEMES: Record<string, Theme> = {
  standard: {
    border: "border-slate-400/25 hover:border-slate-300/60",
    bg: "from-[#1b1f26] to-[#121212]",
    price: "text-slate-100",
    check: "text-slate-300",
  },
  vip: {
    border: "border-teal-400/40 hover:border-teal-300/70",
    bg: "from-[#0d2320] to-[#111]",
    price: "text-teal-300",
    check: "text-teal-400",
    badge: { label: "Populaire", cls: "bg-teal-400/20 text-teal-200 ring-1 ring-teal-400/30" },
  },
  "vip-duo": {
    border: "border-cyan-400/40 hover:border-cyan-300/70",
    bg: "from-[#0d1f2b] to-[#111]",
    price: "text-cyan-300",
    check: "text-cyan-400",
  },
  gold: {
    border: "border-[#C9A84C]/60 hover:border-[#C9A84C]",
    bg: "from-[#241d0e] to-[#141414]",
    price: "text-[#C9A84C]",
    check: "text-[#C9A84C]",
    badge: { label: "Premium", cls: "bg-[#C9A84C] text-black" },
    featured: true,
  },
  "gold-duo": {
    border: "border-amber-400/55 hover:border-amber-300/80",
    bg: "from-[#2a2109] to-[#141414]",
    price: "text-amber-300",
    check: "text-amber-300",
    badge: { label: "Meilleure offre", cls: "bg-amber-400/20 text-amber-200 ring-1 ring-amber-400/30" },
    featured: true,
  },
};

const DEFAULT_THEME: Theme = {
  border: "border-[#282828] hover:border-[#C9A84C]/40",
  bg: "from-[#141414] to-[#121212]",
  price: "text-white",
  check: "text-[#C9A84C]",
};

// Duo -> catégorie simple équivalente (pour calculer l'économie)
const DUO_BASE: Record<string, string> = { "vip-duo": "vip", "gold-duo": "gold" };

export default function TicketTiers({ href = "/billetterie" }: { href?: string }) {
  const event = upcomingEvents[0];
  const tiers = event?.ticketTypes ?? [];
  if (tiers.length === 0) return null;

  const savingsFor = (id: string): number => {
    const baseId = DUO_BASE[id];
    if (!baseId) return 0;
    const base = tiers.find((t) => t.id === baseId);
    const duo = tiers.find((t) => t.id === id);
    if (!base || !duo) return 0;
    return Math.max(0, (base.priceValue * 2 - duo.priceValue) / 100);
  };

  return (
    <section className="border-t border-white/10 bg-[#0D0D0D] px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-4 flex flex-col items-center text-center"
        >
          <Eyebrow centered>Billetterie · 11 octobre 2026</Eyebrow>
          <h2 className="t-h2 text-white">Choisissez votre formule</h2>
          <p className="mx-auto mt-4 max-w-xl t-body text-gray-400">
            Concert de <span className="font-semibold text-[#C9A84C]">Jonathan Gambela</span> à
            Casablanca. Places limitées — réservez la vôtre avant qu&rsquo;il ne soit trop tard.
          </p>
        </motion.div>

        {/* Accroche marketing */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mb-10 flex max-w-fit items-center gap-2 rounded-full border border-[#C9A84C]/25 bg-[#C9A84C]/10 px-4 py-1.5 text-xs font-medium text-[#E7C86A]"
        >
          <span aria-hidden>🔥</span>
          Formules Gold : Meet &amp; Greet + photo souvenir avec Jonathan Gambela
        </motion.p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tiers.map((t, i) => {
            const theme = THEMES[t.id] ?? DEFAULT_THEME;
            const savings = savingsFor(t.id);
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <Link
                  href={href}
                  aria-label={`Réserver la formule ${t.label} (${t.price})`}
                  className={`group relative flex h-full flex-col rounded-2xl border bg-gradient-to-b p-6 shadow-[0_10px_40px_rgba(0,0,0,0.35)] outline-none transition-all duration-300 hover:-translate-y-1.5 focus-visible:ring-2 focus-visible:ring-[#C9A84C] ${theme.border} ${theme.bg} ${theme.featured ? "sm:shadow-[0_16px_50px_rgba(201,168,76,0.12)]" : ""}`}
                >
                  {/* Badges */}
                  <div className="flex items-center justify-between gap-2">
                    {theme.badge ? (
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] ${theme.badge.cls}`}>
                        {theme.badge.label}
                      </span>
                    ) : (
                      <span />
                    )}
                    {savings > 0 && (
                      <span className="rounded-full bg-[#25D366]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#3ad674]">
                        Économisez {savings} MAD
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 font-heading text-xl font-bold text-white">{t.label}</h3>
                  {t.description && (
                    <p className="mt-1 text-xs text-gray-400">{t.description}</p>
                  )}

                  <p className="mt-4 flex items-baseline gap-2">
                    <span className={`font-heading text-3xl font-black ${theme.price}`}>{t.price}</span>
                    {savings > 0 && (
                      <span className="text-sm text-gray-500 line-through">
                        {(t.id in DUO_BASE ? (tiers.find((x) => x.id === DUO_BASE[t.id])!.priceValue * 2) / 100 : 0)} MAD
                      </span>
                    )}
                  </p>

                  <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                    {(t.perks ?? []).map((perk) => (
                      <li key={perk} className="flex items-start gap-2.5 text-sm text-gray-200">
                        <svg className={`mt-0.5 h-4 w-4 shrink-0 ${theme.check}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <span className={`mt-6 inline-flex items-center justify-center gap-2 rounded-full py-3 text-[13px] font-bold uppercase tracking-[0.1em] transition-all ${
                    theme.featured
                      ? "bg-[#C9A84C] text-black group-hover:bg-[#F0CB6A]"
                      : "border border-white/15 text-white group-hover:border-[#C9A84C]/60 group-hover:text-[#C9A84C]"
                  }`}>
                    Réserver ma place
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
