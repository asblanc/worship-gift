"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";

const Lightbox = dynamic(() => import("@/components/Lightbox"), { ssr: false });

/* ================================================================
   CONFIGURATION DES PHOTOS
   ================================================================

   ── Ajouter des photos à Morijah ──────────────────────────────
   Ajoutez l'ID dans le tableau morijahIds (ex: 47 pour img_m47.jpg)

   ── Ajouter des photos à Derek Jones ─────────────────────────
   Ajoutez l'ID dans le tableau derekIds (ex: 37 pour img_d37.jpg)

   ── Ajouter un 3e événement (ex. Worship Gift 3) ─────────────
   1. Créez un tableau d'IDs : const wg3Ids = [1, 2, 3, ...]
   2. Mappez-les : const wg3Images = wg3Ids.map(...)
   3. Ajoutez un objet dans le tableau `folders` ci-dessous.
   ================================================================ */

// ─── Images Morijah (préfixe img_m*) ──────────────────────────
const morijahIds = [
  1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
  38, 39, 40, 41, 42, 43, 44, 45, 46,
];

const morijahImages = morijahIds.map((id) => ({
  src: `/img_worship-gift/img_m${id}.jpg`,
  alt: `Concert Morijah Worship Gift – Photo ${id}`,
}));

// ─── Images Derek Jones (préfixe img_d*) ──────────────────────
const derekIds = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 34, 35, 36,
];

const derekImages = derekIds.map((id) => ({
  src: `/img_worship-gift/img_d${id}.jpg`,
  alt: `Concert Derek Jones Worship Gift – Photo ${id}`,
}));

// ─── Dossiers / collections ────────────────────────────────────
const folders = [
  {
    id: "morijah",
    label: "Worship Gift 2",
    title: "Worship Gift 2 – Morijah",
    subtitle:
      "Soirée de louange et d'adoration avec la chantre Morijah. Une voix qui touche les cœurs.",
    cover: "/img_worship-gift/img_m8.jpg",
    images: morijahImages,
  },
  {
    id: "derek",
    label: "Worship Gift 1",
    title: "Worship Gift 1 – Derek Jones",
    subtitle:
      "Une nuit de Gospel et de communion inoubliable avec le chantre Derek Jones.",
    cover: "/img_worship-gift/img_d8.jpg",
    images: derekImages,
  },
];

// ─── Animations ────────────────────────────────────────────────
const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.035 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

