import Navbar from "@/components/Navbar";

const images = Array.from({ length: 12 }, (_, i) => ({
  src: `/img_worship-gift/img_${i + 1}.jpg`,
  alt: `Galerie Worship Gift ${i + 1}`,
}));

export default function GaleriePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        <section className="border-b border-white/10 px-6 py-20 md:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-heading text-5xl font-bold text-[#C9A84C] md:text-6xl">
              Galerie
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-300">
              Revivez les meilleurs moments de nos rencontres à travers notre
              galerie d'images. Louange, adoration, communion&hellip;
              chaque photo raconte une histoire.
            </p>
          </div>
        </section>

        <section className="px-6 py-16 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
              {images.map((img) => (
                <div
                  key={img.src}
                  className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10 bg-zinc-900"
                >
                  {/* Version simplifiée sans Next/Image pour éviter les problèmes de fichiers manquants */}
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-950 p-4 text-center">
                    <span className="text-sm text-gray-500">
                      Photo {img.src.split("_")[1].split(".")[0]}
                    </span>
                  </div>
                  {/* Overlay au survol */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="font-heading text-sm text-[#C9A84C]">
                      Agrandir
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}