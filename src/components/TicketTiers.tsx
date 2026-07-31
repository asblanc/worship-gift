"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Eyebrow from "@/components/Eyebrow";
import { upcomingEvents } from "@/lib/events-config";
import { billetteriesWidget as ticketing } from "@/lib/ticketing-config";
import { trackMeta, metaContentParams } from "@/lib/meta-pixel";

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
    border: "border-white/15 hover:border-white/30",
    bg: "from-[#1b1f26] to-[#121212]",
    price: "text-slate-100",
    check: "text-slate-300",
  },
  vip: {
    border: "border-[#0F7A3D]/50 hover:border-[#0F7A3D]/80",
    bg: "from-[#0c2015] to-[#111]",
    price: "text-[#3ad674]",
    check: "text-[#3ad674]",
    badge: { label: "Populaire", cls: "bg-[#0F7A3D]/25 text-[#5be08d] ring-1 ring-[#0F7A3D]/40" },
  },
  "vip-duo": {
    border: "border-emerald-400/45 hover:border-emerald-300/75",
    bg: "from-[#0b241a] to-[#111]",
    price: "text-emerald-300",
    check: "text-emerald-400",
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
    border: "border-[#C4161C]/55 hover:border-[#C4161C]/90",
    bg: "from-[#2a0c0e] to-[#141414]",
    price: "text-[#ef4444]",
    check: "text-[#ef4444]",
    badge: { label: "Meilleure offre", cls: "bg-[#C4161C]/25 text-[#f87171] ring-1 ring-[#C4161C]/40" },
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

export default function TicketTiers() {
  const event = upcomingEvents[0];
  const tiers = event?.ticketTypes ?? [];
  if (tiers.length === 0) return null;

  // Clic sur une formule -> page de réservation avec la catégorie déjà
  // sélectionnée (l'utilisateur enchaîne directement sur ses infos).
  const tierHref = (id: string) =>
    `/billetterie/${event.slug}/reserver?tier=${id}`;

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
            Concert live de{" "}
            <span className="font-semibold text-[#C9A84C]">Jonathan Gambela</span>{" "}
            au Stade RUC de Casablanca. Places limitées — réservez la vôtre
            avant qu&rsquo;il ne soit trop tard.
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

        <div className="flex flex-wrap justify-center gap-6">
          {tiers.map((t, i) => {
            const theme = THEMES[t.id] ?? DEFAULT_THEME;
            const savings = savingsFor(t.id);
            // Paiement en ligne : on OUVRE la billetterie du prestataire en
            // pleine page (nouvel onglet). Pas d'iframe : le tunnel de paiement
            // bancaire (3-D Secure) refuse d'être affiché en iframe.
            const onlineHref = t.paymentUrl || event.paymentUrl || ticketing.directUrl;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
              >
                <div
                  className={`group relative flex h-full flex-col rounded-2xl border bg-gradient-to-b p-6 shadow-[0_10px_40px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1.5 ${theme.border} ${theme.bg} ${theme.featured ? "sm:shadow-[0_16px_50px_rgba(201,168,76,0.12)]" : ""}`}
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

                  {/* CTA : choisir le mode de paiement pour CETTE formule */}
                  <div className="mt-6 flex flex-col gap-2.5">
                    <a
                      href={onlineHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Payer en ligne la formule ${t.label}`}
                      onClick={() =>
                        trackMeta("InitiateCheckout", {
                          ...metaContentParams({
                            eventId: event.id,
                            eventTitle: event.title,
                            tierId: t.id,
                            tierLabel: t.label,
                            unitPriceValue: t.priceValue,
                          }),
                          payment_method: "online",
                        })
                      }
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#C4161C] text-[12px] font-bold uppercase tracking-[0.08em] text-white transition-all hover:bg-[#e0272d] active:scale-[0.97]"
                    >
                      Paiement en ligne
                      <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                    </a>
                    <Link
                      href={tierHref(t.id)}
                      aria-label={`Commander à la livraison la formule ${t.label}`}
                      onClick={() =>
                        trackMeta(
                          "AddToCart",
                          metaContentParams({
                            eventId: event.id,
                            eventTitle: event.title,
                            tierId: t.id,
                            tierLabel: t.label,
                            unitPriceValue: t.priceValue,
                          }),
                        )
                      }
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#25D366]/40 bg-[#25D366]/5 text-[12px] font-bold uppercase tracking-[0.08em] text-[#25D366] transition-all hover:bg-[#25D366]/15 active:scale-[0.97]"
                    >
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
                      À la livraison
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Réassurance + info panier (technique de vente : lever les freins) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-10 flex max-w-3xl flex-col items-center gap-3 text-center"
        >
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-gray-300">
            <span className="inline-flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              Paiement 100 % sécurisé
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Billet reçu immédiatement
            </span>
          </div>
          <p className="text-xs text-gray-500">
            « Paiement en ligne » vous amène à la billetterie de notre partenaire, où
            vous choisissez et confirmez votre catégorie. « À la livraison »&nbsp;: votre
            formule est déjà pré-remplie, il ne reste qu&rsquo;à indiquer vos coordonnées.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
