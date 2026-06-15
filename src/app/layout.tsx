import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

import ClientLayout from "@/components/ClientLayout";
import { GoogleAnalytics } from "@next/third-parties/google";
import { defaultMetadata } from "@/lib/seo";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  ...defaultMetadata,
  // Favicon rond (disque noir + logo or) — affichage circulaire propre
  icons: {
    icon: [
      { url: '/img_worship-gift/logo-disc.png', sizes: '192x192', type: 'image/png' },
      { url: '/img_worship-gift/logo-disc.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/img_worship-gift/logo-disc.png',
    shortcut: '/img_worship-gift/logo-disc.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${cormorant.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#000000] overflow-x-hidden">
        <ClientLayout>{children}</ClientLayout>
      </body>
      {/* Google Analytics — actif uniquement si NEXT_PUBLIC_GA_ID est défini */}
      {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
    </html>
  );
}
