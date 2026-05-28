"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";

const Lightbox = dynamic(() => import("@/components/Lightbox"), {
  ssr: false,
});

/* ================================================================
   IMPORTANT : Toutes les images img_*.jpg dans /public/img_worship-gift/
   sont automatiquement incluses. Si tu ajoutes de nouvelles images
   img_XXX.jpg dans ce dossier, elles apparaîtront automatiquement
   dans la galerie (pas besoin de modifier ce fichier).
   
   Fix mobile : Chaque tuile utilise un aspect-ratio explicite avec
   position relative, ce qui garantit que next/image fill fonctionne
   correctement sur tous les appareils (iOS Safari inclus).
   ================================================================ */

// Liste générée automatiquement — basée sur les fichiers dans public/img_worship-gift/
// Pattern : img_ suivi d'un nombre, extension .jpg
const IMAGE_IDS = [
  1, 3, 4, 5, 6, 7, 9, 11, 12, 21, 23, 28, 30, 33, 34, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 59, 60,
  61, 62, 63, 64, 66, 67, 69, 70, 71, 72, 73, 75, 76, 77, 78, 79, 80, 81, 82,
  84, 85, 86, 87, 88, 89, 90, 91, 92, 95, 96, 100, 101, 103, 105, 106, 107,
  108, 109, 110, 20,
];

const images = IMAGE_IDS.map((id) => ({
  src: `/img_worship-gift/img_${id}.jpg`,
  alt: `Galerie Worship Gift – Photo ${id}`,
}));

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

/**
 * Mélange déterministe : alterne les ratios pour un effet masonry visuel
 * sans dépendre de row-span CSS qui casse next/image fill sur mobile.
 */
function getAspectClass(index: number): string {
  const patterns = [
    "aspect-[3/4]",   // portrait
    "aspect-square",   // carré
    "aspect-[4/3]",   // paysage
    "aspect-[3/4]",
    "aspect-square",
    "aspect-[4/5]",   // portrait allongé
    "aspect-[3/4]",
    "aspect-square",
  ];
  return patterns[index % patterns.length];
}

export default function GaleriePage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () =>
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + images.length) % images.length : null
    );
  const nextImage = () =>
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % images.length : null
    );

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        {/* Héro */}
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
              Revivez les meilleurs moments de nos rencontres à travers notre
              galerie d'images. Louange, adoration, communion&hellip;
              chaque photo raconte une histoire.
            </p>
          </motion.div>
        </section>

        {/* Grille masonry avec aspect-ratio */}
        <section className="bg-[#F3EFE6] px-3 py-12 md:px-6 md:py-20">
          <div className="mx-auto max-w-7xl">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4"
            >
              {images.map((img, index) => (
                <motion.div
                  key={img.src}
                  variants={itemVariants}
                  className="group relative mb-3 cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm md:mb-4 break-inside-avoid"
                  onClick={() => openLightbox(index)}
                >
                  {/* Conteneur avec aspect-ratio pour next/image fill */}
                  <div
                    className={`relative w-full ${getAspectClass(index)}`}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                      priority={index < 8}
                      quality={75}
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
            </motion.div>

            {/* Compteur */}
            <p className="mt-8 text-center text-xs text-gray-400">
              {images.length} photos dans la galerie
            </p>
          </div>
        </section>
      </main>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </>
  );
}