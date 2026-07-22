"use client";

import { useState } from "react";
import { motion } from "framer-motion";

/* ================================================================
   Worship Gift — PortfolioGallery
   Effet de galerie « portfolio » : masonry révélé au scroll avec
   effet de focus (l'image survolée passe au premier plan tandis que
   les autres se ternissent), légende animée et cadre doré.
   Recréé sur-mesure, intégré à l'identité or + Poppins.
   ================================================================ */

export type GalleryImage = { src: string; alt: string };

export default function PortfolioGallery({
  images,
  onOpen,
  caption,
}: {
  images: GalleryImage[];
  onOpen: (index: number) => void;
  caption?: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div
      className="columns-2 gap-2 sm:gap-3 md:columns-3 xl:columns-4"
      onMouseLeave={() => setHovered(null)}
    >
      {images.map((img, index) => {
        const isHovered = hovered === index;
        const isDimmed = hovered !== null && !isHovered;

        return (
          <motion.div
            key={img.src}
            className="mb-2 break-inside-avoid sm:mb-3"
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.5,
              delay: Math.min(index * 0.04, 0.8),
              ease: "easeOut",
            }}
          >
            <figure
              onMouseEnter={() => setHovered(index)}
              onClick={() => onOpen(index)}
              className={`group relative cursor-pointer overflow-hidden rounded-lg bg-[#141414] transition-all duration-500 ease-out ${
                isDimmed
                  ? "scale-[0.985] opacity-40 saturate-[0.6]"
                  : "opacity-100 saturate-100"
              } ${isHovered ? "z-10 scale-[1.015]" : ""}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                className="block h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                loading={index < 8 ? "eager" : "lazy"}
                decoding="async"
              />

              {/* Voile + cadre doré au survol */}
              <div className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 ring-1 ring-inset ring-transparent transition-all duration-300 group-hover:opacity-100 group-hover:ring-2 group-hover:ring-[#C9A84C]/70" />

              {/* Icône loupe */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="flex h-11 w-11 scale-50 items-center justify-center rounded-full border-2 border-[#C9A84C] bg-black/30 text-[#C9A84C] opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </span>
              </div>

              {/* Légende qui remonte */}
              <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-3 items-center justify-between gap-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                {caption ? (
                  <span className="font-poppins text-sm font-semibold text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]">
                    {caption}
                  </span>
                ) : (
                  <span aria-hidden />
                )}
                <span className="rounded-full bg-black/50 px-2 py-0.5 font-poppins text-xs font-semibold text-[#C9A84C] backdrop-blur-sm">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </figcaption>
            </figure>
          </motion.div>
        );
      })}
    </div>
  );
}
