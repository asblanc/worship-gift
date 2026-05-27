"use client";

import { motion } from "framer-motion";
import Image from "next/image";
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

export default function BilletteriePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        {/* Héro — fond noir */}
        <section className="relative border-b border-white/10 bg-black px-6 py-24 md:py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-[#C9A84C]/5 to-transparent" />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 mx-auto max-w-4xl text-center"
          >
            <h1 className="font-heading text-5xl font-bold text-[#C9A84C] md:text-6xl">
              Billetterie
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-300">
              Réserve ta place pour vivre un moment unique de louange et
              d'adoration au cœur du mouvement Worship Gift. Chaque
              rencontre est une invitation à la communion et à la joie.
            </p>
          </motion.div>
        </section>

        {/* Liste des événements — fond blanc cassé */}
        <section className="bg-[#F9F5EC] px-6 py-16 md:py-20">
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
                  key={event.title}
                  variants={cardVariants}
                  className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:border-[#C9A84C]/40 hover:shadow-md md:flex-row"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden md:aspect-auto md:w-72">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 288px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r" />
                  </div>

                  {/* Contenu */}
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <h2 className="font-heading text-xl font-semibold text-gray-900 md:text-2xl">
                      {event.title}
                    </h2>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
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

                    <p className="text-sm leading-relaxed text-gray-600">
                      {event.description}
                    </p>

                    {/* Prix + bouton */}
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <span className="font-heading text-2xl font-bold text-[#C9A84C]">
                        {event.price}
                      </span>
                      <a
                        href={event.ticketLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-10 items-center justify-center rounded-md bg-[#C9A84C] px-6 text-sm font-semibold text-black transition-all hover:bg-[#F0CB6A] hover:shadow-md hover:shadow-[#C9A84C]/30 active:scale-[0.97]"
                      >
                        Réserver
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA bas de page — fond légèrement différent */}
        <section className="border-t border-gray-200 bg-[#F3EFE6] px-6 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="font-heading text-3xl font-semibold text-gray-900">
              Tu veux être informé des prochains événements ?
            </h2>
            <p className="mt-4 text-gray-600">
              Suis-nous sur nos réseaux pour ne rien manquer et recevoir les
              annonces en avant-première.
            </p>
          </motion.div>
        </section>
      </main>
    </>
  );
}