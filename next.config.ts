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
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://img.youtube.com https://*.supabase.co",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co",
  "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
  "form-action 'self' https://*.cmi.co.ma",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
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