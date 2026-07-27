"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Eyebrow from "@/components/Eyebrow";

/* ================================================================
   Worship Gift — PageHero
   Héro de page unifié et cinématographique : image HD avec léger
   zoom (Ken Burns), étalonnage (dégradé + vignette), grain film,
   eyebrow + titre serif + chapô. Utilisé sur toutes les pages
   secondaires pour une direction artistique cohérente.
   ================================================================ */

export default function PageHero({
  image,
  alt = "",
  eyebrow,
  title,
  children,
  priority = true,
  objectPosition = "center",
}: {
  image: string;
  alt?: string;
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
  priority?: boolean;
  objectPosition?: string;
}) {
  return (
    <section className="grain-overlay relative isolate overflow-hidden border-b border-[#282828] bg-black px-6 py-28 md:py-36">
      {/* Liseré aux couleurs de l'événement (rouge · or · vert) */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 z-20 h-1 bg-gradient-to-r from-[#C4161C] via-[#C9A84C] to-[#0F7A3D]"
      />
      {/* Image de fond — léger zoom lent (Ken Burns) */}
      <motion.div
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 9, ease: "easeOut" }}
        className="absolute inset-0 -z-10"
      >
        <Image
          src={image}
          alt={alt}
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition }}
        />
      </motion.div>

      {/* Étalonnage : dégradé bas + vignette radiale */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-black/55 to-black" />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 85% at 50% 8%, transparent 42%, rgba(0,0,0,0.65) 100%)",
        }}
      />

      {/* Contenu */}
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center"
      >
        {eyebrow && <Eyebrow centered>{eyebrow}</Eyebrow>}
        <h1 className="t-hero text-[#C9A84C] [text-shadow:0_2px_30px_rgba(0,0,0,0.9)]">
          {title}
        </h1>
        {children && (
          <div className="mx-auto mt-5 max-w-2xl t-lead text-[#DADADA] [text-shadow:0_1px_12px_rgba(0,0,0,0.9)]">
            {children}
          </div>
        )}
      </motion.div>
    </section>
  );
}
