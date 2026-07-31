"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    src: "/img_worship-gift/hero-0.jpeg",
    alt: "Worship Gift – Gospel Expérience",
    position: "center",
  },
  {
    src: "/img_worship-gift/hero-1.jpg",
    alt: "Concert Live de Jonathan Gambela — Worship Gift",
    position: "center",
  },
  {
    src: "/img_worship-gift/hero-2.jpeg",
    alt: "Gospel Worship Gift",
    position: "center 30%",
  },
  {
    src: "/img_worship-gift/hero-3.jpeg",
    alt: "Mouvement Gospel Worship Gift",
    position: "center 40%",
  },
  {
    src: "/img_worship-gift/hero-4.jpeg",
    alt: "Worship Gift – Nuit de Gospel",
    position: "center 25%",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [prevSlide, setPrevSlide] = useState<number | null>(null);
  const [hideIndicator, setHideIndicator] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  // Accessibilité (WCAG 2.2.2) : le défilement auto se met en pause au
  // survol ou à la prise de focus (clavier/lecteur d'écran).
  const [paused, setPaused] = useState(false);
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  // Auto-play (suspendu quand paused = true ou si le visiteur préfère moins de mouvement)
  useEffect(() => {
    if (paused || prefersReducedMotion) return;
    intervalRef.current = setInterval(next, 6000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [next, paused, prefersReducedMotion]);

  // Swipe mobile
  const touchStart = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(dx) > 60) {
      if (dx < 0) goTo((current + 1) % slides.length);
      else goTo((current - 1 + slides.length) % slides.length);
    }
  };

  // Cacher l'indicateur au scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80 && !hideIndicator) {
        setHideIndicator(true);
      } else if (window.scrollY <= 80 && hideIndicator) {
        setHideIndicator(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hideIndicator]);

  // Reset prevSlide after transition
  useEffect(() => {
    if (prevSlide !== null) {
      const timeout = setTimeout(() => setPrevSlide(null), 1200);
      return () => clearTimeout(timeout);
    }
  }, [prevSlide]);

  return (
    <section
      className="relative h-[80vh] min-h-[500px] w-full overflow-hidden bg-black"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role="region"
      aria-roledescription="carrousel"
      aria-label="Présentation Worship Gift"
    >
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
              transition={{ duration: prefersReducedMotion ? 0 : 1.2, ease: "easeInOut" }}
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
            initial={{ opacity: prevSlide === null ? 1 : 0 }}
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
              sizes="(max-width: 768px) 100vw, 100vw"
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
          transition={{ duration: prefersReducedMotion ? 0 : 6, ease: "easeOut" }}
          className="absolute inset-0 pointer-events-none"
        />
      </div>

      {/* Overlay dégradé */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/90 pointer-events-none" />

      {/* Contenu centré */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-16 text-center md:pt-20">
        {/* Annonce de l'événement */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-4 py-1.5 backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C4161C] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C4161C]" />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white sm:text-[11px]">
            Africa Tour 2026 · Concert Live · 11 Oct · Stade RUC, Casablanca
          </span>
        </motion.div>

        <motion.h1
          key={`title-${current}`}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="t-hero text-[#C9A84C]"
        >
          Worship Gift
        </motion.h1>

        <motion.p
          key={`sub-${current}`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-6 max-w-2xl t-lead text-gray-200"
        >
          <strong className="font-semibold text-white">Jonathan C. Gambela</strong> en concert
          live au Stade RUC de Casablanca. Vis une expérience unique de Gospel et d&rsquo;adoration.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <Link
            href="/billetterie"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#C4161C] px-8 text-sm font-bold text-white shadow-lg shadow-[#C4161C]/30 transition-all hover:bg-[#e0272d] active:scale-[0.98]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" /><path d="M13 5v14" /></svg>
            Réserver mes billets
          </Link>
          <Link
            href="/a-propos"
            className="inline-flex h-12 items-center justify-center rounded-md border border-white/20 px-8 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            Découvrir le mouvement
          </Link>
        </motion.div>
      </div>

      {/* Indicateur de scroll */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: hideIndicator ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <button
          onClick={() => {
            const nextSection = document.querySelector("section:not(.h-dvh)");
            if (!nextSection) {
              window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
              return;
            }
            (nextSection as HTMLElement).scrollIntoView({ behavior: "smooth" });
          }}
          type="button"
          className="flex flex-col items-center gap-2 rounded-full p-2 text-[#C9A84C] transition-colors hover:text-[#F0CB6A] focus-ring"
          aria-label="Découvrir le contenu"
        >
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
          </motion.span>
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#C9A84C]/80">
            Découvrir
          </span>
        </button>
      </motion.div>

      {/* Indicateurs dots */}
      <div className="absolute bottom-8 right-8 z-20 flex gap-2" role="group" aria-label="Choix du slide">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 focus-ring ${
              i === current
                ? "w-8 bg-[#C9A84C]"
                : "w-1.5 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Aller au slide ${i + 1} sur ${slides.length}`}
            aria-current={i === current ? "true" : undefined}
          />
        ))}
      </div>
    </section>
  );
}