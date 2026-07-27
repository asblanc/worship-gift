"use client";

import { motion } from "framer-motion";
import { marqueeTexts } from "@/lib/events-config";

export default function Marquee() {
  const duplicated = [...marqueeTexts, ...marqueeTexts, ...marqueeTexts];

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-[#C4161C] via-[#8f0f14] to-[#0F7A3D] py-3 md:py-4">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 40,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {duplicated.map((text, i) => (
          <span
            key={`${text}-${i}`}
            className="mx-6 inline-flex items-center gap-6 font-heading text-sm font-bold uppercase tracking-[0.15em] text-white md:text-base"
          >
            {text}
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/60" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}