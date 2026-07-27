"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { upcomingEvents } from "@/lib/events-config";

export default function EventCard() {
  const event = upcomingEvents[0];
  if (!event) return null;
  const tiers = event.ticketTypes ?? [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-[#0A0A0A] px-6 py-20 md:py-28"
    >
      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-[#282828] bg-[#121212] shadow-[0_12px_50px_rgba(0,0,0,0.4)]">
        <div className="flex flex-col gap-8 p-6 md:flex-row md:items-center md:gap-10 md:p-10">
          {/* Affiche officielle (ratio 4:5 natif -> affichée entière) */}
          <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden rounded-xl border border-[#C4161C]/30 ring-1 ring-white/5 md:w-72">
            <Image
              src={event.coverImage}
              alt={`Affiche officielle — ${event.title}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 288px"
            />
          </div>

          {/* Contenu */}
          <div className="flex flex-1 flex-col justify-center">
            <span className="t-eyebrow inline-flex items-center gap-3 text-[#C4161C]">
              <span className="h-px w-8 bg-[#C4161C]/70" aria-hidden />
              Prochain concert live
            </span>
            <h2 className="mt-4 t-h2 text-white">{event.title}</h2>
            {event.artist && (
              <p className="mt-1 text-base font-medium text-[#C9A84C]">🎤 {event.artist}</p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 t-meta text-gray-400">
              <span>📅 {event.date}</span>
              <span>⏰ {event.time}</span>
              <span>📍 {event.location}</span>
            </div>

            <p className="mt-4 t-body text-sm text-gray-400">{event.description}</p>

            {/* Catégories de billets */}
            {tiers.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {tiers.map((t) => (
                  <span
                    key={t.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#282828] bg-black/30 px-3 py-1 text-xs text-gray-300"
                  >
                    <span className="font-semibold text-white">{t.label}</span>
                    <span className="text-[#C9A84C]">{t.price}</span>
                  </span>
                ))}
              </div>
            )}

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link
                href={`/billetterie/${event.slug}/reserver`}
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#C4161C] px-8 text-[13px] font-semibold uppercase tracking-[0.12em] text-white shadow-lg shadow-[#C4161C]/25 transition-all hover:bg-[#e0272d] hover:shadow-[#C4161C]/40 active:scale-[0.97]"
              >
                Réserver ma place
              </Link>
              <Link
                href="/billetterie"
                className="inline-flex h-12 items-center justify-center rounded-full border border-[#0F7A3D]/50 px-8 text-[13px] font-medium uppercase tracking-[0.12em] text-[#3ad674] transition-all hover:border-[#0F7A3D] hover:bg-[#0F7A3D]/10 active:scale-[0.97]"
              >
                Voir la billetterie
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
