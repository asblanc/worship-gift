"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { nextEvent } from "@/lib/events-config";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

const units = [
  { key: "days" as const, label: "Jours" },
  { key: "hours" as const, label: "Heures" },
  { key: "minutes" as const, label: "Minutes" },
  { key: "seconds" as const, label: "Secondes" },
];

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(
    calcTimeLeft(nextEvent.date),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calcTimeLeft(nextEvent.date));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="px-6 py-16 md:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-8 text-sm font-medium uppercase tracking-[0.2em] text-gray-400">
          {nextEvent.title}
        </p>
        <div className="flex items-center justify-center gap-2 md:gap-4">
          {units.map((unit, i) => (
            <motion.div
              key={unit.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="flex h-20 w-20 flex-col items-center justify-center rounded-lg border border-[#C9A84C]/20 bg-[#C9A84C]/5 backdrop-blur-sm md:h-28 md:w-28">
                <motion.span
                  key={timeLeft[unit.key]}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-heading text-3xl font-bold text-white md:text-5xl"
                >
                  {pad(timeLeft[unit.key])}
                </motion.span>
              </div>
              <span className="mt-2 text-[10px] font-medium uppercase tracking-[0.15em] text-gray-500 md:text-xs">
                {unit.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}