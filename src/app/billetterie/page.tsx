"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import TicketTiers from "@/components/TicketTiers";
import PaymentMethods from "@/components/PaymentMethods";
import { upcomingEvents } from "@/lib/events-config";
import { billetteriesWidget as ticketing } from "@/lib/ticketing-config";

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
        <PageHero
          image="/img_worship-gift/img_billeterie-crop.jpg"
          alt="Billetterie Worship Gift"
          eyebrow="Billetterie"
          title="Billetterie"
        >
          Réserve ta place pour vivre un moment unique de Gospel au cœur du
          mouvement Worship Gift. Chaque rencontre est une invitation à la
          communion et à la joie.
        </PageHero>

        {/* Événements — fond blanc cassé */}
        <section className="bg-[#0D0D0D] px-6 py-12 sm:py-16 md:py-20">
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
                  className="group flex flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[0.08] shadow-sm transition-all hover:border-[#C9A84C]/40 hover:shadow-md md:flex-row"
                >
                  {/* Affiche réelle */}
                  <EventPosterVertical event={event} />

                  {/* Contenu */}
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <h2 className="t-h3 text-white">
                      {event.title}
                    </h2>
                    {event.artist && (
                      <p className="-mt-1 text-sm font-medium text-[#C9A84C]">🎤 {event.artist}</p>
                    )}

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-300">
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

                    <p className="t-meta text-gray-300">
                      {event.description}
                    </p>

                    <div className="mt-auto flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <span className="font-heading text-2xl font-bold text-[#C9A84C]">
                        {event.price}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {/* Paiement en ligne — billetterie du prestataire (pleine page) */}
                        <a
                          href={ticketing.directUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-10 items-center justify-center rounded-md bg-[#C4161C] px-5 text-sm font-semibold text-white transition-all hover:bg-[#e0272d] hover:shadow-md hover:shadow-[#C4161C]/30 active:scale-[0.97]"
                        >
                          Payer en ligne
                        </a>
                        {/* Paiement à la livraison — flux interne (billet + QR) */}
                        <Link
                          href={`/billetterie/${event.slug}/reserver`}
                          className="inline-flex h-10 items-center justify-center rounded-md border border-white/15 px-5 text-sm font-semibold text-gray-200 transition-all hover:border-[#C9A84C]/50 hover:text-[#C9A84C] active:scale-[0.97]"
                        >
                          À la livraison
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Catégories de billets */}
        <TicketTiers />

        {/* 3 moyens de paiement */}
        <PaymentMethods />

        {/* CTA bas de page */}
        <section className="border-t border-white/10 bg-[#0D0D0D] px-6 py-12 sm:py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="t-h2 text-white">
              Tu veux être informé des prochains événements ?
            </h2>
            <p className="mt-4 t-body text-gray-300">
              Suis-nous sur nos réseaux pour ne rien manquer et recevoir les
              annonces en avant-première.
            </p>
          </motion.div>
        </section>
      </main>
    </>
  );
}
