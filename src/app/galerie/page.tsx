"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Lightbox from "@/components/Lightbox";

const images = Array.from({ length: 12 }, (_, i) => ({
  src: `/img_worship-gift/img_${i + 1}.jpg`,
  alt: `Galerie Worship Gift – Photo ${i + 1}`,
}));

// Disposition masonry : on alterne des hauteurs pour créer l'effet irrégulier
const heights = [
  "row-span-2", "row-span-1", "row-span-1",
  "row-span-1", "row-span-2", "row-span-1",
  "row-span-1", "row-span-1", "row-span-2",
  "row-span-2", "row-span-1", "row-span-1",
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function GaleriePage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prevImage = () => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + images.length) % images.length : null,
    );
  };

  const nextImage = () => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % images.length : null,
    );
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        {/* Héro de page */}
        <section className="border-b border-white/10 px-6 py-20 md:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-heading text-5xl font-bold text-[#C9A84C] md:text-6xl">
              Galerie
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-300">
              Revivez les meilleurs moments de nos rencontres à travers notre
              galerie d'images. Louange, adoration, communion&hellip;
              chaque photo raconte une histoire.
            </p>
          </div>
        </section>

        {/* Grille masonry */}
        <section className="px-4 py-16 md:px-8 md:py-20">
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
                  className={`group relative cursor-pointer overflow-hidden rounded-lg border border-white/10 ${heights[index % heights.length]}`}
                  onClick={() => openLightbox(index)}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />

                  {/* Overlay au survol */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/60">
                    <span className="flex h-12 w-12 scale-50 items-center justify-center rounded-full border border-[#C9A84C] text-[#C9A84C] opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
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
          </div>
        </section>
      </main>

      {/* Lightbox */}
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