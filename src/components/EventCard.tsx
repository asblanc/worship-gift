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
      className="px-6 py-16 md:py-20"
    >
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl">
          {/* Image de fond avec parallaxe douce */}
          <div className="absolute inset-0 -z-10">
            <Image
              src={nextEvent.coverImage}
              alt=""
              fill
              className="scale-110 object-cover opacity-40 saturate-0"
              sizes="(max-width: 768px) 100vw, 80vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/90" />
          </div>

          {/* Particules décoratives dorées */}
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-20">
            {Array.from({ length: 20 }).map((_, i) => (
              <span
                key={i}
                className="absolute h-1 w-1 rounded-full bg-[#C9A84C]"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `pulse 3s ease-in-out ${Math.random() * 3}s infinite`,
                }}
              />
            ))}
          </div>

          <div className="flex flex-col gap-8 p-8 md:flex-row md:items-center md:p-12">
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
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 text-[#C9A84C]">📅</span>
                  {nextEvent.dateLabel}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 text-[#C9A84C]">⏰</span>
                  {nextEvent.time}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 text-[#C9A84C]">📍</span>
                  {nextEvent.location}
                </span>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/billetterie"
                  className="inline-flex h-12 items-center justify-center rounded-md bg-[#C9A84C] px-8 text-sm font-semibold text-black shadow-lg shadow-[#C9A84C]/20 transition-all hover:bg-[#F0CB6A] hover:shadow-[#C9A84C]/40"
                >
                  Réserver ma place
                </Link>
                <Link
                  href="/a-propos"
                  className="inline-flex h-12 items-center justify-center rounded-md border border-white/20 px-8 text-sm font-medium text-white transition-all hover:border-[#C9A84C]/50 hover:text-[#C9A84C]"
                >
                  En savoir plus
                </Link>
              </div>
            </div>

            {/* Image d'affiche */}
            <div className="shrink-0 md:w-56">
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-white/10 shadow-xl">
                <Image
                  src={nextEvent.coverImage}
                  alt={nextEvent.title}
                  fill
                  className="object-cover"
                  sizes="224px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}