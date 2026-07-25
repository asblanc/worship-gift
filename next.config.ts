import type { NextConfig } from "next";

/* ------------------------------------------------------------------
   Content-Security-Policy
   - script/style 'unsafe-inline' : requis par l'hydratation Next +
     framer-motion (styles inline). 'unsafe-eval' garde la compat dev.
   - connect : Supabase (auth + DB)
   - img : self + data/blob + miniatures YouTube
   - frame : embeds YouTube (VideoLightbox)
   - form-action : self + passerelle CMI (redirection paiement)
   - frame-ancestors 'none' : anti-clickjacking
   ------------------------------------------------------------------ */
// 'unsafe-eval' est requis uniquement en développement (Turbopack/HMR).
// En production, on le retire pour durcir la CSP — les builds Next.js
// n'en ont pas besoin.
const isProd = process.env.NODE_ENV === "production";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"} https://www.googletagmanager.com https://*.billetteries.ma`,
  "style-src 'self' 'unsafe-inline' https://*.billetteries.ma",
  "img-src 'self' data: blob: https://img.youtube.com https://*.supabase.co https://www.googletagmanager.com https://*.google-analytics.com https://*.billetteries.ma",
  "font-src 'self' data: https://*.billetteries.ma",
  "connect-src 'self' https://*.supabase.co https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://*.billetteries.ma",
  // frame-src : embeds YouTube + widget billetterie (billetteries.ma)
  "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://*.billetteries.ma",
  "form-action 'self' https://*.cmi.co.ma https://*.billetteries.ma",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  // worker/media : scanner QR caméra (html5-qrcode) côté admin
  "worker-src 'self' blob:",
  "media-src 'self' blob:",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    // camera=(self) : requis par le scanner de billets (/admin/scan,
    // html5-qrcode). microphone/geolocation restent bloqués.
    key: "Permissions-Policy",
    value: "camera=(self), microphone=(), geolocation=(), browsing-topics=()",
  },
  // HSTS : force HTTPS (2 ans, sous-domaines, éligible preload). Le site
  // est servi exclusivement en HTTPS par Vercel → aucun risque de lock-out.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // deviceSizes couvre tous les breakpoints mobile → desktop
    // Sans les petites tailles (320, 375, 414, 480), Next.js ne génère pas
    // de variantes optimisées pour mobile, ce qui peut empêcher l'affichage
    // sur certains navigateurs (iOS Safari notamment).
    deviceSizes: [320, 375, 414, 480, 640, 750, 828, 1080, 1200, 1920],
    // imageSizes pour les images avec layout="fixed" ou width/height explicites
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 85],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
};

export default nextConfig;