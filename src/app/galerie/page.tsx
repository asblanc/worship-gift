"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";

const Lightbox = dynamic(() => import("@/components/Lightbox"), {
  ssr: false,
});

/* ================================================================
   CONFIGURATION IMAGES
   ================================================================
   
   ═══════════════════════════════════════════════════════════════
   1️⃣ Ajouter un nouvel événement (section)
   ═══════════════════════════════════════════════════════════════
   - Copier-coller un bloc eventData existant (ex. derek ci-dessous)
   - Remplacer les IDs par ceux de vos nouvelles images (ex. img_x1, img_x2...)
   - L'ordre des sections dans le tableau `sections` détermine 
     l'ordre d'affichage sur la page (du haut vers le bas).
   
   ═══════════════════════════════════════════════════════════════
   2️⃣ Ajouter des images à une section existante
   ═══════════════════════════════════════════════════════════════
   - Il suffit d'ajouter le numéro de l'image dans le tableau `ids`
     du bloc concerné (morijahIds ou derekIds).
   - Exemple : si vous ajoutez img_m50.jpg, ajoutez 50 dans morijahIds.
   ================================================================ */

// ─── Images Morijah (préfixe img_m*) ──────────────────────────────
const morijahIds = [
  1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
  38, 39, 40, 41, 42, 43, 44, 45, 46,
];

const morijahImages = morijahIds.map((id) => ({
  src: `/img_worship-gift/img_m${id}.jpg`,
  alt: `Concert Morijah Worship Gift – Photo ${id}`,
}));

// ─── Images Derek Jones (préfixe img_d*) ──────────────────────────
const derekIds = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 34, 35, 36,
];

const derekImages = derekIds.map((id) => ({
  src: `/img_worship-gift/img_d${id}.jpg`,
  alt: `Concert Derek Jones Worship Gift – Photo ${id}`,
}));

// ─── Configuration des sections ────────────────────────────────────
// L'ordre du tableau détermine l'ordre d'affichage sur la page.
// Pour ajouter une 3e section, ajouter un objet ici :
//   { id: "nouvel-event", title: "...", subtitle: "...", images: [...] }
const sections = [
  {
    id: "morijah",
    title: "Concert Gospel avec la chantre Morijah",
    subtitle:
      "Revivez les moments forts de cette soirée de louange avec Morijah, une voix qui touche l'âme.",
    images: morijahImages,
  },
  {
    id: "derek",
    title: "Concert Gospel avec le chantre Derek Jones",
    subtitle:
      "Une soirée inoubliable sous la direction du chantre Derek Jones. Louange, adoration et communion.",
    images: derekImages,
  },
];

// ─── Animations ────────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

/**
 * Alterne les ratios pour un effet visuel dynamique
 * sans utiliser de row-span CSS (meilleur support mobile).
 */
function getAspectClass(index: number): string {
  const patterns = [
    "aspect-[3/4]",
    "aspect-square",
    "aspect-[4/3]",
    "aspect-[3/4]",
    "aspect-square",
    "aspect-[4/5]",
    "aspect-[3/4]",
    "aspect-square",
  ];
  return patterns[index % patterns.length];
}

export default function GaleriePage() {
  // État de la lightbox : on stocke la section active ET l'index dans cette section
  const [lightboxState, setLightboxState] = useState<{
    sectionId: string;
    index: number;
  } | null>(null);

  const openLightbox = useCallback(
    (sectionId: string, index: number) =>
      setLightboxState({ sectionId, index }),
    [],
  );

  const closeLightbox = useCallback(() => setLightboxState(null), []);

  const activeSection = lightboxState
    ? sections.find((s) => s.id === lightboxState.sectionId)
    : null;

  const activeImages = activeSection?.images ?? [];

  const prevImage = useCallback(() => {
    setLightboxState((prev) => {
      if (!prev) return null;
      const total = activeImages.length;
      return {
        ...prev,
        index: (prev.index - 1 + total) % total,
      };
    });
  }, [activeImages.length]);

  const nextImage = useCallback(() => {
    setLightboxState((prev) => {
      if (!prev) return null;
      const total = activeImages.length;
      return {
        ...prev,
        index: (prev.index + 1) % total,
      };
    });
  }, [activeImages.length]);

  const totalPhotos = sections.reduce(
    (sum, section) => sum + section.images.length,
    0,
  );

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        {/* ═══════════════════════════════════════════════════════════
            HERO
           ═══════════════════════════════════════════════════════════ */}
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
              Revivez les meilleurs moments de nos concerts Gospel à travers une
              sélection de photos. Chaque cliché raconte l&rsquo;émotion, la
              louange et la communion vécues lors de nos événements avec la
              chantre <strong>Morijah</strong> et le chantre{" "}
              <strong>Derek Jones</strong>.
            </p>
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SECTIONS CONCERTS
           ═══════════════════════════════════════════════════════════ */}
        <section className="bg-[#F3EFE6] px-4 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-7xl space-y-20">
            {sections.map((section) => (
              <motion.div
                key={section.id}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
              >
                {/* En-tête de section */}
                <div className="mb-10 text-center">
                  <h2 className="font-heading text-3xl font-bold text-[#1a1a1a] md:text-4xl">
                    {section.title}
                  </h2>
                  <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-gray-600">
                    {section.subtitle}
                  </p>
                </div>

                {/* Grille responsive 3 cols → 2 cols → 1 col */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {section.images.map((img, index) => (
                    <motion.div
                      key={img.src}
                      variants={itemVariants}
                      className="group relative cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
                      onClick={() => openLightbox(section.id, index)}
                    >
                      <div
                        className={`relative w-full ${getAspectClass(index)}`}
                      >
                        <Image
                          src={img.src}
                          alt={img.alt}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          priority={index < 6}
                          quality={80}
                        />
                      </div>
                      {/* Overlay au survol */}
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
                </div>
              </motion.div>
            ))}

            {/* Compteur global */}
            <p className="text-center text-xs text-gray-400">
              {totalPhotos} photos dans la galerie
            </p>
          </div>
        </section>
      </main>

      {/* ═══════════════════════════════════════════════════════════════
          LIGHTBOX
         ═══════════════════════════════════════════════════════════════ */}
      {lightboxState !== null && activeImages.length > 0 && (
        <Lightbox
          images={activeImages}
          currentIndex={lightboxState.index}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </>
  );
}