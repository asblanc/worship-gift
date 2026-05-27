"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Lightbox from "@/components/Lightbox";

// Uniquement les images img_* présentes dans /public/img_worship-gift
const images = [
  { src: "/img_worship-gift/img_1.jpg", alt: "Galerie Worship Gift – Photo 1" },
  { src: "/img_worship-gift/img_3.jpg", alt: "Galerie Worship Gift – Photo 2" },
  { src: "/img_worship-gift/img_4.jpg", alt: "Galerie Worship Gift – Photo 3" },
  { src: "/img_worship-gift/img_5.jpg", alt: "Galerie Worship Gift – Photo 4" },
  { src: "/img_worship-gift/img_6.jpg", alt: "Galerie Worship Gift – Photo 5" },
  { src: "/img_worship-gift/img_7.jpg", alt: "Galerie Worship Gift – Photo 6" },
  { src: "/img_worship-gift/img_9.jpg", alt: "Galerie Worship Gift – Photo 7" },
  { src: "/img_worship-gift/img_11.jpg", alt: "Galerie Worship Gift – Photo 8" },
  { src: "/img_worship-gift/img_12.jpg", alt: "Galerie Worship Gift – Photo 9" },
];

const heights = [
  "row-span-2", "row-span-1", "row-span-1",
  "row-span-1", "row-span-2", "row-span-1",
  "row-span-1", "row-span-1", "row-span-2",
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function GaleriePage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () =>
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + images.length) % images.length : null,
    );
  const nextImage = () =>
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % images.length : null,
    );

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        {/* Héro avec image d'illustration */}
        <section className="relative border-b border-white/10 bg-black px-6 py-24 md:py-32 overflow-hidden">
          <Image
            src="/img_worship-gift/img_galerie.jpg"
            alt="Worship Gift Galerie"
            fill
            className="object-cover opacity-40"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 mx-auto max-w-4xl text-center"
          >
            <h1 className="font-heading text-5xl font-bold text-[#C9A84C] md:text-6xl">
              Galerie
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-300">
              Revivez les meilleurs moments de nos rencontres à travers notre
              galerie d'images. Louange, adoration, communion&hellip;
              chaque photo raconte une histoire.
            </p>
          </motion.div>
        </section>

        {/* Grille masonry fond clair */}
        <section className="bg-[#F3EFE6] px-4 py-16 md:px-8 md:py-20">
          <div className="mx-auto max-w-7xl">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid auto-rows-[180px] grid-cols-2 gap-3 md:auto-rows-[220px] md:grid-cols-3 md:gap-4 lg:auto-rows-[260px] lg:grid-cols-4"
            >
              {images.map((img, index) => (
                <motion.div
                  key={img.src}
                  variants={itemVariants}
                  className={`group relative cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm ${heights[index % heights.length]}`}
                  onClick={() => openLightbox(index)}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/50">
                    <span className="flex h-12 w-12 scale-50 items-center justify-center rounded-full border border-[#C9A84C] text-[#C9A84C] opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
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