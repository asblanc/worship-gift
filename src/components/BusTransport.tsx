"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Eyebrow from "@/components/Eyebrow";

const routes = [
  {
    city: "Fès",
    route: "Fès ↔ Casa",
    price: "150 DH aller-retour",
    seats: "50 places",
    phone: "+212 673 395160",
    tel: "+212673395160",
    whatsapp: "212673395160",
    image: "/img_worship-gift/bus-fes.webp",
  },
  {
    city: "Marrakech",
    route: "Marrakech ↔ Casa",
    price: "150 DH aller-retour",
    seats: "50 places",
    phone: "0605426406",
    tel: "+212605426406",
    whatsapp: "212605426406",
    image: "/img_worship-gift/bus-marrakech.webp",
  },
  {
    city: "Rabat",
    route: "Rabat ↔ Casa",
    price: "100 DH aller-retour",
    seats: "25 places",
    phone: "0614375354",
    tel: "+212614375354",
    whatsapp: "212614375354",
    image: "/img_worship-gift/bus-rabat.webp",
  },
];

const whatsappHref = (city: string, phone: string) =>
  `https://wa.me/${phone}?text=${encodeURIComponent(`Je veux réserver une place dans le bus de ${city} pour le concert du 11 octobre`)}`;

export default function BusTransport() {
  return (
    <section id="transport" className="border-t border-white/10 bg-[#0D0D0D] px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-10 max-w-2xl text-center"
        >
          <Eyebrow centered>Transport organisé</Eyebrow>
          <h2 className="t-h2 text-white">Venez en bus</h2>
          <p className="mt-4 t-body text-gray-400">
            Réserve ton trajet aller-retour pour vivre le concert sans te soucier du déplacement.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {routes.map((bus, index) => (
            <motion.article
              key={bus.city}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#141414] shadow-[0_10px_35px_rgba(0,0,0,0.3)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-black">
                <Image
                  src={bus.image}
                  alt={`Bus ${bus.city} vers Casablanca pour le concert`}
                  fill
                  sizes="(max-width: 767px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-black/75 px-3 py-1 text-xs font-bold text-[#E7C86A] backdrop-blur-sm">
                  {bus.seats}
                </span>
              </div>
              <div className="p-5">
                <h3 className="t-card-title text-white">{bus.route}</h3>
                <p className="mt-2 text-lg font-bold text-[#C9A84C]">{bus.price}</p>
                <p className="mt-1 text-sm text-gray-400">Contact : {bus.phone}</p>
                <div className="mt-5 grid grid-cols-2 gap-2.5">
                  <a
                    href={`tel:${bus.tel}`}
                    className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-white/20 text-sm font-semibold text-white transition-colors hover:border-[#C9A84C]/70 hover:text-[#C9A84C] focus-ring"
                  >
                    <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.74a16 16 0 0 0 6 6l1.28-1.28a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z" /></svg>
                    Appeler
                  </a>
                  <a
                    href={whatsappHref(bus.city, bus.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-[#25D366] text-sm font-bold text-white transition-colors hover:bg-[#1ebe5d] focus-ring"
                  >
                    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" /></svg>
                    WhatsApp
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
