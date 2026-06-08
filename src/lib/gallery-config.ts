/* ================================================================
   Worship Gift — Configuration de la galerie
   Chaque "album" = un événement, avec sa propre page /galerie/[slug].

   ── Ajouter une photo à un album ──────────────────────────────
   Ajoute l'ID dans le tableau d'IDs correspondant.
   (ex: 47 pour img_m47.jpg dans Morijah)

   ── Ajouter un 3e album ───────────────────────────────────────
   1. const wg3Ids = [1, 2, 3, ...]
   2. ajoute un objet dans `albums` avec un slug unique (ex: "worship-gift-3")
   ================================================================ */

export interface GalleryImage {
  src: string;
  alt: string;
}

export interface GalleryAlbum {
  /** Identifiant d'URL : /galerie/<slug> */
  slug: string;
  /** Petit label (ex: "Worship Gift 1") */
  label: string;
  /** Titre complet */
  title: string;
  /** Sous-titre / description */
  subtitle: string;
  /** Image de couverture du dossier */
  cover: string;
  images: GalleryImage[];
}

// ─── Images Derek Jones (Worship Gift 1, préfixe img_d*) ───────
const derekIds = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 34, 35, 36,
];
const derekImages: GalleryImage[] = derekIds.map((id) => ({
  src: `/img_worship-gift/img_d${id}.jpg`,
  alt: `Concert Derek Jones Worship Gift – Photo ${id}`,
}));

// ─── Images Morijah (Worship Gift 2, préfixe img_m*) ──────────
const morijahIds = [
  1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
  38, 39, 40, 41, 42, 43, 44, 45, 46,
];
const morijahImages: GalleryImage[] = morijahIds.map((id) => ({
  src: `/img_worship-gift/img_m${id}.jpg`,
  alt: `Concert Morijah Worship Gift – Photo ${id}`,
}));

// ─── Albums (ordre d'affichage) ───────────────────────────────
export const albums: GalleryAlbum[] = [
  {
    slug: "worship-gift-1",
    label: "Worship Gift 1",
    title: "Worship Gift 1 – Derek Jones",
    subtitle:
      "Une nuit de Gospel et de communion inoubliable avec le chantre Derek Jones.",
    cover: "/img_worship-gift/img_d8.jpg",
    images: derekImages,
  },
  {
    slug: "worship-gift-2",
    label: "Worship Gift 2",
    title: "Worship Gift 2 – Morijah",
    subtitle:
      "Soirée de louange et d'adoration avec la chantre Morijah. Une voix qui touche les cœurs.",
    cover: "/img_worship-gift/img_m8.jpg",
    images: morijahImages,
  },
];

export function getAlbum(slug: string): GalleryAlbum | undefined {
  return albums.find((a) => a.slug === slug);
}
