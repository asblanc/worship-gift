"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Eyebrow from "@/components/Eyebrow";
import PageHero from "@/components/PageHero";

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
      {/* font-poppins : typographie du thème ePentatonic sur toute la page */}
      <main className="flex-1 pt-20 font-poppins bg-black">
        {/* Héro — fond noir avec image d'illustration */}
        <PageHero
          image="/img_worship-gift/worship-golden.jpg"
          alt="Foule en adoration lors d'un concert gospel Worship Gift"
          eyebrow="Qui sommes-nous"
          title="À propos"
        >
          Worship Gift est un mouvement gospel né d'une passion commune pour le
          gospel et l'adoration. Notre mission est de créer des espaces où la
          musique devient une rencontre avec Dieu.
        </PageHero>

        {/* Vision & Mission */}
        <section className="bg-[#0A0A0A] px-6 py-20 md:py-28">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <motion.div
                initial={{ opacity: 0, x: -32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-[#282828] bg-gradient-to-br from-[#0A0A0A] to-[#161616] shadow-[0_12px_50px_rgba(0,0,0,0.4)]"
              >
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, #C9A84C 1px, transparent 1px)", backgroundSize: "14px 14px" }} />
                <Image
                  src="/img_worship-gift/logo-circle.png"
                  alt="Logo Worship Gift"
                  width={600}
                  height={600}
                  className="relative z-10 h-auto w-[72%] max-w-[320px] drop-shadow-[0_0_40px_rgba(201,168,76,0.25)]"
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
                  <h2 className="mt-4 t-h3 text-white">
                    Notre vision
                  </h2>
                  <p className="mt-3 t-body text-[#B0B0B0]">
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
                  <h2 className="mt-4 t-h3 text-white">
                    Notre mission
                  </h2>
                  <p className="mt-3 t-body text-[#B0B0B0]">
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

        {/* Notre histoire — mise en page éditoriale « chapitres » */}
        <section className="bg-[#101010] px-6 py-20 md:py-28">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="mb-16 flex flex-col"
            >
              <Eyebrow>Depuis 2020</Eyebrow>
              <h2 className="t-h2 text-white">
                Notre histoire
              </h2>
              <p className="mt-4 max-w-xl t-body text-[#B0B0B0]">
                De la vision à la réalité, voici les chapitres qui ont marqué
                le chemin de Worship Gift.
              </p>
            </motion.div>

            {/* Rail vertical à gauche + chapitres */}
            <div className="relative">
              <div className="absolute bottom-2 left-[11px] top-2 w-px bg-gradient-to-b from-[#C9A84C] via-[#C9A84C]/40 to-transparent md:left-[15px]" />

              <motion.ol
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className="space-y-6"
              >
                {timeline.map((item, i) => (
                  <motion.li
                    key={item.year}
                    variants={fadeUp}
                    className="relative pl-12 md:pl-20"
                  >
                    {/* Nœud sur le rail */}
                    <span className="absolute left-0 top-6 flex h-6 w-6 items-center justify-center md:h-8 md:w-8">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-[#C9A84C]/20" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#C9A84C] ring-4 ring-[#101010]" />
                    </span>

                    {/* Carte chapitre */}
                    <div className="group relative overflow-hidden rounded-xl border border-[#282828] bg-[#121212] p-6 transition-all duration-300 hover:border-[#C9A84C]/50 hover:shadow-[0_12px_50px_rgba(0,0,0,0.5)] md:p-8">
                      {/* Millésime géant en filigrane */}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute -right-2 -top-6 select-none font-poppins text-[6rem] font-black leading-none text-white/[0.04] transition-colors duration-300 group-hover:text-[#C9A84C]/[0.07] md:text-[8rem]"
                      >
                        {item.year}
                      </span>

                      <div className="relative">
                        <div className="flex items-center gap-3">
                          <span className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#C9A84C]">
                            Chapitre {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="h-px flex-1 bg-[#282828]" />
                          <span className="font-poppins text-sm font-bold text-[#C9A84C]">
                            {item.year}
                          </span>
                        </div>
                        <h3 className="mt-4 t-h3 text-white">
                          {item.title}
                        </h3>
                        <p className="mt-3 max-w-2xl t-body text-[#B0B0B0]">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </motion.ol>
            </div>
          </div>
        </section>

        {/* Valeurs */}
        <section className="bg-[#0A0A0A] px-6 py-20 md:py-28">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="mb-14 flex flex-col items-center text-center"
            >
              <Eyebrow centered>Ce qui nous porte</Eyebrow>
              <h2 className="t-h2 text-white">
                Nos valeurs
              </h2>
              <p className="mx-auto mt-4 max-w-xl t-body text-[#B0B0B0]">
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
                  className="group rounded-xl border border-[#282828] bg-[#121212] p-7 transition-all duration-300 hover:border-[#C9A84C]/50 hover:shadow-[0_12px_50px_rgba(0,0,0,0.4)] active:scale-[0.98]"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#C9A84C]/30 bg-[#C9A84C]/10 text-[#C9A84C] transition-colors group-hover:bg-[#C9A84C]/20">
                    {v.icon}
                  </span>
                  <h3 className="mt-5 t-h3 text-white">
                    {v.title}
                  </h3>
                  <p className="mt-3 t-meta text-[#9A9A9A]">
                    {v.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Équipe */}
        <section className="bg-[#101010] px-6 py-20 md:py-28">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="mb-14 flex flex-col items-center text-center"
            >
              <Eyebrow centered>Les visages</Eyebrow>
              <h2 className="t-h2 text-white">
                L'équipe
              </h2>
              <p className="mx-auto mt-4 max-w-xl t-body text-[#B0B0B0]">
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
                  className="group flex flex-col items-center rounded-xl border border-[#282828] bg-[#121212] p-8 text-center transition-all duration-300 hover:border-[#C9A84C]/50 hover:shadow-[0_12px_50px_rgba(0,0,0,0.4)]"
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
                  <h3 className="mt-5 t-card-title text-white">
                    {membre.nom}
                  </h3>
                  <p className="mt-1 t-meta text-[#9A9A9A]">{membre.role}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA bas de page */}
        <section className="border-t border-[#282828] bg-[#0A0A0A] px-6 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="mx-auto flex max-w-2xl flex-col items-center text-center"
          >
            <Eyebrow centered>Rejoins l'aventure</Eyebrow>
            <h2 className="t-h2 text-white">
              Tu veux faire partie du mouvement ?
            </h2>
            <p className="mt-4 t-body text-[#B0B0B0]">
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
