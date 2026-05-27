"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import VideoLightbox from "@/components/VideoLightbox";
import {
  youtubeVideos,
  liveSessions,
  youtubeChannelUrl,
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

export default function YouTubePage() {
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
      <main className="flex-1 pt-20">
        {/* Héro */}
        <section className="border-b border-white/10 px-6 py-20 md:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-heading text-5xl font-bold text-[#C9A84C] md:text-6xl">
              YouTube
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-300">
              Plonge dans l'univers de la louange Worship Gift. Retrouve
              nos sessions live, nos vidéos et tous nos moments
              d'adoration en intégralité.
            </p>
          </div>
        </section>

        {/* Bloc Chaîne YouTube */}
        <section className="px-6 py-16 md:py-20">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-lg border border-[#C9A84C]/20 bg-gradient-to-br from-[#C9A84C]/10 to-black/50 p-8 text-center md:p-12">
              <h2 className="font-heading text-3xl font-semibold text-white">
                Chaîne YouTube Worship Gift
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-gray-400">
                Abonne-toi pour ne rien manquer de nos prochaines
                publications : louanges en direct, répétitions, sessions
                d'adoration et contenus exclusifs.
              </p>
              <Link
                href={youtubeChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex h-12 items-center justify-center rounded-md bg-[#C9A84C] px-10 text-sm font-semibold text-black transition-all hover:bg-[#F0CB6A] hover:shadow-lg hover:shadow-[#C9A84C]/30"
              >
                Voir la chaîne
              </Link>
            </div>
          </div>
        </section>

        {/* Live sessions */}
        <section className="bg-white/[0.02] px-6 py-16 md:py-20">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-heading text-3xl font-semibold text-white">
                Live sessions
              </h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-gray-400">
                Chaque rencontre est un moment unique de louange et
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
              className="mt-8 grid gap-6 md:grid-cols-2"
            >
              {liveSessions.map((video) => (
                <motion.div
                  key={video.id + video.title}
                  variants={cardVariants}
                  onClick={() => openVideo(video.id, video.title)}
                  className="group cursor-pointer overflow-hidden rounded-lg border border-white/10 bg-black transition-all hover:border-[#C9A84C]/30 hover:shadow-lg hover:shadow-[#C9A84C]/5"
                >
                  <div className="relative aspect-video">
                    <img
                      src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                      alt={video.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/40">
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
                  <div className="p-4">
                    <h3 className="font-heading text-base font-semibold text-white">
                      {video.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {video.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Vidéothèque */}
        <section className="px-6 py-16 md:py-20">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-heading text-3xl font-semibold text-white">
                Vidéothèque
              </h2>
              <p className="mt-3 leading-relaxed text-gray-400">
                Explore tous nos contenus : enseignements, répétitions,
                extraits d'événements et bien plus.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="mt-8 grid gap-6 md:grid-cols-2"
            >
              {youtubeVideos.map((video) => (
                <motion.div
                  key={video.id + video.title}
                  variants={cardVariants}
                  onClick={() => openVideo(video.id, video.title)}
                  className="group cursor-pointer overflow-hidden rounded-lg border border-white/10 bg-black transition-all hover:border-[#C9A84C]/30 hover:shadow-lg hover:shadow-[#C9A84C]/5"
                >
                  <div className="relative aspect-video">
                    <img
                      src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                      alt={video.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/40">
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
                  <div className="p-4">
                    <h3 className="font-heading text-base font-semibold text-white">
                      {video.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
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