"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import { billetteriesWidget as ticketing } from "@/lib/ticketing-config";

/* ================================================================
   Worship Gift — Achat en ligne
   Ouvre la billetterie du prestataire (billetteries.ma) en pleine
   page (nouvel onglet). On N'INTÈGRE PAS le tunnel en iframe : la
   passerelle bancaire (3-D Secure) refuse d'être affichée en iframe,
   ce qui empêchait le paiement d'aboutir.
   ================================================================ */

export default function BilletterieEnLignePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        <PageHero
          image="/img_worship-gift/img_billeterie-crop.jpg"
          alt="Billetterie en ligne Worship Gift"
          eyebrow="Paiement sécurisé"
          title="Acheter en ligne"
        >
          Réservez vos places et réglez sur la billetterie sécurisée de notre
          partenaire. Votre billet vous est délivré immédiatement.
        </PageHero>

        <section className="bg-[#0D0D0D] px-4 py-14 sm:px-6 md:py-20">
          <div className="mx-auto max-w-2xl">
            {/* Fil d'ariane / retour */}
            <div className="mb-8 flex items-center gap-2 text-sm">
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
              className="flex flex-col items-center rounded-2xl border border-[#C9A84C]/25 bg-gradient-to-b from-[#1e1a10] to-[#121212] p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.45)] md:p-12"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A84C]/15 text-[#C9A84C]">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 5v2" /><path d="M15 11v2" /><path d="M15 17v2" />
                  <path d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z" />
                </svg>
              </span>
              <h2 className="mt-5 t-h3 text-white">Réservez vos billets en ligne</h2>
              <p className="mx-auto mt-3 max-w-md t-body text-sm text-gray-400">
                Vous allez ouvrir la billetterie sécurisée de notre partenaire.
                Choisissez votre catégorie et votre quantité, puis réglez par
                carte ou en espèces via leurs points partenaires. Votre e-billet
                est délivré immédiatement.
              </p>
              <a
                href={ticketing.directUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#C9A84C] px-8 text-[13px] font-semibold uppercase tracking-[0.12em] text-black transition-all hover:bg-[#F0CB6A] hover:shadow-lg hover:shadow-[#C9A84C]/30 active:scale-[0.97]"
              >
                Ouvrir la billetterie
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7" /><path d="M7 7h10v10" /></svg>
              </a>
              <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-gray-500">
                <svg className="h-3.5 w-3.5 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Paiement 100 % sécurisé · billetteries.ma
              </p>
            </motion.div>

            {/* Alternative livraison */}
            <p className="mt-6 text-center text-xs text-gray-500">
              Vous préférez payer à la réception&nbsp;?{" "}
              <Link href="/billetterie" className="text-[#C9A84C] hover:text-[#F0CB6A]">
                Commander avec paiement à la livraison
              </Link>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
