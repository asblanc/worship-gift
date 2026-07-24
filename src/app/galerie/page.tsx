"use client";

import { useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Eyebrow from "@/components/Eyebrow";
import PageHero from "@/components/PageHero";
import PanoramicStrip from "@/components/PanoramicStrip";
import { albums } from "@/lib/gallery-config";

const Lightbox = dynamic(() => import("@/components/Lightbox"), { ssr: false });

/* ================================================================
   Worship Gift — Galerie (index)
   1. Panoramique cinématographique : bandes photo qui défilent,
      clic = plein écran.
   2. Albums (dossiers) : chaque dossier ouvre /galerie/[slug].
   ================================================================ */

export default function GaleriePage() {
  // Sélection « best of » répartie sur tous les albums pour le panoramique.
  const highlights = useMemo(() => {
    const picks = albums.flatMap((album) =>
      album.images.filter((_, i) => i % 3 === 0),
    );
    return picks.slice(0, 18);
  }, []);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const openLightbox = useCallback((i: number) => setLightboxIndex(i), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const prevImage = useCallback(
    () =>
      setLightboxIndex((prev) =>
        prev === null ? prev : (prev - 1 + highlights.length) % highlights.length,
      ),
    [highlights.length],
  );
  const nextImage = useCallback(
    () =>
      setLightboxIndex((prev) =>
        prev === null ? prev : (prev + 1) % highlights.length,
      ),
    [highlights.length],
  );

  const totalPhotos = albums.reduce((n, a) => n + a.images.length, 0);

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        {/* HERO */}
        <PageHero
          image="/img_worship-gift/img_galerie.jpg"
          alt="Worship Gift Galerie"
          eyebrow="Galerie photo"
          title="Galerie"
        >
          Revivez l&rsquo;intensité de nos concerts Gospel. Laissez défiler les
          instants, ou ouvrez un album pour explorer chaque soirée en détail.
        </PageHero>

        {/* PANORAMIQUE — bandes photo animées, clic = plein écran */}
        <section className="relative overflow-hidden border-b border-white/10 bg-black py-14 md:py-20">
          <div className="mx-auto mb-8 max-w-5xl px-6 text-center md:mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <Eyebrow centered>En mouvement</Eyebrow>
              <h2 className="t-h2 text-white">Un aperçu en images</h2>
              <p className="mx-auto mt-4 max-w-xl t-body text-gray-300">
                {totalPhotos} photos capturées au cœur de nos soirées.
                <span className="hidden sm:inline">
                  {" "}
                  Survolez pour ralentir,
                </span>{" "}
                touchez une image pour l&rsquo;afficher en plein écran.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <PanoramicStrip images={highlights} onOpen={openLightbox} />
          </motion.div>
        </section>

        {/* DOSSIERS / ALBUMS */}
        <section className="bg-[#0a0a0a] px-4 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-10 flex flex-col items-center text-center md:mb-14"
            >
              <Eyebrow centered>Par événement</Eyebrow>
              <h2 className="t-h2 text-white">Nos événements en images</h2>
              <p className="mx-auto mt-4 max-w-xl t-body text-gray-300">
                Chaque album raconte une soirée&nbsp;: son chantre, son
                atmosphère, ses moments de grâce. Choisissez un dossier pour
                l&rsquo;explorer.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {albums.map((album, i) => (
                <motion.div
                  key={album.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Link
                    href={`/galerie/${album.slug}`}
                    aria-label={`Ouvrir l'album : ${album.title}`}
                    className="group relative block overflow-hidden rounded-xl border border-white/10 bg-[#111] transition-all duration-300 hover:border-[#C9A84C]/60 hover:shadow-[0_0_24px_rgba(201,168,76,0.18)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]"
                  >
                    {/* Couverture */}
                    <div className="relative h-60 w-full overflow-hidden sm:h-72">
                      <Image
                        src={album.cover}
                        alt={`Couverture ${album.title}`}
                        fill
                        className="object-cover brightness-[0.65] transition-all duration-700 group-hover:scale-105 group-hover:brightness-75"
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-black/20 to-transparent" />

                      {/* Badge dossier */}
                      <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-[#C9A84C] backdrop-blur-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                        </svg>
                        {album.images.length} photos
                      </span>

                      {/* Icône ouvrir au survol */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#C9A84C] bg-black/30 text-[#C9A84C]">
                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </span>
                      </div>
                    </div>

                    {/* Infos */}
                    <div className="p-5">
                      <p className="text-xs font-semibold uppercase tracking-widest text-[#C9A84C]">
                        {album.label}
                      </p>
                      <h3 className="mt-1.5 t-card-title text-white">
                        {album.title}
                      </h3>
                      <p className="mt-1.5 t-meta text-gray-300">
                        {album.subtitle}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#C9A84C]">
                        Voir l&rsquo;album
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* CTA bas de page */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-16 flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-[#111] px-6 py-10 text-center"
            >
              <h3 className="t-h3 text-white">
                Vous étiez présent&nbsp;? Partagez vos souvenirs.
              </h3>
              <p className="max-w-xl t-body text-gray-300">
                Envoyez-nous vos plus belles photos&nbsp;: les meilleures
                rejoindront la galerie de la prochaine édition.
              </p>
              <Link
                href="/contact"
                className="mt-2 inline-flex h-12 items-center justify-center rounded-full bg-[#C9A84C] px-8 text-[13px] font-semibold uppercase tracking-[0.12em] text-black transition-all hover:bg-[#F0CB6A] hover:shadow-lg hover:shadow-[#C9A84C]/30 active:scale-[0.97]"
              >
                Nous contacter
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      {lightboxIndex !== null && (
        <Lightbox
          images={highlights}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </>
  );
}
