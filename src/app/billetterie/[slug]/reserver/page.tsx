"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { upcomingEvents, WHATSAPP_NUMBER, type EventData } from "@/lib/events-config";

type Method = "online" | "delivery";

export default function ReservationPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const event = upcomingEvents.find((e) => e.slug === slug);
  if (!event) return notFound();
  return <ReservationForm event={event} />;
}

function ReservationForm({ event }: { event: EventData }) {
  const tiers = event.ticketTypes ?? [];
  const hasTiers = tiers.length > 0;

  const [tierId, setTierId] = useState(hasTiers ? tiers[0].id : "");
  const [qty, setQty] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState<Method | null>(null);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState<{ orderId: string; method: Method } | null>(null);

  const selectedTier = hasTiers ? tiers.find((t) => t.id === tierId) ?? tiers[0] : undefined;
  const unitValue = selectedTier ? selectedTier.priceValue : event.priceValue;
  const totalMAD = (unitValue / 100) * qty;
  const isFree = unitValue === 0;
  const payUrl = selectedTier?.paymentUrl || event.paymentUrl || "";

  const openWhatsApp = (reference: string) => {
    const tierLabel = selectedTier ? ` (${selectedTier.label})` : "";
    const message = `Bonjour, je souhaite commander ${qty} billet${qty > 1 ? "s" : ""}${tierLabel} pour "${event.title}" le ${event.date} à ${event.location}.\nRéférence : ${reference}\nNom : ${name}${phone ? `\nTél : ${phone}` : ""}${!isFree ? `\nMontant : ${totalMAD} MAD (paiement à la livraison)` : ""}\nMerci de me confirmer la livraison.`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const submitOrder = async (method: Method) => {
    if (!name.trim()) {
      setError("Merci de saisir votre nom.");
      return;
    }
    if (method === "online" && !email.trim()) {
      setError("Un email est requis pour le paiement en ligne.");
      return;
    }
    if (method === "delivery" && !phone.trim()) {
      setError("Un numéro de téléphone est requis pour la livraison.");
      return;
    }
    setError("");
    setLoading(method);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          ticketTypeId: tierId || undefined,
          quantity: qty,
          customerName: name,
          customerEmail: email || undefined,
          telephone: phone || undefined,
          paymentMethod: method,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Erreur lors de l'enregistrement de la commande.");
        setLoading(null);
        return;
      }
      if (method === "delivery") openWhatsApp(data.orderId);
      setConfirmation({ orderId: data.orderId, method });
    } catch {
      setError("Erreur réseau. Réessaie dans un instant.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0D0D0D] pt-20">
        <section className="bg-black px-6 py-12 md:py-16">
          <div className="mx-auto max-w-4xl flex items-center gap-3">
            <Link href="/billetterie" className="text-[#C9A84C] hover:text-[#F0CB6A] text-sm flex items-center gap-1">
              ← Billetterie
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-white text-sm">{event.title}</span>
          </div>
          <div className="mx-auto max-w-4xl mt-6 text-center">
            <h1 className="t-hero text-[#C9A84C]">
              {confirmation ? "Commande enregistrée" : "Réserver ma place"}
            </h1>
          </div>
        </section>

        <section className="px-6 py-12 md:py-16">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid gap-8 md:grid-cols-[280px_1fr]"
            >
              {/* Affiche + résumé */}
              <div className="flex flex-col gap-4">
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl shadow-lg">
                  <Image src={event.coverImage} alt={event.title} fill className="object-cover" sizes="280px" priority />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.08] p-4 space-y-2 text-sm text-gray-300">
                  <p className="font-semibold text-white text-base">{event.title}</p>
                  {event.artist && <p className="text-[#C9A84C]">🎤 {event.artist}</p>}
                  <p>📅 {event.date} à {event.time}</p>
                  <p>📍 {event.location}</p>
                  <p className="font-bold text-[#C9A84C] text-lg">{isFree ? "Gratuit" : `${event.price}`}</p>
                </div>
              </div>

              {confirmation ? (
                <ConfirmationPanel
                  orderId={confirmation.orderId}
                  method={confirmation.method}
                  payUrl={payUrl}
                  onReopenWhatsApp={() => openWhatsApp(confirmation.orderId)}
                />
              ) : (
                <div className="rounded-xl border border-white/10 bg-white/[0.08] p-6 md:p-8 space-y-6">
                  {/* Catégories de billets */}
                  {hasTiers && (
                    <div className="space-y-2.5">
                      <h2 className="t-h3 text-white">Catégorie de billet</h2>
                      <div className="grid gap-2.5">
                        {tiers.map((t) => {
                          const active = t.id === tierId;
                          return (
                            <button
                              key={t.id}
                              type="button"
                              disabled={t.soldOut}
                              onClick={() => setTierId(t.id)}
                              className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left transition-all ${
                                active
                                  ? "border-[#C9A84C] bg-[#C9A84C]/10"
                                  : "border-white/10 bg-black/30 hover:border-[#C9A84C]/40"
                              } ${t.soldOut ? "opacity-40 cursor-not-allowed" : ""}`}
                            >
                              <span>
                                <span className="block text-sm font-semibold text-white">{t.label}</span>
                                {t.description && <span className="block text-xs text-gray-400">{t.description}</span>}
                              </span>
                              <span className="text-sm font-bold text-[#C9A84C]">
                                {t.soldOut ? "Épuisé" : t.price}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <h2 className="t-h3 text-white">Vos informations</h2>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-300">Nom complet *</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre nom et prénom"
                      className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]/40" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-300">Email <span className="text-gray-500">(paiement en ligne)</span></label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com"
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]/40" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-300">Téléphone <span className="text-gray-500">(livraison)</span></label>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+212 6XX XXX XXX"
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]/40" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-300">Nombre de billets</label>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-9 w-9 rounded-full border border-white/15 text-lg font-bold text-gray-300 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors">−</button>
                      <span className="min-w-[2rem] text-center text-lg font-semibold text-white">{qty}</span>
                      <button onClick={() => setQty(Math.min(10, qty + 1))} className="h-9 w-9 rounded-full border border-white/15 text-lg font-bold text-gray-300 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors">+</button>
                    </div>
                  </div>

                  {!isFree && (
                    <div className="rounded-lg bg-black/40 px-4 py-3 flex items-center justify-between">
                      <span className="text-sm text-gray-300">Total{selectedTier ? ` · ${selectedTier.label}` : ""}</span>
                      <span className="font-heading text-xl font-bold text-[#C9A84C]">{totalMAD} MAD</span>
                    </div>
                  )}

                  {error && <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>}

                  <div className="border-t border-white/10 pt-4">
                    <p className="mb-4 text-sm font-medium text-gray-300">Mode de paiement :</p>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        onClick={() => submitOrder("online")}
                        disabled={loading !== null}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#C9A84C] px-6 py-3 text-sm font-semibold text-black shadow-sm hover:bg-[#F0CB6A] transition-colors disabled:opacity-50"
                      >
                        {loading === "online" ? "…" : "Payer en ligne"}
                      </button>
                      {event.deliveryAvailable && (
                        <button
                          onClick={() => submitOrder("delivery")}
                          disabled={loading !== null}
                          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#1ebe5d] transition-colors disabled:opacity-50"
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                          {loading === "delivery" ? "…" : "Paiement à la livraison"}
                        </button>
                      )}
                    </div>
                    <p className="mt-3 text-xs text-gray-400">
                      Ta commande est enregistrée avec une référence. En ligne : règlement sur la page sécurisée du prestataire. À la livraison : règlement à la remise du billet. Ta place est confirmée une fois le paiement reçu.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}

function ConfirmationPanel({
  orderId,
  method,
  payUrl,
  onReopenWhatsApp,
}: {
  orderId: string;
  method: Method;
  payUrl: string;
  onReopenWhatsApp: () => void;
}) {
  return (
    <div className="rounded-xl border border-[#C9A84C]/30 bg-white/[0.08] p-6 md:p-8 space-y-5">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366]/15 text-[#25D366]">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        </span>
        <h2 className="t-h3 text-white">Ta commande est enregistrée</h2>
      </div>

      <div className="rounded-lg border border-[#C9A84C]/20 bg-black/40 px-4 py-3">
        <p className="text-xs uppercase tracking-wider text-gray-400">Ta référence</p>
        <p className="font-mono text-lg font-bold text-[#C9A84C]">{orderId}</p>
        <p className="mt-1 text-xs text-gray-400">Conserve-la : elle identifie ta commande.</p>
      </div>

      {method === "delivery" ? (
        <div className="space-y-3 text-sm text-gray-300">
          <p>WhatsApp s'est ouvert avec ta référence. <strong className="text-white">Envoie le message</strong> pour organiser la <strong className="text-white">livraison</strong> et le paiement à la remise du billet.</p>
          <button onClick={onReopenWhatsApp} className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1ebe5d] transition-colors">
            Rouvrir WhatsApp
          </button>
        </div>
      ) : payUrl ? (
        <div className="space-y-3 text-sm text-gray-300">
          <p>Dernière étape : règle ta commande sur la page sécurisée de notre prestataire. Ta place est confirmée dès réception du paiement.</p>
          <a href={payUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#C9A84C] px-6 py-3 text-sm font-semibold text-black hover:bg-[#F0CB6A] transition-colors">
            Payer maintenant →
          </a>
        </div>
      ) : (
        <div className="space-y-3 text-sm text-gray-300">
          <p>Le paiement en ligne sera disponible très bientôt. En attendant, contacte-nous sur WhatsApp avec ta référence pour finaliser.</p>
          <button onClick={onReopenWhatsApp} className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1ebe5d] transition-colors">
            Nous contacter sur WhatsApp
          </button>
        </div>
      )}

      <div className="border-t border-white/10 pt-4">
        <Link href="/billetterie" className="text-sm text-[#C9A84C] hover:text-[#F0CB6A]">← Retour à la billetterie</Link>
      </div>
    </div>
  );
}
