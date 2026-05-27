"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { nextEvent } from "@/lib/events-config";

export default function EventCard() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-[#F3EFE6] px-6 py-16 md:py-20"
    >
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
          <div className="flex flex-col gap-8 p-8 md:flex-row md:items-center md:p-12">
            {/* Affiche CSS — format vertical */}
            <div className="relative flex aspect-[2/3] w-full shrink-0 flex-col items-center justify-center overflow-hidden rounded-lg md:w-56"
              style={{
                background: `linear-gradient(180deg, #0A0A0A 0%, #1A1A1A 60%, #C9A84C08 100%)`,
              }}
            >
              {/* Motif de points subtil */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #C9A84C 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              />

              {/* Logo Worship Gift */}
              <div className="absolute top-4 z-10">
                <Image
                  src="/img_worship-gift/logo-worship-gift.png"
                  alt="Worship Gift"
                  width={48}
                  height={48}
                  className="h-10 w-auto opacity-80"
                />
              </div>

              {/* Badge PROCHAINEMENT */}
              <div className="absolute top-16 z-10">
                <span className="inline-block rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/10 px-3 py-0.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#C9A84C]">
                  Prochainement
                </span>
              </div>

              {/* Titre */}
              <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
                <h3 className="font-heading text-base font-bold leading-tight text-[#C9A84C] md:text-lg">
                  {nextEvent.title}
                </h3>
                <p className="mt-2 text-xs text-gray-300">
                  Une nuit de louange et d'adoration
                </p>
                <div className="mt-3 space-y-1 text-[10px] text-gray-400">
                  <p>{nextEvent.dateLabel} · {nextEvent.time}</p>
                  <p className="text-[#C9A84C]">{nextEvent.location}</p>
                </div>
              </div>

              {/* Bouton */}
              <div className="mb-4">
                <span className="inline-flex h-8 items-center justify-center rounded-md bg-[#C9A84C] px-4 text-[10px] font-semibold text-black">
                  Réserver ma place
                </span>
              </div>

              {/* Overlay dégradé */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            {/* Texte */}
            <div className="flex-1 space-y-5">
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="inline-block animate-pulse rounded-full bg-[#C9A84C]/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#C9A84C]"
              >
                Prochainement
              </motion.span>

              <h2 className="font-heading text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
                {nextEvent.title}
              </h2>

              <p className="text-sm leading-relaxed text-gray-600 md:text-base">
                {nextEvent.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">📅 {nextEvent.dateLabel}</span>
                <span className="flex items-center gap-1.5">⏰ {nextEvent.time}</span>
                <span className="flex items-center gap-1.5">📍 {nextEvent.location}</span>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/billetterie"
                  className="inline-flex h-12 items-center justify-center rounded-md bg-[#C9A84C] px-8 text-sm font-semibold text-black shadow-lg shadow-[#C9A84C]/20 transition-all hover:bg-[#F0CB6A] hover:shadow-[#C9A84C]/40 active:scale-[0.97]"
                >
                  Réserver ma place
                </Link>
                <Link
                  href="/a-propos"
                  className="inline-flex h-12 items-center justify-center rounded-md border border-gray-300 px-8 text-sm font-medium text-gray-700 transition-all hover:border-[#C9A84C]/50 hover:text-[#C9A84C] active:scale-[0.97]"
                >
                  En savoir plus
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}