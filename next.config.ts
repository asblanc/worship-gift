import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
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