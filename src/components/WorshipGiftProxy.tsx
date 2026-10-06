"use client";

import { motion } from "framer-motion";
import Eyebrow from "@/components/Eyebrow";

const PROXY_WHATSAPP_URL =
  "https://wa.me/212605426406?text=Bonjour%2C%20je%20veux%20commander%20un%20billet%20pour%20le%20concert%20du%2011%20octobre";

export default function WorshipGiftProxy() {
  return (
    <section className="border-t border-white/10 bg-[#090909] px-6 py-16 md:py-24">
      <div className="mx-auto grid max-w-5xl items-center gap-8 overflow-hidden rounded-3xl border border-[#25D366]/25 bg-gradient-to-br from-[#0e2417] via-[#101510] to-[#111111] shadow-[0_18px_60px_rgba(0,0,0,0.38)] md:grid-cols-[0.88fr_1.12fr] md:gap-12">
        <motion.div
          initial={{ opacity: 0, x: -18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative mx-auto mt-7 aspect-[4/5] w-[min(68vw,260px)] overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl md:my-8 md:ml-8 md:w-[calc(100%-4rem)]"
        >
          <img
            src="/img_worship-gift/proxy-livraison.webp"
            alt="Worship Gift Proxy, billetterie livrée à domicile"
            className="h-full w-full object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="px-6 pb-8 text-center md:px-0 md:py-10 md:pr-10 md:text-left"
        >
          <Eyebrow className="text-[#6DE696]">Service de proximité</Eyebrow>
          <h2 className="t-h2 text-white">Worship Gift Proxy — Ta billetterie à domicile</h2>
          <p className="mt-4 max-w-xl t-body text-gray-300">
            Commande ton billet, paie et reçois-le à domicile. Livraison à Casablanca.
          </p>
          <a
            href={PROXY_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-bold text-white shadow-lg shadow-[#25D366]/20 transition-all hover:bg-[#1ebe5d] active:scale-[0.98] focus-ring"
          >
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
            </svg>
            Commander sur WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}
