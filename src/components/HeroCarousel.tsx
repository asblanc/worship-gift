"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CONCERT_PROMO_DEADLINE } from "@/lib/concert-promo";

const HERO_SLIDES = [
  {
    src: "/img_worship-gift/affiche-africa-tour.webp",
    alt: "Affiche Africa Tour de Jonathan C. Gambela à Casablanca",
  },
  {
    src: "/img_worship-gift/hero-0.jpeg",
    alt: "Jonathan C. Gambela chantant sur scène",
  },
  {
    src: "/img_worship-gift/hero-1.jpg",
    alt: "Vue d'une salle de concert",
  },
  {
    src: "/img_worship-gift/hero-2.jpeg",
    alt: "Public levant les mains pendant un concert Gospel",
  },
  {
    src: "/img_worship-gift/hero-3.jpeg",
    alt: "Public en adoration pendant un concert Gospel",
  },
  {
    src: "/img_worship-gift/hero-4.jpeg",
    alt: "Salle prête à accueillir un concert",
  },
];

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const EMPTY_TIME: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function getTimeLeft(now = Date.now()): TimeLeft {
  const difference = Math.max(0, CONCERT_PROMO_DEADLINE - now);

  return {
    days: Math.floor(difference / 86_400_000),
    hours: Math.floor((difference / 3_600_000) % 24),
    minutes: Math.floor((difference / 60_000) % 60),
    seconds: Math.floor((difference / 1_000) % 60),
  };
}

