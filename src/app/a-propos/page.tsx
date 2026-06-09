"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const timeline = [
  {
    year: "2020",
    title: "La naissance du mouvement",
    desc: "Worship Gift voit le jour d'une passion commune pour le gospel et l'adoration. Quelques musiciens se rassemblent pour partager leur amour de la musique gospel.",
  },
  {
    year: "2021",
    title: "Premier concert",
    desc: "Le premier concert gospel rassemble plus de 200 personnes. L'émotion est palpable, l'unité se construit autour de la musique.",
  },
  {
    year: "2023",
    title: "Expansion et rencontres",
    desc: "Le mouvement s'étend à plusieurs villes. Des sessions de formation et des soirées d'adoration voient le jour pour toucher davantage de cœurs.",
  },
  {
    year: "2025",
    title: "Lancement de la chaîne YouTube",
    desc: "Worship Gift investit le numérique pour partager le gospel au-delà des frontières, avec des lives et des vidéos accessibles à tous.",
  },
  {
    year: "2026",
    title: "Nouveaux horizons",
    desc: "Le mouvement continue de grandir avec des projets de concerts, de formations et de rencontres toujours plus ambitieux.",
  },
];

const valeurs = [
  {
    title: "Gospel",
    desc: "Au centre de tout ce que nous faisons. La musique comme offrande et rencontre avec Dieu. Chaque note est une prière, chaque chant une déclaration.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
  },
  {
    title: "Unité",
    desc: "Au-delà des différences, nous formons un seul corps pour une même adoration. Ensemble, nous sommes plus forts et notre gospel porte plus loin.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "Excellence",
    desc: "Offrir le meilleur de nous-mêmes pour la gloire de Dieu, avec professionnalisme et cœur. Dans la qualité musicale comme dans l'accueil de chacun.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

const equipe = [
  { nom: "Directeur", role: "Direction artistique", photo: "/img_worship-gift/img_directeur.jpeg" },
  { nom: "À venir", role: "Coordination" },
  { nom: "À venir", role: "Technique & production" },
];

export default function AProposPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        {/* Héro — fond noir avec image d'illustration */}
        <section className="relative border-b border-white/10 bg-black px-6 py-24 md:py-32 overflow-hidden">
          <Image
            src="/img_worship-gift/img_apropos.jpg"
            alt="À propos Worship Gift"
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
              À propos
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.9)]">
              Worship Gift est un mouvement gospel né d'une passion commune
              pour le gospel et l'adoration. Notre mission est de créer
              des espaces où la musique devient une rencontre avec Dieu.
            </p>
          </motion.div>
        </section>

        {/* Vision & Mission — fond blanc cassé */}
        <section className="bg-[#0D0D0D] px-6 py-16 md:py-20">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <motion.div
                initial={{ opacity: 0, x: -32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-[#C9A84C]/20 bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] shadow-lg shadow-[#C9A84C]/5"
              >
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, #C9A84C 1px, transparent 1px)", backgroundSize: "14px 14px" }} />
                <Image
                  src="/img_worship-gift/logo-worship-gift.png"
                  alt="Logo Worship Gift"
                  width={220}
                  height={220}
                  className="relative z-10 h-auto w-48 drop-shadow-[0_0_30px_rgba(201,168,76,0.15)] md:w-56"
                />
              </motion.div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className="space-y-10"
              >
                <motion.div variants={fadeUp}>
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#C9A84C]/40 bg-[#C9A84C]/15 text-[#C9A84C]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                  </span>
                  <h2 className="mt-4 font-heading text-3xl font-semibold text-white">
                    Notre vision
                  </h2>
                  <p className="mt-3 leading-relaxed text-gray-400">
                    Voir une génération transformée par la puissance du
                    gospel, où chaque voix trouve sa place dans l'unité du
                    corps de Christ. Nous croyons que le gospel est un langage
                    universel qui parle au cœur de l'homme.
                  </p>
                </motion.div>

                <motion.div variants={fadeUp}>
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#C9A84C]/40 bg-[#C9A84C]/15 text-[#C9A84C]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                  </span>
                  <h2 className="mt-4 font-heading text-3xl font-semibold text-white">
                    Notre mission
                  </h2>
                  <p className="mt-3 leading-relaxed text-gray-400">
                    Rassembler, former et équiper des adorateurs passionnés
                    pour impacter notre génération par la musique gospel. À
                    travers des événements, des formations et des rencontres,
                    nous semons l'espérance et la joie.
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Timeline — fond blanc cassé alterné */}
        <section className="bg-[#F3EFE6] px-6 py-16 md:py-20">
          <div className="mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="mb-14 text-center"
            >
              <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
                Notre histoire
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-gray-400">
                De la vision à la réalité, voici les étapes qui ont marqué
                le chemin de Worship Gift.
              </p>
            </motion.div>

            <div className="relative">
              <div className="absolute left-5 top-0 h-full w-px bg-[#C9A84C]/40 md:left-1/2 md:-translate-x-px" />

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className="space-y-12"
              >
                {timeline.map((item, i) => (
                  <motion.div
                    key={item.year}
                    variants={fadeUp}
                    className={`relative flex flex-col gap-3 md:flex-row md:items-start ${
                      i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    <div className="absolute left-5 top-1 z-10 flex h-2.5 w-2.5 -translate-x-1/2 items-center justify-center md:left-1/2">
                      <span className="h-full w-full rounded-full bg-[#C9A84C]" />
                    </div>

                    <div className={`hidden md:block md:w-1/2 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                      <span className="font-heading text-4xl font-bold text-[#C9A84C]/50">
                        {item.year}
                      </span>
                    </div>

                    <div className="ml-12 md:ml-0 md:w-1/2">
                      <span className="font-heading text-2xl font-bold text-[#C9A84C] md:hidden">
                        {item.year}
                      </span>
                      <h3 className="mt-1 font-heading text-lg font-semibold text-white">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-gray-400">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Valeurs — fond blanc cassé */}
        <section className="bg-[#0D0D0D] px-6 py-16 md:py-20">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="mb-12 text-center"
            >
              <h2 className="font-heading text-3xl font-bold text-[#C9A84C] md:text-4xl">
                Nos valeurs
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-gray-400">
                Trois piliers qui guident chaque note, chaque rencontre,
                chaque action du mouvement.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid gap-6 md:grid-cols-3"
            >
              {valeurs.map((v) => (
                <motion.div
                  key={v.title}
                  variants={fadeUp}
                  className="group rounded-lg border border-white/10 bg-white/5 p-6 shadow-sm transition-all hover:border-[#C9A84C]/40 hover:shadow-md active:scale-[0.98]"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#C9A84C]/30 bg-[#C9A84C]/10 text-[#C9A84C] transition-colors group-hover:bg-[#C9A84C]/20">
                    {v.icon}
                  </span>
                  <h3 className="mt-5 font-heading text-xl font-semibold text-white">
                    {v.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-400">
                    {v.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Équipe — fond blanc cassé alterné */}
        <section className="bg-[#F3EFE6] px-6 py-16 md:py-20">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="mb-12 text-center"
            >
              <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
                L'équipe
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-gray-400">
                Des cœurs passionnés, unis par la même vision : porter le
                gospel au plus haut niveau.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid gap-6 md:grid-cols-3"
            >
              {equipe.map((membre) => (
                <motion.div
                  key={membre.nom + membre.role}
                  variants={fadeUp}
                  className="flex flex-col items-center rounded-lg border border-white/10 bg-white/5 p-8 text-center shadow-sm"
                >
                  {"photo" in membre && membre.photo ? (
                    <div className="relative h-20 w-20 overflow-hidden rounded-full border border-[#C9A84C]/30 ring-1 ring-[#C9A84C]/20">
                      <Image
                        src={membre.photo}
                        alt={membre.nom}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 text-2xl font-bold text-[#C9A84C]/60">
                      ?
                    </div>
                  )}
                  <h3 className="mt-5 font-heading text-lg font-semibold text-white">
                    {membre.nom}
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">{membre.role}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA bas de page — fond blanc cassé */}
        <section className="border-t border-white/10 bg-[#0D0D0D] px-6 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="font-heading text-3xl font-semibold text-white">
              Tu veux faire partie du mouvement ?
            </h2>
            <p className="mt-4 text-gray-400">
              Rejoins-nous lors de nos prochains événements, abonne-toi à
              notre chaîne YouTube et suis-nous sur les réseaux pour vivre
              le gospel avec nous.
            </p>
          </motion.div>
        </section>
      </main>
    </>
  );
}