"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Eyebrow from "@/components/Eyebrow";
import { upcomingEvents } from "@/lib/events-config";

/* ================================================================
   Worship Gift — Catégories de billets (tarifs + avantages)
   Alimenté par upcomingEvents[0].ticketTypes. Les catégories Gold
   sont mises en avant (premium).
   ================================================================ */

const isPremium = (id: string) => id.startsWith("gold");

export default function TicketTiers() {
  const event = upcomingEvents[0];
  const tiers = event?.ticketTypes ?? [];
  if (tiers.length === 0) return null;

  return (
    <section className="border-t border-white/10 bg-[#0D0D0D] px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-col items-center text-center"
        >
          <Eyebrow centered>Catégories de billets</Eyebrow>
          <h2 className="t-h2 text-white">Choisissez votre expérience</h2>
          <p className="mx-auto mt-4 max-w-xl t-body text-gray-400">
            Chaque catégorie et les avantages qu&rsquo;elle donne pour le concert
            de Jonathan Gambela.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tiers.map((t, i) => {
            const premium = isPremium(t.id);
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className={`relative flex flex-col rounded-2xl border p-6 transition-all ${
                  premium
                    ? "border-[#C9A84C]/50 bg-gradient-to-b from-[#1a1710] to-[#121212] shadow-[0_12px_50px_rgba(201,168,76,0.12)]"
                    : "border-[#282828] bg-[#121212] hover:border-[#C9A84C]/40"
                }`}
              >
                {premium && (
                  <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-[#C9A84C] px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-black">
                    Premium
                  </span>
                )}

                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-heading text-xl font-bold text-white">{t.label}</h3>
                  {t.soldOut && (
                    <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold text-red-400">
                      Épuisé
                    </span>
                  )}
                </div>

                <p className="mt-2 flex items-baseline gap-1">
                  <span className={`font-heading text-3xl font-black ${premium ? "text-[#C9A84C]" : "text-white"}`}>
                    {t.price}
                  </span>
                </p>

                <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                  {(t.perks ?? []).map((perk) => (
                    <li key={perk} className="flex items-start gap-2.5 text-sm text-gray-300">
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A84C]"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            href="/billetterie/en-ligne"
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#C9A84C] px-8 text-[13px] font-semibold uppercase tracking-[0.12em] text-black transition-all hover:bg-[#F0CB6A] active:scale-[0.97]"
          >
            Payer en ligne
          </Link>
          <Link
            href={`/billetterie/${event.slug}/reserver`}
            className="inline-flex h-12 items-center justify-center rounded-full border border-[#25D366]/40 bg-[#25D366]/10 px-8 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#25D366] transition-all hover:bg-[#25D366]/20 active:scale-[0.97]"
          >
            Commander à la livraison
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
