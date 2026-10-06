"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Eyebrow from "@/components/Eyebrow";

const WHATSAPP_NUMBER = "212605426406";

const products = [
  {
    id: "tshirt",
    name: "Tee-shirt Édition Limitée",
    price: "150 DH",
    image: "/img_worship-gift/merch-tshirt.webp",
    alt: "Tee-shirt JE SUIS CHOISI — édition limitée Worship Gift",
    message: "Bonjour, je veux commander le tee-shirt Edition Limitee JE SUIS CHOISI",
    description: "Le tee-shirt officiel JE SUIS CHOISI, pensé pour porter le message bien au-delà du concert.",
  },
  {
    id: "pull",
    name: "Pull Édition Limitée",
    price: "180 DH",
    image: "/img_worship-gift/merch-pull.webp",
    alt: "Pull JE SUIS CHOISI — édition limitée Worship Gift",
    message: "Bonjour, je veux commander le pull Edition Limitee JE SUIS CHOISI",
    description: "Le pull officiel JE SUIS CHOISI, une pièce exclusive de la collection Worship Gift.",
  },
];

function whatsappHref(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function MerchCollection({ detailed = false }: { detailed?: boolean }) {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-[#0B0B0B] px-6 py-16 md:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-80 opacity-50"
        style={{ background: "radial-gradient(50% 80% at 50% 0%, rgba(196,22,28,0.24), transparent 72%)" }}
      />

      <div className="relative mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-10 max-w-2xl text-center"
        >
          <Eyebrow centered>Collection exclusive</Eyebrow>
          <h2 className="t-h2 text-white">
            Collection Édition Limitée <span className="block text-[#C9A84C]">— JE SUIS CHOISI</span>
          </h2>
          {detailed ? (
            <p className="mt-4 t-body text-gray-300">
              Deux pièces exclusives à commander directement auprès de notre équipe. Sans panier ni paiement en ligne : WhatsApp ou téléphone uniquement.
            </p>
          ) : (
            <p className="mt-4 t-body text-gray-400">
              Une collection en quantité très limitée, créée pour celles et ceux qui portent le message.
            </p>
          )}
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          {products.map((product, index) => (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-[#141414] shadow-[0_14px_45px_rgba(0,0,0,0.35)]"
            >
              <div className="relative aspect-[5/4] overflow-hidden bg-black">
                <Image
                  src={product.image}
                  alt={product.alt}
                  fill
                  sizes="(max-width: 767px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute left-4 top-4 rounded-full bg-[#C4161C] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white shadow-lg shadow-black/30">
                  Stock très limité
                </span>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="t-card-title text-white">{product.name}</h3>
                  <span className="font-heading text-2xl font-bold text-[#C9A84C]">{product.price}</span>
                </div>
                {detailed && <p className="mt-3 text-sm leading-relaxed text-gray-400">{product.description}</p>}
                <p className="mt-3 text-xs font-semibold text-[#ef767b]">Stock très limité · commande jusqu&apos;à épuisement</p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <a
                    href={whatsappHref(product.message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-bold text-white shadow-lg shadow-[#25D366]/20 transition-colors hover:bg-[#1ebe5d] active:scale-[0.98] focus-ring"
                  >
                    <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" /></svg>
                    Commander sur WhatsApp
                  </a>
                  <a
                    href="tel:+212605426406"
                    className="inline-flex min-h-11 items-center justify-center text-sm font-semibold text-gray-300 underline decoration-gray-600 underline-offset-4 transition-colors hover:text-[#C9A84C] focus-ring"
                  >
                    Appeler 06 05 42 64 06
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {!detailed && (
          <div className="mt-8 text-center">
            <Link href="/boutique" className="text-sm font-semibold text-[#C9A84C] underline decoration-[#C9A84C]/50 underline-offset-4 transition-colors hover:text-[#F0CB6A] focus-ring">
              Découvrir toute la collection
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
