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
      className="bg-[#0D0D0D] px-6 py-16 md:py-20"
    >
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-md">
          <div className="flex flex-col gap-8 p-8 md:flex-row md:items-center md:p-12">
            {/* Affiche réelle — même image que la page billetterie */}
            <div className="relative flex aspect-[2/3] w-full shrink-0 overflow-hidden rounded-lg md:w-56">
              <Image
                src={nextEvent.coverImage}
                alt={nextEvent.title}
                fill
                className="object-cover brightness-105 saturate-105"
                sizes="(max-width: 768px) 100vw, 224px"
              />
              {/* Overlay dégradé bas */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              {/* Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className="inline-block rounded-full border border-[#C9A84C]/60 bg-black/60 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#C9A84C]">
                  Prochainement
                </span>
              </div>
              {/* Bouton en bas */}
              <div className="absolute bottom-3 left-0 right-0 z-10 text-center">
                <span className="inline-block rounded-md bg-[#C9A84C] px-3 py-1 text-xs font-bold text-black shadow-md">
                  Réserver ma place
                </span>
              </div>
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

              <h2 className="font-heading text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
                {nextEvent.title}
              </h2>

              <p className="text-sm leading-relaxed text-gray-400 md:text-base">
                {nextEvent.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
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
                  className="inline-flex h-12 items-center justify-center rounded-md border border-white/10 px-8 text-sm font-medium text-gray-300 transition-all hover:border-[#C9A84C]/50 hover:text-[#C9A84C] active:scale-[0.97]"
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