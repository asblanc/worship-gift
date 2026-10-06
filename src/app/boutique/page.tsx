"use client";

import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import MerchCollection from "@/components/MerchCollection";

export default function BoutiquePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-black pt-20">
        <PageHero
          image="/img_worship-gift/merch-pull.webp"
          alt="Collection JE SUIS CHOISI de Worship Gift"
          eyebrow="Boutique Worship Gift"
          title="JE SUIS CHOISI"
          objectPosition="center"
        >
          Collection Édition Limitée. Commande directement sur WhatsApp ou par téléphone.
        </PageHero>
        <MerchCollection detailed />
      </main>
    </>
  );
}
