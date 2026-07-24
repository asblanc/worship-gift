"use client";

/* ================================================================
   Worship Gift — PanoramicStrip
   Bandes photo panoramiques qui défilent en continu (motion design
   cinématographique), en deux sens opposés. Survol = pause + focus
   sur la photo. Clic = ouverture plein écran (lightbox).
   Défilement en CSS (GPU) -> fluide sur mobile ; respecte
   prefers-reduced-motion.
   ================================================================ */

export type StripImage = { src: string; alt: string };

type Item = { img: StripImage; index: number };

function Row({
  items,
  direction,
  duration,
  onOpen,
}: {
  items: Item[];
  direction: "left" | "right";
  duration: number;
  onOpen: (index: number) => void;
}) {
  // Dupliqué deux fois -> boucle sans couture à -50% / +50%
  const loop = [...items, ...items];

  return (
    <div className="wg-pan-group group/row relative overflow-hidden">
      <div
        className={`wg-pan flex gap-2 sm:gap-3 ${
          direction === "left" ? "wg-pan-left" : "wg-pan-right"
        }`}
        style={{ ["--wg-pan-dur" as string]: `${duration}s` }}
      >
        {loop.map((it, i) => (
          <button
            key={`${it.img.src}-${i}`}
            type="button"
            onClick={() => onOpen(it.index)}
            aria-label={`Agrandir : ${it.img.alt}`}
            className="group/ph relative h-40 shrink-0 overflow-hidden rounded-xl bg-[#141414] outline-none transition-[transform,filter] duration-500 ease-out focus-visible:ring-2 focus-visible:ring-[#C9A84C] sm:h-52 md:h-64 md:group-hover/row:opacity-60 md:hover:!opacity-100 md:hover:z-10 md:hover:scale-[1.03]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={it.img.src}
              alt={it.img.alt}
              className="block h-full w-auto max-w-none object-cover transition-transform duration-700 ease-out group-hover/ph:scale-105"
              loading="lazy"
              decoding="async"
              draggable={false}
            />
            {/* Cadre doré + voile au survol */}
            <span className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 ring-1 ring-inset ring-transparent transition-all duration-300 group-hover/ph:opacity-100 group-hover/ph:ring-2 group-hover/ph:ring-[#C9A84C]/70" />
            {/* Loupe */}
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="flex h-10 w-10 scale-50 items-center justify-center rounded-full border-2 border-[#C9A84C] bg-black/30 text-[#C9A84C] opacity-0 backdrop-blur-sm transition-all duration-300 group-hover/ph:scale-100 group-hover/ph:opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PanoramicStrip({
  images,
  onOpen,
}: {
  images: StripImage[];
  onOpen: (index: number) => void;
}) {
  if (images.length === 0) return null;

  const items: Item[] = images.map((img, index) => ({ img, index }));
  const mid = Math.ceil(items.length / 2);
  const rowTop = items.slice(0, mid);
  // Deuxième bande décalée -> variété visuelle entre les deux rangées
  const rowBottom = [...items.slice(mid), ...items.slice(0, mid)].slice(0, mid + 2);

  return (
    <div className="relative">
      {/* Fondus latéraux cinématographiques */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-black to-transparent sm:w-24"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-black to-transparent sm:w-24"
      />

      <div className="flex flex-col gap-2 sm:gap-3">
        <Row items={rowTop} direction="left" duration={70} onOpen={onOpen} />
        <Row items={rowBottom} direction="right" duration={90} onOpen={onOpen} />
      </div>
    </div>
  );
}
