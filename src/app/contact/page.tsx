"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import {
  youtubeChannelUrl,
  facebookUrl,
  tiktokUrl,
  emailAddress,
  phoneNumber,
} from "@/lib/youtube-videos";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        {/* Héro — fond noir avec image d'illustration */}
        <section className="relative border-b border-white/10 bg-black px-6 py-24 md:py-32 overflow-hidden">
          <Image
            src="/img_worship-gift/img_contact.jpg"
            alt="Contact Worship Gift"
            fill
            className="object-cover opacity-40"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 mx-auto max-w-4xl text-center"
          >
            <h1 className="font-heading text-5xl font-bold text-[#C9A84C] md:text-6xl">
              Contact
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-300">
              Tu souhaites nous contacter, rejoindre le mouvement ou simplement
              en savoir plus ? Écris-nous, nous serons ravis de t'accueillir.
            </p>
          </motion.div>
        </section>

        {/* Contenu — fond blanc cassé */}
        <section className="bg-[#F9F5EC] px-6 py-16 md:py-20">
          <div className="mx-auto max-w-5xl">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid gap-12 md:grid-cols-2"
            >
              {/* Infos de contact */}
              <div className="space-y-8">
                <motion.div variants={fadeUp}>
                  <h2 className="font-heading text-3xl font-semibold text-gray-900">
                    Nous contacter
                  </h2>
                  <p className="mt-4 leading-relaxed text-gray-600">
                    N'hésite pas à nous joindre directement par téléphone ou à
                    nous suivre sur nos réseaux sociaux pour rester connecté à
                    la louange.
                  </p>
                </motion.div>

                <div className="space-y-4">
                  <motion.div
                    variants={fadeUp}
                    className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-[#C9A84C]/40 hover:shadow-md"
                  >
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      Email
                    </h3>
                    <a
                      href={`mailto:${emailAddress}`}
                      className="mt-2 block text-lg font-medium text-gray-900 transition-colors hover:text-[#C9A84C]"
                    >
                      {emailAddress}
                    </a>
                  </motion.div>

                  <motion.div
                    variants={fadeUp}
                    className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-[#C9A84C]/40 hover:shadow-md"
                  >
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      Téléphone
                    </h3>
                    <a
                      href={`tel:${phoneNumber.replace(/\s/g, "")}`}
                      className="mt-2 block text-xl font-medium text-gray-900 transition-colors hover:text-[#C9A84C]"
                    >
                      {phoneNumber}
                    </a>
                  </motion.div>

                  <motion.div
                    variants={fadeUp}
                    className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-[#C9A84C]/40 hover:shadow-md"
                  >
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      Retrouvez-nous
                    </h3>
                    <div className="mt-3 flex flex-col gap-3">
                      <a
                        href={youtubeChannelUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-700 transition-colors hover:text-[#C9A84C]"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-[#C9A84C] shrink-0"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                        Chaîne YouTube
                      </a>
                      <a
                        href={facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-700 transition-colors hover:text-[#C9A84C]"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-[#C9A84C] shrink-0"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                        Facebook
                      </a>
                      <a
                        href={tiktokUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-700 transition-colors hover:text-[#C9A84C]"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-[#C9A84C] shrink-0"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                        TikTok
                      </a>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Formulaire */}
              <motion.div variants={fadeUp}>
                <h2 className="font-heading text-3xl font-semibold text-gray-900">
                  Envoie-nous un message
                </h2>
                <form className="mt-8 space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="nom"
                        className="block text-sm font-medium text-gray-600"
                      >
                        Nom complet
                      </label>
                      <input
                        type="text"
                        id="nom"
                        placeholder="Ton nom"
                        className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none ring-0 transition-colors focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/30"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-600"
                      >
                        Adresse email
                      </label>
                      <input
                        type="email"
                        id="email"
                        placeholder="ton@email.com"
                        className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none ring-0 transition-colors focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/30"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-600"
                    >
                      Votre message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="Écris ton message ici..."
                      className="mt-2 block w-full resize-none rounded-md border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none ring-0 transition-colors focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/30"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex h-12 items-center justify-center rounded-md bg-[#C9A84C] px-8 text-sm font-medium text-black transition-all hover:bg-[#F0CB6A] hover:shadow-lg hover:shadow-[#C9A84C]/30 active:scale-[0.97]"
                  >
                    Envoyer le message
                  </button>
                </form>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}