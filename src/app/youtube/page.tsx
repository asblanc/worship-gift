import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function YouTubePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        <section className="border-b border-white/10 px-6 py-20 md:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-heading text-5xl font-bold text-[#C9A84C] md:text-6xl">
              YouTube
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-300">
              Plongez dans notre univers musical. Retrouvez nos lives, nos
              sessions de louange et nos vidéos exclusives sur nos chaînes
              YouTube.
            </p>
          </div>
        </section>

        {/* Live sessions */}
        <section className="px-6 py-16 md:py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-heading text-3xl font-semibold text-white">
              Live sessions
            </h2>
            <p className="mt-3 text-gray-400">
              Nos derniers moments de louange en direct, capturés pour vivre
              l'expérience Worship Gift où que tu sois.
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex aspect-video items-center justify-center rounded-lg border border-white/10 bg-zinc-900"
                >
                  <p className="text-sm text-gray-500">
                    Vidéo live {i} — à venir
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Vidéothèque */}
        <section className="bg-white/[0.02] px-6 py-16 md:py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-heading text-3xl font-semibold text-white">
              Vidéothèque
            </h2>
            <p className="mt-3 text-gray-400">
              Explorez nos contenus : enseignements, répétitions, extraits
              d'événements et bien plus.
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex aspect-video items-center justify-center rounded-lg border border-white/10 bg-zinc-900"
                >
                  <p className="text-sm text-gray-500">
                    Vidéo {i} — à venir
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Liens YouTube */}
        <section className="px-6 py-16 md:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-heading text-3xl font-semibold text-white">
              Abonne-toi à nos chaînes
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="https://youtube.com/@worshipgift1"
                target="_blank"
                className="inline-flex h-12 items-center justify-center rounded-md bg-[#C9A84C] px-8 text-sm font-medium text-black transition-colors hover:bg-[#F0CB6A]"
              >
                Chaîne Worship Gift 1
              </Link>
              <Link
                href="https://youtube.com/@worshipgift2"
                target="_blank"
                className="inline-flex h-12 items-center justify-center rounded-md border border-white/20 px-8 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                Chaîne Worship Gift 2
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}