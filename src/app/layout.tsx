import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond, Poppins } from "next/font/google";
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

// Poppins — typographie du thème ePentatonic (utilisée sur la page Médias)
const poppins = Poppins({
  variable: "--font-poppins-var",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
  display: "swap",
});

import ClientLayout from "@/components/ClientLayout";
import { GoogleAnalytics } from "@next/third-parties/google";
import { defaultMetadata } from "@/lib/seo";

// Suivi actif UNIQUEMENT si NEXT_PUBLIC_GA_ID est défini (pas de valeur
// en dur : sans la variable, aucun script de tracking n'est chargé).
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";

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

// Viewport (recommandé séparé de metadata depuis Next.js 14+) :
// responsive + couleur de thème pour la barre d'adresse mobile.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0D0D0D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${cormorant.variable} ${poppins.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#000000] overflow-x-hidden">
        {/* Filet anti page-blanche : si l'app n'est pas hydratée après un
            délai (JS en échec sur vieux WebView), on révèle le contenu que
            framer-motion garde masqué. Script ES5 pour compat maximale. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{setTimeout(function(){var d=document.documentElement;if(!d.getAttribute('data-hydrated')){d.className+=' reveal-fallback';}},4500);}catch(e){}})();",
          }}
        />
        {/* Lien d'évitement (accessibilité clavier/lecteurs d'écran) :
            visible uniquement à la prise de focus. */}
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-[#C9A84C] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-black"
        >
          Aller au contenu principal
        </a>
        <div id="contenu" tabIndex={-1} className="flex min-h-full flex-1 flex-col outline-none">
          <ClientLayout>{children}</ClientLayout>
        </div>
      </body>
      {/* Google Analytics — actif uniquement si NEXT_PUBLIC_GA_ID est défini */}
      {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
    </html>
  );
}
