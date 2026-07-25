import type { Metadata } from "next";
import { getAlbum } from "@/lib/gallery-config";

/* ================================================================
   Worship Gift — Metadata de la page album /galerie/[slug]
   Chaque album indexé a un titre/description/canonical uniques.
   ================================================================ */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const album = getAlbum(slug);
  const path = `/galerie/${slug}`;

  if (!album) {
    return {
      title: "Album introuvable",
      robots: { index: false, follow: false },
    };
  }

  const title = `${album.title} — Photos`;
  const description = `${album.subtitle} Revivez en images ce moment de gospel et d'adoration avec Worship Gift.`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${album.title} — Galerie | Worship Gift`,
      description,
      url: path,
      images: album.cover ? [{ url: album.cover }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${album.title} — Galerie | Worship Gift`,
      description,
    },
  };
}

export default function AlbumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
