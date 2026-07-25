import type { Metadata } from "next";
import { upcomingEvents } from "@/lib/events-config";

/* ================================================================
   Worship Gift — Metadata de la page réservation /billetterie/[slug]
   Chaque événement indexé a un titre/description/canonical uniques
   (essentiel pour le SEO des pages présentes dans le sitemap).
   ================================================================ */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = upcomingEvents.find((e) => e.slug === slug);
  const path = `/billetterie/${slug}/reserver`;

  if (!event) {
    return {
      title: "Réservation — Événement introuvable",
      robots: { index: false, follow: false },
    };
  }

  const title = `Réserver — ${event.title} (${event.date})`;
  const description =
    `${event.description} ` +
    `${event.date} à ${event.time}, ${event.location}. ` +
    `Réservez vos billets en ligne : ${event.price}.`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${event.title} — Billetterie | Worship Gift`,
      description,
      url: path,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${event.title} — Billetterie | Worship Gift`,
      description,
    },
  };
}

export default function ReserverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
