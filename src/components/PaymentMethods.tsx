"use client";

import { motion } from "framer-motion";
import Eyebrow from "@/components/Eyebrow";

/* ================================================================
   Worship Gift — 3 moyens de paiement
   1 & 2 : sur la plateforme du prestataire (billetteries.ma)
   3     : cash à la livraison (billet officiel émis par nos soins)
   ================================================================ */

const METHODS = [
  {
    tag: "En ligne",
    title: "Compte ou carte",
    desc: "Payez directement dans le formulaire de billetterie, par votre compte ou par carte bancaire. Billet délivré immédiatement.",
    icon: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </>
    ),
  },
  {
    tag: "En ligne",
    title: "Espèces — points partenaires",
    desc: "Réglez en espèces via les services de paiement proposés sur la plateforme de notre billetterie partenaire.",
    icon: (
      <>
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <circle cx="12" cy="12" r="2.5" />
        <path d="M6 12h.01M18 12h.01" />
      </>
    ),
  },
  {
    tag: "Livraison",
    title: "Cash à la livraison",
    desc: "Commandez, nous émettons votre billet officiel auprès du prestataire. Un livreur ou un agent passe encaisser en espèces, puis votre billet numérique vous est envoyé.",
    icon: (
      <>
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <path d="M16 8h4l3 3v5h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </>
    ),
  },
];

export default function PaymentMethods() {
  return (
    <section className="border-t border-white/10 bg-[#0A0A0A] px-6 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-col items-center text-center"
        >
          <Eyebrow centered>Paiement flexible</Eyebrow>
          <h2 className="t-h2 text-white">3 façons de payer</h2>
          <p className="mx-auto mt-4 max-w-xl t-body text-gray-400">
            Choisissez ce qui vous arrange : en ligne par compte ou carte, en
            espèces via nos points partenaires, ou en cash à la livraison.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {METHODS.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative flex flex-col rounded-xl border border-[#282828] bg-[#121212] p-6 transition-all hover:border-[#C9A84C]/50 hover:shadow-[0_12px_50px_rgba(0,0,0,0.4)]"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#C9A84C]/30 bg-[#C9A84C]/10 text-[#C9A84C]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    {m.icon}
                  </svg>
                </span>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                  m.tag === "Livraison"
                    ? "bg-[#25D366]/15 text-[#25D366]"
                    : "bg-[#C9A84C]/15 text-[#C9A84C]"
                }`}>
                  {m.tag}
                </span>
              </div>
              <span className="mt-5 flex h-6 w-6 items-center justify-center rounded-full bg-[#C9A84C]/10 font-poppins text-xs font-bold text-[#C9A84C]">
                {i + 1}
              </span>
              <h3 className="mt-3 t-card-title text-white">{m.title}</h3>
              <p className="mt-2 t-meta text-gray-400">{m.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
