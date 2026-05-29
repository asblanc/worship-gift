import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Médias",
  description:
    "Vidéothèque Worship Gift : retrouvez les lives, sessions de gospel et vidéos exclusives. Abonnez-vous à notre chaîne YouTube.",
  openGraph: {
    title: "Médias | Worship Gift",
    description:
      "Vidéothèque Worship Gift : retrouvez les lives, sessions de gospel et vidéos exclusives.",
  },
};

export default function YouTubeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}