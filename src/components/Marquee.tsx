"use client";

import { motion } from "framer-motion";
import { marqueeTexts } from "@/lib/events-config";

export default function Marquee() {
  const duplicated = [...marqueeTexts, ...marqueeTexts, ...marqueeTexts];

  return (
    <div className="relative w-full overflow-hidden bg-[#C9A84C] py-3 md:py-4">
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
            className="mx-6 inline-flex items-center gap-6 font-heading text-sm font-bold uppercase tracking-[0.15em] text-black md:text-base"
          >
            {text}
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-black/40" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}