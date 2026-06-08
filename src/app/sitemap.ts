import type { MetadataRoute } from "next";
import { upcomingEvents } from "@/lib/events-config";
import { albums } from "@/lib/gallery-config";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.worship-gift.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Pages statiques publiques
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/a-propos`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/billetterie`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/galerie`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/youtube`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ];

  // Pages d'événements (réservation par slug)
  const eventPages: MetadataRoute.Sitemap = upcomingEvents.map((e) => ({
    url: `${siteUrl}/billetterie/${e.slug}/reserver`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Albums de la galerie
  const albumPages: MetadataRoute.Sitemap = albums.map((a) => ({
    url: `${siteUrl}/galerie/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...eventPages, ...albumPages];
}
