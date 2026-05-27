"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { upcomingEvents } from "@/lib/events-config";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function EventsList() {
  return (
    <section className="px-6 py-16 md:py-20">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
            Événements à venir
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-400">
            Reste connecté et réserve ta place pour les prochains rendez-vous
            du mouvement Worship Gift.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {upcomingEvents.map((event) => (
            <motion.div
              key={event.title}
              variants={cardVariants}
              className="group flex flex-col overflow-hidden rounded-lg border border-white/10 bg-black transition-all hover:border-[#C9A84C]/30 hover:shadow-lg hover:shadow-[#C9A84C]/5"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              <div className="flex flex-1 flex-col gap-3 p-5">
                <h3 className="font-heading text-lg font-semibold text-white">
                  {event.title}
                </h3>
                <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                  <span>{event.date}</span>
                  <span>{event.time}</span>
                  <span>{event.location}</span>
                </div>
                <p className="text-sm leading-relaxed text-gray-500">
                  {event.description}
                </p>
                <div className="mt-auto pt-2">
                  <Link
                    href="/billetterie"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-[#C9A84C]/40 px-5 text-xs font-medium text-[#C9A84C] transition-all hover:border-[#C9A84C] hover:bg-[#C9A84C]/10"
                  >
                    Voir les détails
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}