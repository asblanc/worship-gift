"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CONCERT_PROMO_DEADLINE } from "@/lib/concert-promo";

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };
const EMPTY: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function remaining(now = Date.now()): TimeLeft {
  const diff = Math.max(0, CONCERT_PROMO_DEADLINE - now);
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1_000) % 60),
  };
}

const units: Array<{ key: keyof TimeLeft; label: string }> = [
  { key: "days", label: "Jours" },
  { key: "hours", label: "Heures" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Secondes" },
];

export default function FinalConcertCTA() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<TimeLeft>(EMPTY);

  useEffect(() => {
    const update = () => setTime(remaining());
    setMounted(true);
    update();
    const timer = window.setInterval(update, 1_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden border-t border-[#C4161C]/40 bg-[#130608] px-6 py-16 text-center md:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-70" style={{ background: "radial-gradient(60% 100% at 50% 0%, rgba(196,22,28,0.5), transparent 72%)" }} />
      <div className="relative mx-auto max-w-2xl">
        <p className="t-eyebrow text-[#F0CB6A]">Africa Tour 2026</p>
        <h2 className="t-h2 mt-3 text-white">Dernière chance de vivre l&apos;Africa Tour</h2>
        <div className="mx-auto mt-7 grid max-w-md grid-cols-4 gap-2 sm:gap-3" aria-label="Compte à rebours avant le concert">
          {units.map((unit) => (
            <div key={unit.key} className="rounded-xl border border-white/15 bg-black/30 px-2 py-3 backdrop-blur-sm">
              <span className="block font-heading text-2xl font-bold tabular-nums text-white sm:text-3xl">
                {mounted ? String(time[unit.key]).padStart(2, "0") : "--"}
              </span>
              <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.1em] text-[#F0CB6A]">{unit.label}</span>
            </div>
          ))}
        </div>
        <Link href="/billetterie" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[#C4161C] px-8 text-sm font-bold text-white shadow-lg shadow-[#C4161C]/35 transition-all hover:bg-[#e0272d] active:scale-[0.98] focus-ring">
          Prendre mon billet
        </Link>
      </div>
    </section>
  );
}
