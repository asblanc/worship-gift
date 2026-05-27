import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "YouTube",
  description:
    "Retrouvez les lives, sessions de louange et vidéos exclusives de Worship Gift sur YouTube. Abonnez-vous à notre chaîne gospel.",
  openGraph: {
    title: "YouTube | Worship Gift",
    description:
      "Retrouvez les lives, sessions de louange et vidéos exclusives de Worship Gift sur YouTube.",
  },
};

export default function YouTubeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}