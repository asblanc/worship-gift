"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import { albums } from "@/lib/gallery-config";

/* ================================================================
   Worship Gift — Galerie (index)
   Affiche les albums sous forme de dossiers. Chaque dossier ouvre
   sa propre page : /galerie/[slug].
   ================================================================ */

export default function GaleriePage() {
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
          Revivez les meilleurs moments de nos concerts Gospel. Choisissez un
          album pour découvrir ses photos.
        </PageHero>

        {/* DOSSIERS / ALBUMS */}
        <section className="min-h-screen bg-black px-4 py-14 md:px-8 md:py-20">
          <div className="mx-auto max-w-5xl">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-10 text-center t-h2 text-white"
            >
              Nos événements en images
            </motion.h2>

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
                    <div className="relative h-56 w-full overflow-hidden sm:h-64">
                      <Image
                        src={album.cover}
                        alt={`Couverture ${album.title}`}
                        fill
                        className="object-cover brightness-[0.65] transition-all duration-500 group-hover:scale-105 group-hover:brightness-75"
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
          </div>
        </section>
      </main>
    </>
  );
}
