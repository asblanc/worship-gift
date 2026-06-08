import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://worship-gift.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Pages privées / transactionnelles : pas d'indexation
      disallow: [
        "/account",
        "/admin",
        "/auth",
        "/dashboard",
        "/api/",
        "/billetterie/checkout",
        "/billetterie/success",
        "/billetterie/reserver",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
