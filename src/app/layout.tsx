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

export const metadata: Metadata = {
  title: "Worship Gift | Mouvement Gospel",
  description:
    "Mouvement gospel dédié à la louange, l'adoration et l'unité à travers la musique.",
  openGraph: {
    title: "Worship Gift | Mouvement Gospel",
    description:
      "Mouvement gospel dédié à la louange, l'adoration et l'unité à travers la musique.",
    type: "website",
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
      <body className="min-h-full flex flex-col dark">{children}</body>
    </html>
  );
}