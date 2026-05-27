"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    src: "/img_worship-gift/hero-1.jpg",
    alt: "Concert gospel Worship Gift",
    position: "center",
  },
  {
    src: "/img_worship-gift/hero-2.jpeg",
    alt: "Louange et adoration Worship Gift",
    position: "center 30%",
  },
  {
    src: "/img_worship-gift/hero-3.jpg",
    alt: "Mouvement gospel Worship Gift",
    position: "center 40%",
  },
  {
    src: "/img_worship-gift/hero-4.jpeg",
    alt: "Groupe de louange Worship Gift",
    position: "center",
  },
  {
    src: "/img_worship-gift/hero-5.jpg",
    alt: "Worship Gift en concert",
    position: "center",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [prevSlide, setPrevSlide] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (index: number) => {
      setPrevSlide(current);
      setCurrent(index);
    },
    [current],
  );

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  // Auto-play
  useEffect(() => {
    intervalRef.current = setInterval(next, 6000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [next]);

  // Reset prevSlide after transition
  useEffect(() => {
    if (prevSlide !== null) {
      const timeout = setTimeout(() => setPrevSlide(null), 1200);
      return () => clearTimeout(timeout);
    }
  }, [prevSlide]);

  return (
    <section className="relative h-dvh w-full overflow-hidden bg-black">
      {/* Préchargement invisible de toutes les images */}
      <div className="hidden" aria-hidden="true">
        {slides.map((s) => (
          <Image
            key={s.src}
            src={s.src}
            alt=""
            fill
            sizes="1px"
            className="object-cover"
            priority={false}
          />
        ))}
      </div>

      {/* Couche d'images en crossfade */}
      <div className="absolute inset-0">
        {/* Image précédente — disparaît */}
        <AnimatePresence>
          {prevSlide !== null && (
            <motion.div
              key={`prev-${prevSlide}`}
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={slides[prevSlide].src}
                alt={slides[prevSlide].alt}
                fill
                className="object-cover"
                style={{ objectPosition: slides[prevSlide].position }}
                sizes="100vw"
                priority={false}
                quality={85}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image courante — apparaît */}
        <AnimatePresence>
          <motion.div
            key={`current-${current}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
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

        {/* Zoom subtil sur l'image courante */}
        <motion.div
          key={`zoom-${current}`}
          initial={{ scale: 1.02 }}
          animate={{ scale: 1 }}
          transition={{ duration: 6, ease: "easeOut" }}
          className="absolute inset-0 pointer-events-none"
        />
      </div>

      {/* Overlay dégradé */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/85 pointer-events-none" />

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
          Une expérience unique de louange et d'adoration. Laissez la musique
          gospel vous transporter dans la présence de Dieu.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <Link
            href="/a-propos"
            className="inline-flex h-12 items-center justify-center rounded-md bg-[#C9A84C] px-8 text-sm font-medium text-black transition-colors hover:bg-[#F0CB6A]"
          >
            Découvrir le mouvement
          </Link>
          <Link
            href="/billetterie"
            className="inline-flex h-12 items-center justify-center rounded-md border border-white/20 px-8 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            Réserver ta place
          </Link>
        </motion.div>
      </div>

      {/* Indicateurs */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
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