const COUNTDOWN_UNITS: Array<{ key: keyof TimeLeft; label: string }> = [
  { key: "days", label: "Jours" },
  { key: "hours", label: "Heures" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Secondes" },
];

const REASSURANCE_POINTS = [
  "Paiement sécurisé",
  "E-billet immédiat",
  "Paiement à la livraison possible",
];

function HeroCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(EMPTY_TIME);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const update = () => setTimeLeft(getTimeLeft());
    setMounted(true);
    update();
    const timer = window.setInterval(update, 1_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div
      className="grid grid-cols-4 gap-1.5 sm:gap-2"
      aria-label={mounted ? "Compte à rebours avant le concert" : "Chargement du compte à rebours"}
    >
      {COUNTDOWN_UNITS.map((unit) => (
        <div
          key={unit.key}
          className="rounded-lg border border-[#C9A84C]/25 bg-black/50 px-1.5 py-2 text-center backdrop-blur-sm sm:px-3 sm:py-2.5"
        >
          <span className="block font-heading text-xl font-bold leading-none tabular-nums text-white sm:text-2xl">
            {mounted ? String(timeLeft[unit.key]).padStart(2, "0") : "--"}
          </span>
          <span className="mt-1 block text-[8px] font-semibold uppercase tracking-[0.1em] text-[#C9A84C] sm:text-[9px]">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (paused || shouldReduceMotion) return;

    const timer = window.setInterval(() => {
      setCurrentSlide((current) => (current + 1) % HERO_SLIDES.length);
    }, 6_000);

    return () => window.clearInterval(timer);
  }, [paused, shouldReduceMotion]);

  return (
    <section
      aria-labelledby="hero-concert-title"
      className="relative overflow-hidden bg-[#080808]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(60% 55% at 88% 22%, rgba(196,22,28,0.2), transparent 70%), radial-gradient(52% 52% at 10% 85%, rgba(201,168,76,0.1), transparent 72%)",
        }}
      />

      <div className="relative mx-auto grid min-h-[700px] max-w-7xl grid-cols-1 items-center gap-4 px-5 pb-8 pt-32 sm:min-h-[720px] sm:px-8 md:min-h-[680px] md:grid-cols-[minmax(0,1.08fr)_minmax(300px,0.92fr)] md:gap-10 md:px-10 md:pb-14 md:pt-32 lg:gap-16 lg:px-12">
        {/* L'affiche passe avant le texte sur mobile pour présenter immédiatement l'événement. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="order-1 flex justify-center md:order-2 md:justify-end"
        >
          <div
            className="relative h-[166px] w-[133px] overflow-hidden rounded-xl border border-[#C9A84C]/40 bg-black shadow-[0_16px_42px_rgba(0,0,0,0.55)] ring-1 ring-white/10 sm:h-[208px] sm:w-[166px] md:h-auto md:w-full md:max-w-[400px] md:aspect-[4/5]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setPaused(false);
              }
            }}
            role="region"
            aria-roledescription="carrousel"
            aria-label="Images du concert de Jonathan C. Gambela"
          >
            <AnimatePresence initial={false}>
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.7 }}
                className="absolute inset-0"
              >
                <Image
                  src={HERO_SLIDES[currentSlide].src}
                  alt={HERO_SLIDES[currentSlide].alt}
                  fill
                  priority={currentSlide === 0}
                  quality={80}
                  sizes="(max-width: 767px) 166px, (max-width: 1024px) 36vw, 400px"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
            <div
              className="absolute inset-x-0 bottom-0 z-10 flex justify-center gap-0.5 bg-gradient-to-t from-black/70 to-transparent pb-1.5 pt-5"
              role="group"
              aria-label="Choisir une image"
            >
              {HERO_SLIDES.map((slide, index) => (
                <button
                  key={slide.src}
                  type="button"
                  onClick={() => setCurrentSlide(index)}
                  className="flex h-4 w-4 items-center justify-center rounded-full focus-ring"
                  aria-label={`Afficher l’image ${index + 1} sur ${HERO_SLIDES.length}`}
                  aria-pressed={currentSlide === index}
                >
                  <span
                    className={`h-1.5 rounded-full transition-all ${
                      currentSlide === index ? "w-3 bg-[#C9A84C]" : "w-1.5 bg-white/70"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="order-2 text-center md:order-1 md:text-left">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="inline-flex rounded-full border border-[#C4161C]/60 bg-[#C4161C]/15 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-white sm:text-[10px] md:text-left"
          >
            DIM. 11 OCTOBRE 2026 · 15H00 · STADE RUC, CASABLANCA
          </motion.p>

          <motion.h1
            id="hero-concert-title"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.14 }}
            className="mt-3 font-heading text-[1.75rem] font-bold leading-[1.08] tracking-[-0.025em] text-white sm:mt-4 sm:text-[2.15rem] md:max-w-2xl md:text-[clamp(2.4rem,4.1vw,4rem)]"
          >
            Jonathan C. Gambela en concert live à Casablanca
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-300 sm:text-base md:mx-0 md:mt-4 md:text-lg"
          >
            Il reste peu de temps. Sécurise ta place avant qu&apos;il ne soit trop tard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.26 }}
            className="mx-auto mt-4 max-w-sm md:mx-0 md:mt-6"
          >
            <HeroCountdown />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32 }}
            className="mx-auto mt-4 flex max-w-md flex-row gap-2.5 sm:mt-5 md:mx-0"
          >
            <Link
              href="/billetterie"
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-[#C4161C] px-3 text-center text-xs font-bold text-white shadow-lg shadow-[#C4161C]/35 transition-all hover:bg-[#e0272d] hover:shadow-[#C4161C]/50 active:scale-[0.98] focus-ring sm:px-5 sm:text-sm"
            >
              Prendre mon billet — dès 200 MAD
            </Link>
            <Link
              href="/billetterie/concert-gospel-2026/reserver"
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full border border-[#25D366]/65 bg-[#25D366]/10 px-3 text-center text-xs font-semibold text-white transition-colors hover:bg-[#25D366]/20 active:scale-[0.98] focus-ring sm:px-5 sm:text-sm"
            >
              Payer à la livraison
            </Link>
          </motion.div>

          <ul className="mx-auto mt-4 flex max-w-md flex-wrap justify-center gap-1.5 text-[9px] font-medium text-gray-300 md:mx-0 md:justify-start sm:text-[10px]" aria-label="Garanties de réservation">
            {REASSURANCE_POINTS.map((point) => (
              <li key={point} className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.045] px-2 py-1.5">
                <svg aria-hidden="true" className="h-3 w-3 shrink-0 text-[#C9A84C]" viewBox="0 0 16 16" fill="none">
                  <path d="m3.25 8.25 2.7 2.7 6.8-6.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {point}
              </li>
            ))}
          </ul>

          <Link
            href="/a-propos"
            className="mt-3 inline-flex text-xs text-gray-400 underline decoration-gray-600 underline-offset-4 transition-colors hover:text-[#C9A84C] focus-ring"
          >
            Découvrir le mouvement
          </Link>
        </div>
      </div>
    </section>
  );
}
