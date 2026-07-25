"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════
   CONFIGURATION — modifiez les questions/réponses ici
   ═══════════════════════════════════════════════════════════ */

const FAQ_ITEMS = [
  {
    question: "Comment commander mes billets ?",
    answer:
      "En ligne : depuis l'accueil ou la page Billetterie, choisissez vos places directement dans le formulaire de notre billetterie partenaire et payez en quelques clics. À la livraison : envoyez-nous vos informations, nous préparons votre billet et vous réglez en espèces à la remise. C'est simple, rapide et sécurisé.",
  },
  {
    question: "Quels moyens de paiement acceptez-vous ?",
    answer:
      "Trois moyens de paiement : (1) en ligne par compte / carte sur la plateforme de notre billetterie partenaire ; (2) en espèces via les services de paiement proposés sur cette même plateforme (points de paiement partenaires) ; (3) en espèces à la livraison — nous vous remettons alors votre billet officiel, que nous avons réglé pour vous auprès du prestataire. À vous de choisir la formule la plus pratique.",
  },
  {
    question: "Puis-je payer à la livraison ?",
    answer:
      "Oui ! Choisissez « Paiement à la livraison », renseignez votre nom et votre téléphone : nous confirmons par WhatsApp, nous émettons votre billet officiel auprès de notre billetterie partenaire, puis nous vous le livrons. Vous réglez en espèces à la remise du billet — aucun paiement à l'avance n'est demandé.",
  },
  {
    question: "Comment récupérer mon billet de concert ?",
    answer:
      "Pour un paiement en ligne, votre billet vous est délivré immédiatement par la plateforme (par e-mail / téléchargement) une fois le paiement validé. Pour une commande à la livraison, votre billet officiel vous est remis en main propre. Dans les deux cas, présentez-le (sur votre téléphone ou imprimé) à l'entrée du concert.",
  },
  {
    question: "Combien de temps prend la livraison des billets ?",
    answer:
      "Après confirmation de votre commande sur WhatsApp, nous convenons ensemble d'un créneau de livraison. Les billets sont généralement livrés sous 24 à 72 h selon votre zone. Pour les commandes de dernière minute, contactez-nous directement via WhatsApp pour organiser un retrait rapide.",
  },
  {
    question: "Puis-je transférer mon billet à quelqu'un d'autre ?",
    answer:
      "Oui, vous pouvez transférer votre billet à une autre personne. Le billet n'est pas nominatif. La personne devra simplement présenter le billet (numérique ou imprimé) à l'entrée. Attention : un même billet ne peut être utilisé qu'une seule fois.",
  },
  {
    question: "Que faire si la date ou l'heure du concert change ?",
    answer:
      "En cas de changement de date ou d'horaire, nous vous informons immédiatement par e-mail et sur nos réseaux. Votre billet reste valable pour la nouvelle date. Si vous ne pouvez pas y assister, contactez-nous via le bouton WhatsApp en bas à droite de l'écran.",
  },
  {
    question: "Je n'ai pas reçu mon e-mail de confirmation, que faire ?",
    answer:
      "Vérifiez d'abord vos courriers indésirables (spams). Si vous ne trouvez toujours pas l'e-mail, contactez-nous via WhatsApp en précisant votre nom et la date d'achat. Nous vous renverrons votre billet dans les plus brefs délais.",
  },
  {
    question: "Les billets sont-ils remboursables ou échangeables ?",
    answer:
      "Les billets ne sont pas remboursables, sauf en cas d'annulation de l'événement de notre part. Ils sont cependant échangeables : vous pouvez les transférer à une autre personne (voir question ci-dessus). Pour toute situation particulière, contactez-nous.",
  },
];

/* ═══════════════════════════════════════════════════════════
   COMPOSANT
   ═══════════════════════════════════════════════════════════ */

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <motion.div
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="shrink-0 text-[#C9A84C]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </motion.div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="w-full border-t border-white/5 bg-[#0A0A0A] px-6 py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        {/* Titre section */}
        <div className="mb-12 flex flex-col items-center text-center">
          <span className="mb-4 inline-flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.2em] text-[#C9A84C]">
            <span className="h-px w-8 bg-[#C9A84C]/60" aria-hidden />
            Aide &amp; billetterie
          </span>
          <h2 className="font-heading text-3xl font-bold text-[#C9A84C] md:text-4xl">
            Foire aux questions
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-gray-300">
            Commande, paiement à la livraison, retrait de vos billets…
            Retrouvez ici l&rsquo;essentiel. Une autre question&nbsp;?
            Écrivez-nous sur WhatsApp.
          </p>
        </div>

        {/* Liste des questions */}
        <div className="flex flex-col gap-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`overflow-hidden rounded-xl border bg-[#111111] transition-colors ${
                  isOpen
                    ? "border-[#C9A84C]/40"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <button
                  onClick={() => toggle(index)}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`font-poppins text-sm font-bold tabular-nums transition-colors ${
                      isOpen ? "text-[#C9A84C]" : "text-[#C9A84C]/50"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-heading text-base font-medium text-white md:text-lg">
                    {item.question}
                  </span>
                  <ChevronIcon open={isOpen} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 pl-[3.25rem] pr-5 pt-1 text-sm leading-relaxed text-gray-300">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* CTA bas de FAQ */}
        <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-[#141414] to-[#0d0d0d] px-6 py-8 text-center">
          <p className="font-heading text-lg font-semibold text-white">
            Prêt à réserver votre place&nbsp;?
          </p>
          <p className="max-w-md text-sm leading-relaxed text-gray-300">
            Commandez en ligne et payez par carte ou à la livraison. Vous
            hésitez encore&nbsp;? Notre équipe vous répond directement.
          </p>
          <div className="mt-1 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/billetterie"
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#C9A84C] px-7 text-[13px] font-semibold uppercase tracking-[0.12em] text-black transition-all hover:bg-[#F0CB6A] hover:shadow-lg hover:shadow-[#C9A84C]/30 active:scale-[0.97]"
            >
              Commander des billets
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 px-7 text-[13px] font-semibold uppercase tracking-[0.12em] text-gray-200 transition-colors hover:border-[#C9A84C]/50 hover:text-[#C9A84C]"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}