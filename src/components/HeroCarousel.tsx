"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    src: "/img_worship-gift/hero-1.png",
    alt: "Concert gospel Worship Gift",
    position: "center",
  },
  {
    src: "/img_worship-gift/hero-2.jpg",
    alt: "Louange et adoration Worship Gift",
    position: "center 30%",
  },
  {
    src: "/img_worship-gift/hero-3.jpg",
    alt: "Mouvement gospel Worship Gift",
    position: "center 40%",
  },
  {
    src: "/img_worship-gift/hero-4.jpg",
    alt: "Groupe de louange Worship Gift",
    position: "center",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative h-dvh w-full overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={slides[current].src}
            alt={slides[current].alt}
            fill
            className="object-cover"
            style={{ objectPosition: slides[current].position }}
            sizes="100vw"
            priority={current === 0}
            quality={85}
          />
        </motion.div>
      </AnimatePresence>

      {/* Zoom arrière très subtil pendant l'affichage */}
      <motion.div
        key={`zoom-${current}`}
        initial={{ scale: 1.02 }}
        animate={{ scale: 1 }}
        transition={{ duration: 6, ease: "easeOut" }}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Overlay dégradé */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/85" />

      {/* Contenu centré */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.h1
          key={`title-${current}`}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-heading text-5xl font-bold tracking-wide text-[#C9A84C] md:text-7xl lg:text-8xl"
        >
          Worship Gift
        </motion.h1>

        <motion.p
          key={`sub-${current}`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-gray-200 md:text-lg"
        >
          Une expérience unique de louange et d'adoration. Laissez la
          musique gospel vous transporter dans la présence de Dieu.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <Link
            href="#"
            className="inline-flex h-12 items-center justify-center rounded-md bg-[#C9A84C] px-8 text-sm font-medium text-black transition-colors hover:bg-[#F0CB6A]"
          >
            Découvrir le mouvement
          </Link>
          <Link
            href="#"
            className="inline-flex h-12 items-center justify-center rounded-md border border-white/20 px-8 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            Réserver ta place
          </Link>
        </motion.div>
      </div>

      {/* Flèches de navigation */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 p-2 text-white/60 transition-colors hover:border-[#C9A84C] hover:text-[#C9A84C]"
        aria-label="Image précédente"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-5 w-5 md:h-6 md:w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 p-2 text-white/60 transition-colors hover:border-[#C9A84C] hover:text-[#C9A84C]"
        aria-label="Image suivante"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-5 w-5 md:h-6 md:w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>

      {/* Indicateurs */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current
                ? "w-8 bg-[#C9A84C]"
                : "w-1.5 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Aller au slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}