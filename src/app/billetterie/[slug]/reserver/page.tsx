"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { upcomingEvents, WHATSAPP_NUMBER } from "@/lib/events-config";

// ─── Helpers ────────────────────────────────────────────────

function buildWhatsAppLink(
  phone: string,
  name: string,
  qty: number,
  eventTitle: string,
  eventDate: string,
  eventLocation: string
): string {
  // ✏️ Modifier ici le texte du message WhatsApp envoyé par le client
  const message = `Bonjour, je souhaite réserver ${qty} billet${qty > 1 ? "s" : ""} pour "${eventTitle}" le ${eventDate} à ${eventLocation}. Mon nom : ${name || "(non précisé)"}. Merci de confirmer la disponibilité et la livraison à domicile.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

// ─── Page Component ──────────────────────────────────────────

export default function ReservationPage() {
  const params = useParams();
  const slug = params?.slug as string;

  // Chercher l'événement par son slug
  const event = upcomingEvents.find((e) => e.slug === slug);
  if (!event) return notFound();

  return <ReservationForm event={event} />;
}

// ─── Formulaire client ────────────────────────────────────────

function ReservationForm({ event }: { event: (typeof upcomingEvents)[0] }) {
  const [qty, setQty] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalMAD = (event.priceValue / 100) * qty;
  const isFree = event.priceValue === 0;

  // ── Option 1 : WhatsApp ────────────────────────────────────
  const handleWhatsApp = () => {
    if (!name.trim()) {
      setError("Merci de saisir votre nom avant de continuer.");
      return;
    }
    setError("");
    const link = buildWhatsAppLink(
      WHATSAPP_NUMBER,
      name,
      qty,
      event.title,
      event.date,
      event.location
    );
    window.open(link, "_blank", "noopener,noreferrer");
  };

  // ── Option 2 : Carte bancaire ──────────────────────────────
  // Crée la commande côté serveur (montant calculé serveur) puis
  // redirige vers le récapitulatif/paiement CMI.
  const handleCardPayment = async () => {
    if (!name.trim() || !email.trim()) {
      setError("Merci de saisir votre nom et votre email pour payer par carte.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          quantity: qty,
          ticketType: "Entrée libre",
          customerName: name,
          customerEmail: email,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Erreur lors de la création de la commande.");
        setLoading(false);
        return;
      }

      const idx = upcomingEvents.findIndex((e) => e.id === event.id);
      const params = new URLSearchParams({
        order: data.orderId,
        event: String(idx >= 0 ? idx : 0),
        quantity: String(qty),
        amount: String(data.amount),
        ticketType: "Entrée libre",
      });
      // Redirection vers le récap (qui propose le paiement CMI sécurisé)
      window.location.href = `/billetterie/checkout?${params.toString()}`;
    } catch {
      setError("Erreur lors de l'initialisation du paiement. Réessaie plus tard.");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0D0D0D] pt-20">
        {/* En-tête */}
        <section className="bg-black px-6 py-12 md:py-16">
          <div className="mx-auto max-w-4xl flex items-center gap-3">
            <Link href="/billetterie" className="text-[#C9A84C] hover:text-[#F0CB6A] text-sm flex items-center gap-1">
              ← Billetterie
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-white text-sm">{event.title}</span>
          </div>
          <div className="mx-auto max-w-4xl mt-6 text-center">
            <h1 className="font-heading text-4xl font-bold text-[#C9A84C] md:text-5xl">
              Finaliser ma réservation
            </h1>
          </div>
        </section>

        {/* Corps */}
        <section className="px-6 py-12 md:py-16">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid gap-8 md:grid-cols-[280px_1fr]"
            >
              {/* ── Affiche ─────────────────────── */}
              <div className="flex flex-col gap-4">
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl shadow-lg">
                  <Image
                    src={event.coverImage}
                    alt={event.title}
                    fill
                    className="object-cover"
                    sizes="280px"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                {/* Infos résumé */}
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2 text-sm text-gray-400">
                  <p className="font-semibold text-white text-base">{event.title}</p>
                  <p>📅 {event.date} à {event.time}</p>
                  <p>📍 {event.location}</p>
                  <p className="font-bold text-[#C9A84C] text-lg">{isFree ? "Gratuit" : `${event.price} / billet`}</p>
                </div>
              </div>

              {/* ── Formulaire ──────────────────── */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 md:p-8 space-y-6">
                <h2 className="font-heading text-2xl font-semibold text-white">Vos informations</h2>

                {/* Nom */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-300">Nom complet *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Votre nom et prénom"
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]/40"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-300">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]/40"
                  />
                </div>

                {/* Quantité */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-300">Nombre de billets</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setQty(Math.max(1, qty - 1))}
                      className="h-9 w-9 rounded-full border border-white/15 text-lg font-bold text-gray-300 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors">−</button>
                    <span className="min-w-[2rem] text-center text-lg font-semibold text-white">{qty}</span>
                    <button onClick={() => setQty(Math.min(10, qty + 1))}
                      className="h-9 w-9 rounded-full border border-white/15 text-lg font-bold text-gray-300 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors">+</button>
                  </div>
                </div>

                {/* Total */}
                {!isFree && (
                  <div className="rounded-lg bg-black/40 px-4 py-3 flex items-center justify-between">
                    <span className="text-sm text-gray-400">Total</span>
                    <span className="font-heading text-xl font-bold text-[#C9A84C]">{totalMAD} MAD</span>
                  </div>
                )}

                {/* Message d'erreur inline */}
                {error && (
                  <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-400">
                    {error}
                  </p>
                )}

                {/* Séparateur */}
                <div className="border-t border-white/10 pt-4">
                  <p className="mb-4 text-sm font-medium text-gray-300">Choisissez votre mode de réservation :</p>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    {/* Bouton WhatsApp */}
                    <button
                      onClick={handleWhatsApp}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#1ebe5d] transition-colors"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Livraison à domicile (WhatsApp)
                    </button>

                    {/* Bouton Carte bancaire */}
                    <button
                      onClick={handleCardPayment}
                      disabled={loading || isFree}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#C9A84C] px-6 py-3 text-sm font-semibold text-black shadow-sm hover:bg-[#F0CB6A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Chargement…" : isFree ? "Entrée gratuite" : "Payer par carte bancaire"}
                    </button>
                  </div>

                  {isFree && (
                    <p className="mt-3 text-xs text-gray-400 text-center">
                      Cet événement est gratuit. Utilise WhatsApp pour confirmer ta place.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
