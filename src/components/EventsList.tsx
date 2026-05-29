"use client";

import { motion } from "framer-motion";
import Image from "next/image";
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

// Affiche réelle — utilise la photo de l'événement
function EventPoster({ event }: { event: (typeof upcomingEvents)[0] }) {
  return (
    <div className="relative aspect-[2/3] overflow-hidden">
      <Image
        src={event.coverImage}
        alt={event.title}
        fill
        className="object-cover brightness-105 saturate-105 transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, 50vw"
      />
      {/* Overlay dégradé en bas */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

      {/* Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className="inline-block rounded-full border border-[#C9A84C]/60 bg-black/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#C9A84C]">
          Bientôt
        </span>
      </div>

      {/* Infos superposées en bas de l'image */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-3">
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-gray-300">
          <span>{event.date}</span>
          <span className="text-[#C9A84C]">·</span>
          <span>{event.time}</span>
          <span className="text-[#C9A84C]">·</span>
          <span>{event.location}</span>
        </div>
      </div>
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

        {/* Grille 2 colonnes fixe → 2+2 pour 4 événements */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-6 sm:grid-cols-2"
        >
          {upcomingEvents.map((event) => (
            <motion.div
              key={event.id}
              variants={cardVariants}
              className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:border-[#C9A84C]/40 hover:shadow-md active:scale-[0.98]"
            >
              <EventPoster event={event} />

              <div className="flex flex-1 flex-col gap-3 p-5">
                <h3 className="font-heading text-lg font-semibold text-gray-900">
                  {event.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500 line-clamp-2">
                  {event.description}
                </p>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <span className="font-heading text-lg font-bold text-[#C9A84C]">
                    {event.price}
                  </span>
                  <Link
                    href={`/billetterie/${event.slug}/reserver`}
                    className="inline-flex h-9 items-center justify-center rounded-md bg-[#C9A84C] px-5 text-xs font-semibold text-black transition-all hover:bg-[#F0CB6A] hover:shadow-sm active:scale-[0.97]"
                  >
                    Réserver
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
