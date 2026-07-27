"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getAlbum } from "@/lib/gallery-config";
import PortfolioGallery from "@/components/PortfolioGallery";

const Lightbox = dynamic(() => import("@/components/Lightbox"), { ssr: false });

/* ================================================================
   Worship Gift — Page d'un album : /galerie/[slug]
   Affiche les photos d'un événement en masonry, avec lightbox.
   ================================================================ */

export default function AlbumPage() {
  const { slug } = useParams<{ slug: string }>();
  const album = getAlbum(slug);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((i: number) => setLightboxIndex(i), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const prevImage = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null || !album) return prev;
      const total = album.images.length;
      return (prev - 1 + total) % total;
    });
  }, [album]);

  const nextImage = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null || !album) return prev;
      const total = album.images.length;
      return (prev + 1) % total;
    });
  }, [album]);

  // Album introuvable
  if (!album) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black px-6 pt-20 text-center">
          <p className="text-gray-300">Cet album est introuvable.</p>
          <Link
            href="/galerie"
            className="rounded-md bg-[#C4161C] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#e0272d]"
          >
            ← Retour à la galerie
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        {/* En-tête album */}
        <section className="relative overflow-hidden border-b border-white/10 bg-black px-6 py-16 sm:py-20 md:py-28">
          <div className="absolute inset-0 opacity-30">
            {/* Couverture floutée en fond */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={album.cover} alt="" className="h-full w-full object-cover blur-sm" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 mx-auto max-w-4xl text-center"
          >
            <Link
              href="/galerie"
              className="mb-5 inline-flex items-center gap-1.5 text-sm text-gray-300 transition-colors hover:text-[#C9A84C]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Retour à la galerie
            </Link>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#C9A84C]">
              {album.label}
            </p>
            <h1 className="mt-2 t-display text-white">
              {album.title}
            </h1>
            <p className="mx-auto mt-3 max-w-xl t-body text-gray-300">
              {album.subtitle}
            </p>
          </motion.div>
        </section>

        {/* Masonry */}
        <section className="min-h-screen bg-[#0a0a0a] px-3 py-10 sm:px-4 sm:py-14 md:px-8 md:py-20">
          <div className="mx-auto max-w-7xl">
            <PortfolioGallery
              images={album.images}
              onOpen={openLightbox}
              caption={album.title}
            />

            <div className="mt-12 text-center">
              <Link
                href="/galerie"
                className="inline-flex items-center gap-1.5 rounded-md border border-white/15 px-5 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:border-[#C9A84C]/50 hover:text-[#C9A84C]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Voir les autres albums
              </Link>
            </div>
          </div>
        </section>
      </main>

      {lightboxIndex !== null && (
        <Lightbox
          images={album.images}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </>
  );
}
