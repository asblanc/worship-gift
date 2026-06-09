"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getAlbum } from "@/lib/gallery-config";

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
            className="rounded-md bg-[#C9A84C] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[#F0CB6A]"
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
        <section className="relative overflow-hidden border-b border-white/10 bg-black px-6 py-20 md:py-28">
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
            <h1 className="mt-2 font-heading text-4xl font-bold text-white md:text-5xl">
              {album.title}
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-300">
              {album.subtitle}
            </p>
            <p className="mt-4 text-xs text-[#C9A84C]/70">{album.images.length} photos</p>
          </motion.div>
        </section>

        {/* Masonry */}
        <section className="min-h-screen bg-[#0a0a0a] px-4 py-14 md:px-8 md:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="columns-2 gap-3 md:columns-3 xl:columns-4">
              {album.images.map((img, index) => (
                <motion.div
                  key={img.src}
                  className="break-inside-avoid mb-3 cursor-pointer group relative overflow-hidden rounded-lg bg-[#1a1a1a]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.9) }}
                  onClick={() => openLightbox(index)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="block w-full h-auto transition-transform duration-500 group-hover:scale-[1.04]"
                    loading={index < 8 ? "eager" : "lazy"}
                    decoding="async"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/50">
                    <span className="flex h-10 w-10 scale-50 items-center justify-center rounded-full border-2 border-[#C9A84C] text-[#C9A84C] opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

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
