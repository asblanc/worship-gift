"use client";

import { motion } from "framer-motion";
import Link from "next/link";
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
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

// Affiche CSS — format horizontal pour l'accueil
function EventPoster({ event }: { event: (typeof upcomingEvents)[0] }) {
  return (
    <div
      className="relative aspect-[16/9] overflow-hidden"
      style={{
        background: `linear-gradient(135deg, #000000 0%, #1a1a1a 40%, ${event.color}08 100%)`,
      }}
    >
      {/* Motif de points subtil */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle, #C9A84C 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Logo Worship Gift */}
      <div className="absolute top-3 left-3 z-10">
        <img
          src="/img_worship-gift/logo-worship-gift.png"
          alt="Worship Gift"
          className="h-6 w-auto opacity-80"
        />
      </div>

      {/* Badge PROCHAINEMENT */}
      <div className="absolute top-3 right-3 z-10">
        <span className="inline-block rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/15 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#C9A84C]">
          Bientôt
        </span>
      </div>

      {/* Titre centré */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <h3 className="font-heading text-xl font-bold leading-tight text-[#C9A84C] md:text-2xl">
          {event.title}
        </h3>
        <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-300">
          <span>{event.date}</span>
          <span className="text-[#C9A84C]">•</span>
          <span>{event.time}</span>
          <span className="text-[#C9A84C]">•</span>
          <span>{event.location}</span>
        </div>
      </div>

      {/* Overlay dégradé */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
    </div>
  );
}

export default function EventsList() {
  return (
    <section className="bg-[#F9F5EC] px-6 py-16 md:py-20">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="font-heading text-3xl font-bold text-gray-900 md:text-4xl">
            Événements à venir
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-600">
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
              className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:border-[#C9A84C]/40 hover:shadow-md active:scale-[0.98]"
            >
              <EventPoster event={event} />

              <div className="flex flex-1 flex-col gap-3 p-5">
                <h3 className="font-heading text-lg font-semibold text-gray-900">
                  {event.title}
                </h3>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
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
                    className="inline-flex h-10 items-center justify-center rounded-md border border-[#C9A84C]/40 px-5 text-xs font-medium text-[#C9A84C] transition-all hover:border-[#C9A84C] hover:bg-[#C9A84C]/10 active:scale-[0.97]"
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