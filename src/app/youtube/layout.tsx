import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Médias — Vidéos & lives gospel Worship Gift",
  description:
    "Regardez les lives, sessions et vidéos gospel de Worship Gift. Revivez nos moments d'adoration en replay et abonnez-vous à notre chaîne YouTube.",
  keywords: [
    "vidéos gospel",
    "live gospel Maroc",
    "Worship Gift YouTube",
    "session gospel",
    "musique gospel en direct",
  ],
  alternates: { canonical: "/youtube" },
  openGraph: {
    title: "Médias | Worship Gift",
    description:
      "Lives, sessions et vidéos gospel Worship Gift. Replay et chaîne YouTube.",
    url: "/youtube",
  },
};

export default function YouTubeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
