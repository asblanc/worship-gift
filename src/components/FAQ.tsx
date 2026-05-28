"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════
   CONFIGURATION — modifiez les questions/réponses ici
   ═══════════════════════════════════════════════════════════ */

const FAQ_ITEMS = [
  {
    question: "Comment récupérer mon billet de concert ?",
    answer:
      "Après votre achat, vous recevez un e-mail de confirmation contenant votre billet au format PDF. Vous pouvez le présenter directement sur votre téléphone à l'entrée du concert, ou l'imprimer. Vérifiez vos spams si vous ne le trouvez pas.",
  },
  {
    question: "Que faire si la date ou l'heure du concert change ?",
    answer:
      "En cas de changement de date ou d'horaire, nous vous informons immédiatement par e-mail. Votre billet reste valable pour la nouvelle date. Si vous ne pouvez pas y assister, contactez-nous via le bouton WhatsApp en bas à droite de l'écran.",
  },
  {
    question: "Puis-je transférer mon billet à quelqu'un d'autre ?",
    answer:
      "Oui, vous pouvez transférer votre billet à une autre personne. Le billet n'est pas nominatif. La personne devra simplement présenter le billet (numérique ou imprimé) à l'entrée. Attention : un même billet ne peut être utilisé qu'une seule fois.",
  },
  {
    question: "Que faire si je n'ai pas reçu mon e-mail de confirmation ?",
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
      <div className="mx-auto max-w-2xl">
        {/* Titre section */}
        <div className="mb-12 text-center">
          <h2 className="font-heading text-3xl font-bold text-[#C9A84C] md:text-4xl">
            Foire aux questions
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-gray-400">
            Vous avez une question ? Consultez notre FAQ ou contactez-nous
            directement via WhatsApp.
          </p>
        </div>

        {/* Liste des questions */}
        <div className="flex flex-col gap-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="overflow-hidden rounded-lg border border-white/10 bg-[#111111] transition-colors hover:border-white/15"
              >
                <button
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading text-base font-medium text-white md:text-lg">
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
                      <p className="px-5 pb-5 pt-1 text-sm leading-relaxed text-gray-400">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}