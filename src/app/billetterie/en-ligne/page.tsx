"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";

/* ================================================================
   Worship Gift — Achat en ligne
   Héberge le widget de billetterie externe (billetteries.ma) qui
   gère la sélection des places, le paiement sécurisé et l'envoi du
   billet. Chargé côté client uniquement (script tiers).
   ================================================================ */

const BilletteriesWidget = dynamic(
  () => import("@/components/BilletteriesWidget"),
  { ssr: false },
);

export default function BilletterieEnLignePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        <PageHero
          image="/img_worship-gift/img_billeterie.jpg"
          alt="Billetterie en ligne Worship Gift"
          eyebrow="Paiement sécurisé"
          title="Acheter en ligne"
        >
          Choisissez vos places et réglez en ligne en quelques clics. Votre
          billet vous est envoyé immédiatement par le prestataire.
        </PageHero>

        <section className="bg-[#0D0D0D] px-4 py-12 sm:px-6 md:py-16">
          <div className="mx-auto max-w-3xl">
            {/* Fil d'ariane / retour */}
            <div className="mb-6 flex items-center gap-2 text-sm">
              <Link
                href="/billetterie"
                className="inline-flex items-center gap-1 text-[#C9A84C] transition-colors hover:text-[#F0CB6A]"
              >
                ← Billetterie
              </Link>
              <span className="text-gray-500">/</span>
              <span className="text-gray-300">Achat en ligne</span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-6"
            >
              <BilletteriesWidget />
            </motion.div>

            {/* Rassurance */}
            <div className="mt-6 flex flex-col items-center gap-2 text-center">
              <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
                <svg className="h-3.5 w-3.5 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Paiement sécurisé géré par billetteries.ma
              </p>
              <p className="text-xs text-gray-500">
                Vous préférez payer à la réception&nbsp;?{" "}
                <Link href="/billetterie" className="text-[#C9A84C] hover:text-[#F0CB6A]">
                  Commander avec paiement à la livraison
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