export default function GaleriePage() {
  // Dossier sélectionné par défaut : Morijah (événement le plus récent)
  const [activeId, setActiveId] = useState<string>("morijah");
  const [lightboxState, setLightboxState] = useState<{ index: number } | null>(
    null,
  );

  const activeFolder = folders.find((f) => f.id === activeId)!;

  const handleSelectFolder = useCallback((id: string) => {
    setActiveId(id);
    setLightboxState(null);
  }, []);

  const openLightbox = useCallback(
    (index: number) => setLightboxState({ index }),
    [],
  );
  const closeLightbox = useCallback(() => setLightboxState(null), []);

  const prevImage = useCallback(() => {
    setLightboxState((prev) => {
      if (!prev) return null;
      const total = activeFolder.images.length;
      return { index: (prev.index - 1 + total) % total };
    });
  }, [activeFolder.images.length]);

  const nextImage = useCallback(() => {
    setLightboxState((prev) => {
      if (!prev) return null;
      const total = activeFolder.images.length;
      return { index: (prev.index + 1) % total };
    });
  }, [activeFolder.images.length]);

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">

        {/* ══════════════════════════════════════════════════════
            HERO
           ══════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden border-b border-white/10 bg-black px-6 py-24 md:py-32">
          <Image
            src="/img_worship-gift/img_galerie.jpg"
            alt="Worship Gift Galerie"
            fill
            className="object-cover opacity-90 brightness-110 saturate-105"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-black/90" />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 mx-auto max-w-4xl text-center"
          >
            <h1 className="font-heading text-5xl font-bold text-[#C9A84C] md:text-6xl [text-shadow:0_2px_20px_rgba(0,0,0,0.95)]">
              Galerie
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.9)]">
              Revivez les meilleurs moments de nos concerts Gospel. Sélectionnez
              un événement pour explorer ses photos.
            </p>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════════════════
            SÉLECTEUR DE DOSSIERS
           ══════════════════════════════════════════════════════ */}
        <section className="border-b border-white/10 bg-black px-4 py-14 md:px-8 md:py-20">
          <div className="mx-auto max-w-5xl">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-10 text-center font-heading text-2xl font-bold text-white md:text-3xl"
            >
              Nos événements en images
            </motion.h2>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {folders.map((folder, i) => {
                const isActive = folder.id === activeId;
                return (
                  <motion.button
                    key={folder.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    onClick={() => handleSelectFolder(folder.id)}
                    aria-label={`Voir les photos : ${folder.title}`}
                    aria-pressed={isActive}
                    className={[
                      "group relative overflow-hidden rounded-xl text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]",
                      "border bg-[#111]",
                      isActive
                        ? "border-[#C9A84C] shadow-[0_0_32px_rgba(201,168,76,0.22)]"
                        : "border-white/10 hover:border-[#C9A84C]/50 hover:shadow-[0_0_18px_rgba(201,168,76,0.1)]",
                    ].join(" ")}
                  >
                    {/* Vignette de couverture */}
                    <div className="relative h-48 w-full overflow-hidden sm:h-56">
                      <Image
                        src={folder.cover}
                        alt={`Couverture ${folder.title}`}
                        fill
                        className={[
                          "object-cover transition-all duration-500",
                          isActive
                            ? "scale-105 brightness-75"
                            : "brightness-60 group-hover:scale-105 group-hover:brightness-75",
                        ].join(" ")}
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-black/20 to-transparent" />

                      {/* Badge état actif */}
                      {isActive && (
                        <span className="absolute top-3 right-3 rounded-full bg-[#C9A84C] px-3 py-1 text-xs font-bold text-black">
                          Sélectionné
                        </span>
                      )}

                      {/* Icône loupe centrée quand inactif */}
                      {!isActive && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#C9A84C] text-[#C9A84C]">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="22"
                              height="22"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="15 3 21 3 21 9" />
                              <polyline points="9 21 3 21 3 15" />
                              <line x1="21" y1="3" x2="14" y2="10" />
                              <line x1="3" y1="21" x2="10" y2="14" />
                            </svg>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Infos texte */}
                    <div className="p-5">
                      <p
                        className={[
                          "text-xs font-semibold uppercase tracking-widest transition-colors",
                          isActive ? "text-[#C9A84C]" : "text-gray-500 group-hover:text-[#C9A84C]/70",
                        ].join(" ")}
                      >
                        {folder.label}
                      </p>
                      <h3 className="mt-1.5 font-heading text-lg font-bold text-white">
                        {folder.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-gray-400">
                        {folder.subtitle}
                      </p>
                      <p
                        className={[
                          "mt-3 text-xs transition-colors",
                          isActive ? "text-[#C9A84C]/70" : "text-gray-600",
                        ].join(" ")}
                      >
                        {folder.images.length} photos
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            GRILLE DE PHOTOS
           ══════════════════════════════════════════════════════ */}
        <section className="min-h-screen bg-[#0a0a0a] px-4 py-14 md:px-8 md:py-20">
          <div className="mx-auto max-w-7xl">

            {/* En-tête dynamique du dossier actif */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeId + "-header"}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mb-12 text-center"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-[#C9A84C]">
                  {activeFolder.label}
                </p>
                <h2 className="mt-2 font-heading text-3xl font-bold text-white md:text-4xl">
                  {activeFolder.title}
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-400">
                  {activeFolder.subtitle}
                </p>
                <div className="mx-auto mt-5 h-px w-16 bg-[#C9A84C]/40" />
              </motion.div>
            </AnimatePresence>

            {/* Grille photos */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeId + "-grid"}
                variants={gridVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 md:gap-3 lg:grid-cols-3 xl:grid-cols-4"
              >
                {activeFolder.images.map((img, index) => (
                  <motion.div
                    key={img.src}
                    variants={itemVariants}
                    className="group relative cursor-pointer overflow-hidden rounded-lg bg-[#1a1a1a] shadow-md"
                    onClick={() => openLightbox(index)}
                  >
                    <div className="relative aspect-[3/4] w-full">
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        priority={index < 8}
                        quality={80}
                      />
                    </div>
                    {/* Overlay loupe au survol */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/50">
                      <span className="flex h-10 w-10 scale-50 items-center justify-center rounded-full border-2 border-[#C9A84C] text-[#C9A84C] opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="11" cy="11" r="8" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Compteur */}
            <p className="mt-12 text-center text-xs text-gray-600">
              {activeFolder.images.length} photos · {activeFolder.title}
            </p>
          </div>
        </section>
      </main>

      {/* LIGHTBOX */}
      {lightboxState !== null && (
        <Lightbox
          images={activeFolder.images}
          currentIndex={lightboxState.index}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </>
  );
}
