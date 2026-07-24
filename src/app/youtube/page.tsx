"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Eyebrow from "@/components/Eyebrow";
import PageHero from "@/components/PageHero";

// Dynamic import : la lightbox vidéo n'est chargée qu'au clic
const VideoLightbox = dynamic(() => import("@/components/VideoLightbox"), {
  ssr: false,
});
import {
  youtubeVideos,
  liveSessions,
  youtubeChannelUrl,
  facebookUrl,
  tiktokUrl,
  instagramUrl,
} from "@/lib/youtube-videos";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function MediasPage() {
  const [lightboxVideo, setLightboxVideo] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const openVideo = (id: string, title: string) =>
    setLightboxVideo({ id, title });
  const closeVideo = () => setLightboxVideo(null);

  return (
    <>
      <Navbar />
      {/* font-poppins : typographie du thème ePentatonic sur toute la page */}
      <main className="flex-1 pt-20 font-poppins bg-black">
        {/* Héro — fond noir avec image d'illustration */}
        <PageHero
          image="/img_worship-gift/img_media.jpg"
          alt="Médias Worship Gift"
          eyebrow="Médias · Worship Gift"
          title="Médias"
        >
          Plonge dans l'univers Gospel Worship Gift. Retrouve nos vidéos, nos
          sessions live et tous nos moments d'adoration en intégralité.
        </PageHero>

        {/* Bloc Chaîne YouTube */}
        <section className="bg-[#0A0A0A] px-6 py-20 md:py-28">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center rounded-xl border border-[#282828] bg-[#121212] p-8 text-center shadow-[0_12px_50px_rgba(0,0,0,0.4)] md:p-14"
            >
              {/* Icône YouTube */}
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#FF0000] shadow-lg shadow-[#FF0000]/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-white"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </div>
              <Eyebrow>Notre chaîne</Eyebrow>
              <h2 className="t-h2 text-white">
                Chaîne YouTube Worship Gift
              </h2>
              <p className="mx-auto mt-4 max-w-2xl t-body text-[#B0B0B0]">
                Abonne-toi pour ne rien manquer de nos prochaines
                publications : gospel en direct, répétitions, sessions
                d'adoration et contenus exclusifs.
              </p>
              <Link
                href={youtubeChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[#C9A84C] px-10 text-[13px] font-semibold uppercase tracking-[0.14em] text-black transition-all hover:bg-[#F0CB6A] hover:shadow-lg hover:shadow-[#C9A84C]/30 active:scale-[0.97]"
              >
                Voir la chaîne
              </Link>
            </motion.div>
          </div>
        </section>

        {/* CTA — Suivez-nous sur les réseaux */}
        <section className="bg-[#101010] px-6 py-20 md:py-28">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center rounded-xl border border-[#282828] bg-[#121212] p-8 text-center shadow-[0_12px_50px_rgba(0,0,0,0.4)] md:p-14"
            >
              <Eyebrow>Restons connectés</Eyebrow>
              <h2 className="t-h2 text-white">
                Abonnez-vous pour ne rien manquer
              </h2>
              <p className="mx-auto mt-4 max-w-2xl t-body text-[#B0B0B0]">
                Rejoignez notre communauté sur les réseaux sociaux pour vivre
                chaque moment de gospel et d'adoration avec Worship Gift.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a
                  href={youtubeChannelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#C9A84C] px-8 text-[13px] font-semibold uppercase tracking-[0.12em] text-black transition-all hover:bg-[#F0CB6A] hover:shadow-lg hover:shadow-[#C9A84C]/30 active:scale-[0.97]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  S'abonner sur YouTube
                </a>
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#C9A84C] px-8 text-[13px] font-semibold uppercase tracking-[0.12em] text-black transition-all hover:bg-[#F0CB6A] hover:shadow-lg hover:shadow-[#C9A84C]/30 active:scale-[0.97]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                  Facebook
                </a>
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#C9A84C] px-8 text-[13px] font-semibold uppercase tracking-[0.12em] text-black transition-all hover:bg-[#F0CB6A] hover:shadow-lg hover:shadow-[#C9A84C]/30 active:scale-[0.97]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                  TikTok
                </a>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#C9A84C] px-8 text-[13px] font-semibold uppercase tracking-[0.12em] text-black transition-all hover:bg-[#F0CB6A] hover:shadow-lg hover:shadow-[#C9A84C]/30 active:scale-[0.97]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg>
                  Instagram
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Live sessions */}
        <section className="bg-[#0A0A0A] px-6 py-20 md:py-28">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="flex flex-col"
            >
              <Eyebrow>En direct</Eyebrow>
              <h2 className="t-h2 text-white">
                Live sessions
              </h2>
              <p className="mt-3 max-w-2xl t-body text-[#B0B0B0]">
                Chaque rencontre est un moment unique de gospel et
                d'adoration. Revis ou découvre les temps forts de nos
                rassemblements en direct. Toute la puissance du gospel, en
                live ou en replay.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="mt-10 grid gap-6 md:grid-cols-2"
            >
              {liveSessions.map((video) => (
                <motion.div
                  key={video.id + video.title}
                  variants={cardVariants}
                  onClick={() => openVideo(video.id, video.title)}
                  className="group cursor-pointer overflow-hidden rounded-xl border border-[#282828] bg-[#121212] transition-all hover:border-[#C9A84C]/50 hover:shadow-[0_12px_50px_rgba(0,0,0,0.5)] active:scale-[0.98]"
                >
                  <div className="relative aspect-video">
                    <Image
                      src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                      alt={video.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/35">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#C9A84C]/90 text-black shadow-lg transition-transform group-hover:scale-110">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="t-card-title text-white transition-colors group-hover:text-[#C9A84C]">
                      {video.title}
                    </h3>
                    <p className="mt-2 t-meta text-[#9A9A9A]">
                      {video.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Vidéothèque */}
        <section className="bg-[#101010] px-6 py-20 md:py-28">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="flex flex-col"
            >
              <Eyebrow>Toutes nos vidéos</Eyebrow>
              <h2 className="t-h2 text-white">
                Vidéothèque Worship Gift
              </h2>
              <p className="mt-3 t-body text-[#B0B0B0]">
                Explore tous nos contenus : enseignements, répétitions,
                extraits d'événements et bien plus.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="mt-10 grid gap-6 md:grid-cols-2"
            >
              {youtubeVideos.map((video) => (
                <motion.div
                  key={video.id + video.title}
                  variants={cardVariants}
                  onClick={() => openVideo(video.id, video.title)}
                  className="group cursor-pointer overflow-hidden rounded-xl border border-[#282828] bg-[#121212] transition-all hover:border-[#C9A84C]/50 hover:shadow-[0_12px_50px_rgba(0,0,0,0.5)] active:scale-[0.98]"
                >
                  <div className="relative aspect-video">
                    <Image
                      src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                      alt={video.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/35">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#C9A84C]/90 text-black shadow-lg transition-transform group-hover:scale-110">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="t-card-title text-white transition-colors group-hover:text-[#C9A84C]">
                      {video.title}
                    </h3>
                    <p className="mt-2 t-meta text-[#9A9A9A]">
                      {video.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      {/* Lightbox vidéo */}
      {lightboxVideo && (
        <VideoLightbox
          videoId={lightboxVideo.id}
          title={lightboxVideo.title}
          onClose={closeVideo}
        />
      )}
    </>
  );
}
