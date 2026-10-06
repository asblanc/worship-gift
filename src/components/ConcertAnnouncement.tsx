"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { isConcertPromoOver, remainingConcertDays } from "@/lib/concert-promo";

const DISMISS_KEY = "worship-gift-concert-announcement-dismissed";

/** Bandeau global : la fermeture est limitée à la session en cours. */
export default function ConcertAnnouncement() {
  const [now, setNow] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const barRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setNow(Date.now());
    setDismissed(sessionStorage.getItem(DISMISS_KEY) === "true");

    const timer = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(timer);
  }, []);

  const isVisible = now !== null && !dismissed;

  useEffect(() => {
    if (!isVisible) return;

    const root = document.documentElement;
    const updateHeight = () => {
      root.style.setProperty(
        "--announcement-bar-height",
        barRef.current ? `${barRef.current.offsetHeight}px` : "0px",
      );
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    if (barRef.current) observer.observe(barRef.current);
    window.addEventListener("resize", updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
      root.style.setProperty("--announcement-bar-height", "0px");
    };
  }, [isVisible]);

  if (!isVisible || now === null) return null;

  const concertOver = isConcertPromoOver(now);
  const days = remainingConcertDays(now);
  const dayLabel = days === 1 ? "jour" : "jours";

  return (
    <aside
      ref={barRef}
      aria-label="Annonce du concert"
      className="sticky top-0 z-[70] bg-[#B3001B] text-white shadow-md shadow-black/25"
    >
      <div className="relative mx-auto flex min-h-10 max-w-7xl items-center justify-center px-10 py-2 text-center text-xs font-semibold leading-snug sm:px-14 sm:text-sm">
        {concertOver ? (
          <span>Concert terminé – merci !</span>
        ) : (
          <Link
            href="/billetterie"
            className="rounded-sm underline decoration-white/60 decoration-1 underline-offset-2 transition-colors hover:text-[#FFE8A6] focus-ring"
          >
            🔥 Concert Jonathan C. Gambela · Dim. 11 Oct · Plus que {days} {dayLabel} – Prenez votre billet
          </Link>
        )}
        <button
          type="button"
          onClick={() => {
            sessionStorage.setItem(DISMISS_KEY, "true");
            setDismissed(true);
          }}
          className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-lg leading-none text-white/90 transition-colors hover:bg-white/15 hover:text-white focus-ring sm:right-4"
          aria-label="Fermer l'annonce"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
    </aside>
  );
}
