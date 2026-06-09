"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { upcomingEvents } from "@/lib/events-config";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
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

// Affiche réelle — affiche l'image du concert
function EventPosterVertical({
  event,
}: {
  event: (typeof upcomingEvents)[0];
}) {
  return (
    <div className="relative flex aspect-[2/3] w-full shrink-0 overflow-hidden rounded-l-lg md:w-44">
      {/* Image de l'affiche */}
      <Image
        src={event.coverImage}
        alt={event.title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 224px"
      />
      {/* Overlay dégradé */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      {/* Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className="inline-block rounded-full border border-[#C9A84C]/60 bg-black/60 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#C9A84C]">
          Prochainement
        </span>
      </div>
      {/* Prix en bas */}
      <div className="absolute bottom-3 left-0 right-0 z-10 text-center">
        <span className="inline-block rounded-md bg-[#C9A84C] px-3 py-1 text-xs font-bold text-black">
          {event.price}
        </span>
      </div>
    </div>
  );
}

export default function BilletteriePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        {/* Héro — fond noir avec image d'illustration */}
        <section className="relative border-b border-white/10 bg-black px-6 py-24 md:py-32 overflow-hidden">
          <Image
            src="/img_worship-gift/img_billeterie.jpg"
            alt="Billetterie Worship Gift"
            fill
            className="object-cover opacity-90 brightness-110 saturate-105"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-black/90" />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 mx-auto max-w-4xl text-center"
          >
            <h1 className="font-heading text-5xl font-bold text-[#C9A84C] md:text-6xl [text-shadow:0_2px_20px_rgba(0,0,0,0.95)]">
              Billetterie
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.9)]">
              Réserve ta place pour vivre un moment unique de Gospel au
              cœur du mouvement Worship Gift. Chaque rencontre est une
              invitation à la communion et à la joie.
            </p>
          </motion.div>
        </section>

        {/* Événements — fond blanc cassé */}
        <section className="bg-[#0D0D0D] px-6 py-16 md:py-20">
          <div className="mx-auto max-w-4xl">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="space-y-6"
            >
              {upcomingEvents.map((event) => (
                <motion.div
                  key={event.id}
                  variants={cardVariants}
                  className="group flex flex-col overflow-hidden rounded-lg border border-white/10 bg-white/5 shadow-sm transition-all hover:border-[#C9A84C]/40 hover:shadow-md md:flex-row"
                >
                  {/* Affiche réelle */}
                  <EventPosterVertical event={event} />

                  {/* Contenu */}
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <h2 className="font-heading text-xl font-semibold text-white md:text-2xl">
                      {event.title}
                    </h2>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <span className="h-1 w-1 rounded-full bg-[#C9A84C]" />
                        {event.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-1 w-1 rounded-full bg-[#C9A84C]" />
                        {event.time}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-1 w-1 rounded-full bg-[#C9A84C]" />
                        {event.location}
                      </span>
                    </div>

                    <p className="text-sm leading-relaxed text-gray-400">
                      {event.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-4">
                      <span className="font-heading text-2xl font-bold text-[#C9A84C]">
                        {event.price}
                      </span>
                      {/* ✅ Redirige vers la page de réservation du concert */}
                      <Link
                        href={`/billetterie/${event.slug}/reserver`}
                        className="inline-flex h-10 items-center justify-center rounded-md bg-[#C9A84C] px-6 text-sm font-semibold text-black transition-all hover:bg-[#F0CB6A] hover:shadow-md hover:shadow-[#C9A84C]/30 active:scale-[0.97]"
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

        {/* CTA bas de page */}
        <section className="border-t border-white/10 bg-[#F3EFE6] px-6 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="font-heading text-3xl font-semibold text-white">
              Tu veux être informé des prochains événements ?
            </h2>
            <p className="mt-4 text-gray-400">
              Suis-nous sur nos réseaux pour ne rien manquer et recevoir les
              annonces en avant-première.
            </p>
          </motion.div>
        </section>
      </main>
    </>
  );
}
