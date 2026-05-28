"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { upcomingEvents } from "@/lib/events-config";
import { useAuth } from "@/lib/supabase/auth-context";

/* ================================================================
   Worship Gift — Page de réservation (stepper 4 étapes)
   Étape 1 : Sélection de l'événement
   Étape 2 : Nombre de places + type de billet
   Étape 3 : Infos personnelles
   Étape 4 : Confirmation + récapitulatif
   
   Flux :
   Stepper complet → POST /api/orders (crée commande pending + tickets)
   → Redirection vers /billetterie/checkout?order=WG-xxx&...
   → Checkout affiche le récap + placeholder "Paiement bientôt"
   
   TODO: BRANCHER CMI — Quand le paiement sera actif,
   le checkout redirigera vers /api/payment/cmi/init au lieu
   d'afficher un placeholder.
   ================================================================ */

type TicketType = "Entrée libre" | "VIP";

const STEPS = ["Événement", "Places", "Infos", "Confirmation"];

export default function ReserverPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Données du formulaire
  const [selectedEventIndex, setSelectedEventIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [ticketType, setTicketType] = useState<TicketType>("Entrée libre");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [acceptContact, setAcceptContact] = useState(false);

  // Pré-remplir nom/email si connecté
  useEffect(() => {
    if (user) {
      const name =
        user.user_metadata?.full_name || user.user_metadata?.name || "";
      if (name) setNom(name);
      if (user.email) setEmail(user.email);
    }
  }, [user]);

  const selectedEvent = upcomingEvents[selectedEventIndex];

  const canGoNext = (): boolean => {
    if (step === 0) return selectedEventIndex >= 0;
    if (step === 1) return quantity >= 1;
    if (step === 2) return nom.trim() !== "" && email.trim() !== "";
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    try {
      // TODO: BRANCHER CMI ICI (étape 2/2)
      // Quand le paiement CMI sera actif, cette fonction pourra :
      // 1. Créer la commande via POST /api/orders (ci-dessous)
      // 2. Puis rediriger directement vers /api/payment/cmi/init
      //    avec l'orderId et les infos client
      // Voir src/app/api/payment/cmi/init/route.ts

      // Appeler l'API pour créer la commande + tickets
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: selectedEvent.id,
          quantity,
          ticketType,
          customerName: nom.trim(),
          customerEmail: email.trim(),
          telephone: telephone.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Erreur lors de la création de la commande");
      }

      // Rediriger vers la page checkout avec les infos
      const checkoutParams = new URLSearchParams({
        order: data.orderId,
        event: selectedEventIndex.toString(),
        quantity: quantity.toString(),
        ticketType,
        amount: (selectedEvent.priceValue * quantity).toString(),
      });

      router.push(`/billetterie/checkout?${checkoutParams.toString()}`);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erreur lors de la réservation";
      setError(message);
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (step === 3) {
      handleSubmit();
      return;
    }
    if (canGoNext()) {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }
  };

  const handlePrev = () => setStep((s) => Math.max(s - 1, 0));

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#C9A84C] border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col bg-[#F9F5EC] pt-20">
        <div className="flex-1 px-4 py-8 md:py-12">
          <div className="mx-auto max-w-2xl">
            {/* En-tête */}
            <div className="mb-10 text-center">
              <h1 className="font-heading text-3xl font-bold text-gray-900 md:text-4xl">
                Réserve ta place
              </h1>
              <p className="mt-3 text-sm text-gray-500">
                Remplis le formulaire pour participer à un événement Worship Gift.
              </p>
            </div>

            {/* Stepper */}
            <nav className="mb-10" aria-label="Progression">
              <ol className="flex items-center justify-center gap-2">
                {STEPS.map((label, i) => (
                  <li key={label} className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (i <= step || (i === step + 1 && canGoNext())) {
                          setStep(i);
                        }
                      }}
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                        i < step
                          ? "bg-[#C9A84C] text-black"
                          : i === step
                            ? "bg-[#C9A84C] text-black ring-4 ring-[#C9A84C]/30"
                            : "bg-gray-200 text-gray-400"
                      }`}
                      aria-current={i === step ? "step" : undefined}
                      aria-label={`Étape ${i + 1} : ${label}`}
                    >
                      {i < step ? "✓" : i + 1}
                    </button>
                    <span
                      className={`hidden text-xs font-medium sm:inline ${
                        i <= step ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {label}
                    </span>
                    {i < STEPS.length - 1 && (
                      <div
                        className={`mx-1 h-px w-6 ${
                          i < step ? "bg-[#C9A84C]" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </li>
                ))}
              </ol>
            </nav>

            {/* Formulaire */}
            <AnimatePresence mode="wait">
              {/* --- ÉTAPES 1 À 4 --- */}
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35 }}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8"
              >
                {/* Étape 1 : Sélection de l'événement */}
                {step === 0 && (
                  <fieldset>
                    <legend className="font-heading text-xl font-semibold text-gray-900">
                      Choisis ton événement
                    </legend>
                    <p className="mt-1 text-sm text-gray-500">
                      Sélectionne l'événement auquel tu souhaites participer.
                    </p>
                    <div className="mt-6 space-y-3">
                      {upcomingEvents.map((event, i) => (
                        <label
                          key={event.title}
                          className={`flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-all ${
                            selectedEventIndex === i
                              ? "border-[#C9A84C] bg-[#C9A84C]/5 shadow-sm"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="event"
                            value={i}
                            checked={selectedEventIndex === i}
                            onChange={() => setSelectedEventIndex(i)}
                            className="mt-0.5 h-4 w-4 accent-[#C9A84C]"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                              {event.title}
                            </p>
                            <p className="mt-0.5 text-sm text-gray-500">
                              {event.date} • {event.time} • {event.location}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                              {event.price}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                )}

                {/* Étape 2 : Nombre de places + type */}
                {step === 1 && (
                  <fieldset>
                    <legend className="font-heading text-xl font-semibold text-gray-900">
                      Nombre de places
                    </legend>
                    <p className="mt-1 text-sm text-gray-500">
                      Indique combien de places tu souhaites réserver.
                    </p>

                    <div className="mt-6 space-y-5">
                      {/* Quantité */}
                      <div>
                        <label
                          htmlFor="quantity"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Nombre de places
                        </label>
                        <div className="mt-2 flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              setQuantity((q) => Math.max(1, q - 1))
                            }
                            className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 text-gray-600 transition-colors hover:bg-gray-100"
                            aria-label="Réduire le nombre de places"
                          >
                            −
                          </button>
                          <input
                            id="quantity"
                            type="number"
                            min={1}
                            max={10}
                            value={quantity}
                            onChange={(e) =>
                              setQuantity(
                                Math.max(
                                  1,
                                  Math.min(10, Number(e.target.value) || 1),
                                ),
                              )
                            }
                            className="h-10 w-20 rounded-md border border-gray-300 text-center text-sm font-semibold text-gray-900"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setQuantity((q) => Math.min(10, q + 1))
                            }
                            className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 text-gray-600 transition-colors hover:bg-gray-100"
                            aria-label="Augmenter le nombre de places"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Type de billet */}
                      <div>
                        <span className="block text-sm font-medium text-gray-700">
                          Type de billet
                        </span>
                        <div className="mt-2 grid grid-cols-2 gap-3">
                          {(["Entrée libre", "VIP"] as TicketType[]).map(
                            (type) => (
                              <label
                                key={type}
                                className={`flex cursor-pointer items-center justify-center rounded-lg border p-3 text-sm font-medium transition-all ${
                                  ticketType === type
                                    ? "border-[#C9A84C] bg-[#C9A84C]/5 text-[#C9A84C]"
                                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="ticketType"
                                  value={type}
                                  checked={ticketType === type}
                                  onChange={() => setTicketType(type)}
                                  className="sr-only"
                                />
                                {type}
                              </label>
                            ),
                          )}
                        </div>
                      </div>

                      {/* Récapitulatif rapide */}
                      <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Événement :</span>{" "}
                          {selectedEvent.title}
                        </p>
                        <p>
                          <span className="font-medium">Prix :</span>{" "}
                          {selectedEvent.price}
                        </p>
                      </div>
                    </div>
                  </fieldset>
                )}

                {/* Étape 3 : Infos personnelles */}
                {step === 2 && (
                  <fieldset>
                    <legend className="font-heading text-xl font-semibold text-gray-900">
                      Tes informations
                    </legend>
                    <p className="mt-1 text-sm text-gray-500">
                      Remplis les champs ci-dessous pour finaliser ta
                      réservation.
                    </p>

                    {!user && (
                      <div className="mt-4 rounded-lg border border-[#C9A84C]/30 bg-[#C9A84C]/5 p-4 text-sm">
                        <p className="text-gray-700">
                          Tu n'es pas connecté.{" "}
                          <Link
                            href="/auth/login"
                            className="font-medium text-[#C9A84C] underline hover:text-[#F0CB6A]"
                          >
                            Connecte-toi
                          </Link>{" "}
                          pour pré-remplir tes informations ou continue en
                          invité.
                        </p>
                      </div>
                    )}

                    <div className="mt-6 space-y-4">
                      <div>
                        <label
                          htmlFor="nom"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Nom complet *
                        </label>
                        <input
                          id="nom"
                          type="text"
                          value={nom}
                          onChange={(e) => setNom(e.target.value)}
                          required
                          placeholder="Ton nom"
                          className="mt-1.5 block w-full rounded-md border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email *
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="ton@email.com"
                          className="mt-1.5 block w-full rounded-md border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="telephone"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Téléphone
                        </label>
                        <input
                          id="telephone"
                          type="tel"
                          value={telephone}
                          onChange={(e) => setTelephone(e.target.value)}
                          placeholder="+212 6XX XXX XXX"
                          className="mt-1.5 block w-full rounded-md border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]"
                        />
                      </div>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={acceptContact}
                          onChange={(e) => setAcceptContact(e.target.checked)}
                          className="mt-0.5 h-4 w-4 accent-[#C9A84C]"
                        />
                        <span className="text-sm text-gray-500">
                          J'accepte d'être contacté(e) par Worship Gift pour
                          les prochains événements.
                        </span>
                      </label>
                    </div>
                  </fieldset>
                )}

                {/* Étape 4 : Confirmation */}
                {step === 3 && (
                  <div>
                    <h2 className="font-heading text-xl font-semibold text-gray-900">
                      Récapitulatif de ta réservation
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Vérifie les informations avant de confirmer.
                    </p>
                    <div className="mt-6 space-y-3 rounded-lg bg-gray-50 p-5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Événement</span>
                        <span className="font-semibold text-gray-900">
                          {selectedEvent.title}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Date</span>
                        <span className="text-gray-900">
                          {selectedEvent.date} à {selectedEvent.time}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Lieu</span>
                        <span className="text-gray-900">
                          {selectedEvent.location}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Places</span>
                        <span className="font-semibold text-gray-900">
                          {quantity}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Type de billet</span>
                        <span className="text-gray-900">{ticketType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Prix</span>
                        <span className="font-semibold text-[#C9A84C]">
                          {selectedEvent.price}
                        </span>
                      </div>
                      <hr className="border-gray-200" />
                      <div className="flex justify-between">
                        <span className="text-gray-500">Nom</span>
                        <span className="text-gray-900">{nom}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Email</span>
                        <span className="text-gray-900">{email}</span>
                      </div>
                      {telephone && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Téléphone</span>
                          <span className="text-gray-900">{telephone}</span>
                        </div>
                      )}
                    </div>

                    {error && (
                      <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">
                        {error}
                      </p>
                    )}
                  </div>
                )}

                {/* Boutons Précédent / Suivant / Confirmer */}
                {step < 4 && (
                  <div className="mt-8 flex items-center justify-between gap-3">
                    {step > 0 ? (
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="inline-flex h-11 items-center rounded-md border border-gray-300 px-5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                      >
                        ← Précédent
                      </button>
                    ) : (
                      <span />
                    )}
                    <button
                      type="button"
                      disabled={
                        submitting || (step === 0 && !canGoNext())
                      }
                      onClick={handleNext}
                      className={`inline-flex h-11 items-center justify-center rounded-md px-6 text-sm font-semibold transition-all ${
                        submitting
                          ? "cursor-not-allowed bg-gray-400 text-white"
                          : "bg-[#C9A84C] text-black hover:bg-[#F0CB6A] hover:shadow-md hover:shadow-[#C9A84C]/30 active:scale-[0.97]"
                      }`}
                    >
                      {submitting
                        ? "Réservation en cours…"
                        : step === 3
                          ? "Confirmer la réservation"
                          : "Suivant →"}
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </>
  );
}