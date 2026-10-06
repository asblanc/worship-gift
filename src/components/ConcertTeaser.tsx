"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Eyebrow from "@/components/Eyebrow";

export default function ConcertTeaser() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loadVideo, setLoadVideo] = useState(false);

  // La vidéo (3 Mo) reste hors du chemin critique : elle est chargée et
  // lancée automatiquement seulement à l'approche de la section.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setLoadVideo(true);
        observer.disconnect();
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!loadVideo || !videoRef.current) return;
    const video = videoRef.current;
    video.load();
    video.play().catch(() => {
      // Les navigateurs peuvent bloquer l'autoplay dans certains contextes ;
      // les contrôles restent disponibles pour lancer la vidéo manuellement.
    });
  }, [loadVideo]);

  return (
    <section className="border-t border-white/10 bg-[#080808] px-6 py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 md:items-center md:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_16px_50px_rgba(0,0,0,0.42)]"
        >
          <video
            ref={videoRef}
            className="aspect-video w-full object-cover"
            controls
            muted
            playsInline
            preload="none"
            poster="/img_worship-gift/teaser-concert-poster.webp"
            aria-label="Teaser du concert Jonathan Gambela"
          >
            {loadVideo && <source src="/img_worship-gift/teaser-concert.mp4" type="video/mp4" />}
            Votre navigateur ne prend pas en charge la vidéo.
          </video>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="flex flex-col items-center text-center md:items-start md:text-left"
        >
          <Eyebrow>Le rendez-vous approche</Eyebrow>
          <h2 className="t-h2 text-white">Ils t&apos;attendent le 11 octobre</h2>
          <p className="mt-4 max-w-xl t-body text-gray-300">
            Prends ta place pour vivre l&apos;Africa Tour avec Jonathan C. Gambela à Casablanca.
          </p>
          <Link
            href="/billetterie"
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[#C4161C] px-7 text-sm font-bold text-white shadow-lg shadow-[#C4161C]/30 transition-all hover:bg-[#e0272d] active:scale-[0.98] focus-ring"
          >
            Je prends mon billet
          </Link>
          <div className="relative mt-7 aspect-[4/3] w-full max-w-sm overflow-hidden rounded-xl border border-[#C9A84C]/25 bg-black md:max-w-none">
            <Image
              src="/img_worship-gift/teaser-ticket.webp"
              alt="Billet du concert Africa Tour"
              fill
              sizes="(max-width: 767px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
