"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Eyebrow from "@/components/Eyebrow";
import PageHero from "@/components/PageHero";
import {
  youtubeChannelUrl,
  facebookUrl,
  tiktokUrl,
  instagramUrl,
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Une erreur est survenue. Réessaie.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Erreur réseau. Vérifie ta connexion et réessaie.");
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        {/* Héro — fond noir avec image d'illustration */}
        <PageHero
          image="/img_worship-gift/img_contact.jpg"
          alt="Contact Worship Gift"
          eyebrow="Contact"
          title="Contact"
        >
          Tu souhaites nous contacter, rejoindre le mouvement ou simplement en
          savoir plus ? Écris-nous, nous serons ravis de t'accueillir.
        </PageHero>

        {/* Contenu — fond sombre */}
        <section className="bg-[#0D0D0D] px-6 py-12 sm:py-16 md:py-20">
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
                  <h2 className="t-h2 text-white">
                    Nous contacter
                  </h2>
                  <p className="mt-4 t-body text-gray-300">
                    N'hésite pas à nous joindre directement par téléphone ou à
                    nous suivre sur nos réseaux sociaux pour rester connecté à
                    la communauté.
                  </p>
                </motion.div>

                <div className="space-y-4">
                  <motion.div
                    variants={fadeUp}
                    className="rounded-lg border border-white/10 bg-white/[0.08] p-6 transition-all hover:border-[#C9A84C]/40 hover:bg-white/[0.07]"
                  >
                    <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      Email
                    </h3>
                    <a
                      href={`mailto:${emailAddress}`}
                      className="mt-2 block text-lg font-medium text-white transition-colors hover:text-[#C9A84C]"
                    >
                      {emailAddress}
                    </a>
                  </motion.div>

                  <motion.div
                    variants={fadeUp}
                    className="rounded-lg border border-white/10 bg-white/[0.08] p-6 transition-all hover:border-[#C9A84C]/40 hover:bg-white/[0.07]"
                  >
                    <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      Téléphone
                    </h3>
                    <a
                      href={`tel:${phoneNumber.replace(/\s/g, "")}`}
                      className="mt-2 block text-xl font-medium text-white transition-colors hover:text-[#C9A84C]"
                    >
                      {phoneNumber}
                    </a>
                  </motion.div>

                  <motion.div
                    variants={fadeUp}
                    className="rounded-lg border border-white/10 bg-white/[0.08] p-6 transition-all hover:border-[#C9A84C]/40 hover:bg-white/[0.07]"
                  >
                    <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      Retrouvez-nous
                    </h3>
                    <div className="mt-3 flex flex-col gap-3">
                      <a
                        href={youtubeChannelUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-300 transition-colors hover:text-[#C9A84C]"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-[#C9A84C] shrink-0"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                        Chaîne YouTube
                      </a>
                      <a
                        href={facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-300 transition-colors hover:text-[#C9A84C]"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-[#C9A84C] shrink-0"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                        Facebook
                      </a>
                      <a
                        href={tiktokUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-300 transition-colors hover:text-[#C9A84C]"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-[#C9A84C] shrink-0"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                        TikTok
                      </a>
                      <a
                        href={instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-300 transition-colors hover:text-[#C9A84C]"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-[#C9A84C] shrink-0"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg>
                        Instagram
                      </a>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Formulaire */}
              <motion.div variants={fadeUp}>
                <h2 className="t-h2 text-white">
                  Envoie-nous un message
                </h2>
                {status === "success" ? (
                  <div className="mt-8 rounded-lg border border-green-500/30 bg-green-500/10 p-6 text-center">
                    <p className="font-heading text-lg font-semibold text-green-400">
                      Message envoyé ✓
                    </p>
                    <p className="mt-2 text-sm text-gray-300">
                      Merci ! Nous te répondrons rapidement à l&rsquo;adresse fournie.
                    </p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="mt-4 text-sm text-[#C9A84C] hover:underline"
                    >
                      Envoyer un autre message
                    </button>
                  </div>
                ) : (
                  <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor="nom"
                          className="block text-sm font-medium text-gray-300"
                        >
                          Nom complet
                        </label>
                        <input
                          type="text"
                          id="nom"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ton nom"
                          className="mt-2 block w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none ring-0 transition-colors focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/30"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-300"
                        >
                          Adresse email
                        </label>
                        <input
                          type="email"
                          id="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="ton@email.com"
                          className="mt-2 block w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none ring-0 transition-colors focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/30"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-300"
                      >
                        Votre message
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Écris ton message ici..."
                        className="mt-2 block w-full resize-none rounded-md border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none ring-0 transition-colors focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/30"
                      />
                    </div>

                    {status === "error" && (
                      <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-400">
                        {errorMsg}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className={`inline-flex h-12 items-center justify-center gap-2 rounded-md px-8 text-sm font-medium transition-all ${
                        status === "loading"
                          ? "cursor-not-allowed bg-gray-700 text-gray-300"
                          : "bg-[#C9A84C] text-black hover:bg-[#F0CB6A] hover:shadow-lg hover:shadow-[#C9A84C]/30 active:scale-[0.97]"
                      }`}
                    >
                      {status === "loading" ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/40 border-t-transparent" />
                          Envoi…
                        </>
                      ) : (
                        "Envoyer le message"
                      )}
                    </button>
                  </form>
                )}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Infos pratiques */}
        <section className="border-t border-white/5 bg-black px-6 py-16 md:py-24">
          <div className="mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="mb-12 flex flex-col items-center text-center"
            >
              <Eyebrow centered>Avant de nous écrire</Eyebrow>
              <h2 className="t-h2 text-white">Infos pratiques</h2>
              <p className="mx-auto mt-4 max-w-xl t-body text-gray-300">
                Quelques repères pour bien préparer votre venue ou votre prise
                de contact avec l&rsquo;équipe Worship Gift.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid gap-6 md:grid-cols-3"
            >
              {/* Temps de réponse */}
              <motion.div
                variants={fadeUp}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-7 transition-all hover:border-[#C9A84C]/40"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#C9A84C]/30 bg-[#C9A84C]/10 text-[#C9A84C]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </span>
                <h3 className="mt-5 t-card-title text-white">Temps de réponse</h3>
                <p className="mt-2 t-meta text-gray-300">
                  Nous répondons généralement sous 24 à 48 h. Pour une demande
                  urgente le jour d&rsquo;un concert, privilégiez WhatsApp
                  (bouton en bas à droite de l&rsquo;écran).
                </p>
              </motion.div>

              {/* Concerts & événements */}
              <motion.div
                variants={fadeUp}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-7 transition-all hover:border-[#C9A84C]/40"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#C9A84C]/30 bg-[#C9A84C]/10 text-[#C9A84C]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </span>
                <h3 className="mt-5 t-card-title text-white">Concerts &amp; billets</h3>
                <p className="mt-2 t-meta text-gray-300">
                  Pour toute question sur un billet, un remboursement ou
                  l&rsquo;accès à un événement, consultez d&rsquo;abord la
                  billetterie&nbsp;: la plupart des réponses s&rsquo;y trouvent.
                </p>
                <a
                  href="/billetterie"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#C9A84C] transition-colors hover:text-[#F0CB6A]"
                >
                  Voir la billetterie
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </a>
              </motion.div>

              {/* Rejoindre / bénévolat */}
              <motion.div
                variants={fadeUp}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-7 transition-all hover:border-[#C9A84C]/40"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#C9A84C]/30 bg-[#C9A84C]/10 text-[#C9A84C]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </span>
                <h3 className="mt-5 t-card-title text-white">Rejoindre l&rsquo;équipe</h3>
                <p className="mt-2 t-meta text-gray-300">
                  Musicien, choriste, bénévole accueil, technique ou média&nbsp;?
                  Écrivez-nous via le formulaire en précisant «&nbsp;Bénévolat&nbsp;»
                  et vos disponibilités. Chaque talent a sa place.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}