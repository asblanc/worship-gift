"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { upcomingEvents } from "@/lib/events-config";
import type { EventData } from "@/lib/events-config";
import { useAuth } from "@/lib/supabase/auth-context";

/* ================================================================
   Worship Gift — Page Checkout / Récapitulatif
   
   Mode actuel : SANS PAIEMENT
   - Affiche le récapitulatif de la commande
   - Bouton "Confirmer la réservation" (statut → reserved)
   - Placeholder "Paiement en ligne (bientôt disponible)"
   
   TODO: BRANCHER CMI — Quand le paiement sera actif :
   1. Remplacer le bouton "Confirmer" par "Payer par carte (CMI)"
   2. Le clic appelle POST /api/payment/cmi/init
   3. L'API renvoie le formulaire HTML de redirection CMI
   4. Le callback met à jour le statut → paid
   Voir src/app/api/payment/cmi/init/route.ts
   ================================================================ */

// Force dynamic rendering car useSearchParams() nécessite Suspense
// et cette page dépend entièrement des query params (order, event, quantity...)
export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  // Lire les paramètres de l'URL
  const orderId = searchParams.get("order") || "";
  const eventIndex = parseInt(searchParams.get("event") || "0", 10);
  const quantity = parseInt(searchParams.get("quantity") || "1", 10);
  const ticketType = searchParams.get("ticketType") || "Entrée libre";
  const amountParam = searchParams.get("amount");

  // Trouver l'événement
  const event: EventData = upcomingEvents[eventIndex] || upcomingEvents[0];

  // Calculer le montant
  const totalAmount = amountParam ? parseInt(amountParam, 10) : event.priceValue * quantity;
  const unitAmount = event.priceValue;
  const isFree = totalAmount === 0;

  // Confirmer la réservation côté serveur (pending → reserved).
  // La mutation passe par /api/orders/confirm (service_role) : le client
  // ne peut pas modifier directement le statut d'une commande.
  const handleConfirm = async () => {
    setConfirming(true);
    setError("");

    try {
      const res = await fetch("/api/orders/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setConfirmed(true);
      } else {
        setError(data.error || "Impossible de confirmer la réservation. Réessaie.");
      }
    } catch {
      setError("Erreur réseau. Vérifie ta connexion et réessaie.");
    } finally {
      setConfirming(false);
    }
  };

  // Paiement par carte (CMI) : on soumet un POST plein-page vers
  // /api/payment/cmi/init, qui renvoie le formulaire de redirection CMI
  // (auto-submit). Le montant n'est PAS envoyé : il est relu en base
  // côté serveur à partir de l'orderId.
  const handlePayCmi = () => {
    if (!orderId) {
      setError("Référence de commande manquante. Recommence ta réservation.");
      return;
    }
    setPaying(true);
    setError("");

    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/api/payment/cmi/init";

    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "orderId";
    input.value = orderId;
    form.appendChild(input);

    document.body.appendChild(form);
    form.submit();
  };

  // Formater le prix
  const formatMAD = (cents: number) =>
    new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
    }).format(cents / 100);

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col bg-[#0D0D0D] pt-20">
        <div className="flex-1 px-4 py-8 md:py-12">
          <div className="mx-auto max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-xl border border-gray-800 bg-black/50 p-6 backdrop-blur-sm md:p-8"
            >
              {confirmed ? (
                /* --- CONFIRMATION RÉUSSIE --- */
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#C9A84C] to-[#F0CB6A]"
                  >
                    <svg
                      className="h-8 w-8 text-black"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                  <h2 className="font-heading text-2xl font-bold text-white">
                    Réservation confirmée !
                  </h2>
                  <p className="mt-2 text-sm text-gray-400">
                    Votre réservation a bien été enregistrée.
                  </p>
                  {orderId && (
                    <p className="mt-3 text-xs text-gray-500">
                      Référence :{" "}
                      <span className="font-mono text-[#C9A84C]">{orderId}</span>
                    </p>
                  )}
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    {user ? (
                      <Link
                        href="/dashboard"
                        className="inline-flex h-11 items-center justify-center rounded-md bg-[#C9A84C] px-6 text-sm font-semibold text-black transition-colors hover:bg-[#F0CB6A]"
                      >
                        Voir mes billets
                      </Link>
                    ) : (
                      <Link
                        href="/auth/register"
                        className="inline-flex h-11 items-center justify-center rounded-md border border-[#C9A84C] px-6 text-sm font-medium text-[#C9A84C] transition-colors hover:bg-[#C9A84C]/10"
                      >
                        Créer un compte
                      </Link>
                    )}
                    <Link
                      href="/"
                      className="inline-flex h-11 items-center justify-center rounded-md border border-gray-600 px-6 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800"
                    >
                      Retour à l'accueil
                    </Link>
                  </div>
                </div>
              ) : (
                /* --- RÉCAPITULATIF COMMANDE --- */
                <>
                  {/* Stepper du tunnel de réservation */}
                  <ol className="mb-8 flex items-center justify-center gap-2 text-xs">
                    {["Réservation", "Récapitulatif", "Paiement"].map((label, i) => {
                      const current = i === 1; // on est à l'étape Récapitulatif
                      const done = i < 1;
                      return (
                        <li key={label} className="flex items-center gap-2">
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                              current
                                ? "bg-[#C9A84C] text-black"
                                : done
                                  ? "bg-[#C9A84C]/30 text-[#C9A84C]"
                                  : "border border-white/15 text-gray-500"
                            }`}
                          >
                            {i + 1}
                          </span>
                          <span className={current ? "font-semibold text-white" : "text-gray-500"}>
                            {label}
                          </span>
                          {i < 2 && <span className="mx-1 h-px w-5 bg-white/15 sm:w-8" />}
                        </li>
                      );
                    })}
                  </ol>

                  <h1 className="font-heading text-3xl font-bold text-white md:text-4xl">
                    Récapitulatif
                  </h1>
                  <p className="mt-2 text-sm text-gray-400">
                    Vérifiez votre commande avant de confirmer.
                  </p>

                  {/* Détails commande */}
                  <div className="mt-8 space-y-4 rounded-lg bg-gray-900/50 p-5 text-sm">
                    <div className="flex justify-between border-b border-gray-800 pb-3">
                      <span className="text-gray-400">Événement</span>
                      <span className="font-semibold text-white">{event.title}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-800 pb-3">
                      <span className="text-gray-400">Date</span>
                      <span className="text-gray-300">
                        {event.date} à {event.time}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-gray-800 pb-3">
                      <span className="text-gray-400">Lieu</span>
                      <span className="text-gray-300">{event.location}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-800 pb-3">
                      <span className="text-gray-400">Places</span>
                      <span className="text-white">{quantity}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-800 pb-3">
                      <span className="text-gray-400">Type de billet</span>
                      <span className="text-white">{ticketType}</span>
                    </div>
                    {!isFree && (
                      <div className="flex justify-between border-b border-gray-800 pb-3">
                        <span className="text-gray-400">Prix unitaire</span>
                        <span className="text-gray-300">{formatMAD(unitAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between pb-1">
                      <span className="text-gray-400">Total</span>
                      <span className="font-heading text-xl font-bold text-[#C9A84C]">
                        {isFree ? "Gratuit" : formatMAD(totalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Référence commande */}
                  {orderId && (
                    <p className="mt-4 text-xs text-gray-500">
                      Référence :{" "}
                      <span className="font-mono text-[#C9A84C]">{orderId}</span>
                      {" — Statut : "}
                      <span className="text-yellow-400">En attente</span>
                    </p>
                  )}

                  {error && (
                    <p className="mt-4 rounded-md bg-red-500/10 px-3 py-2 text-xs text-red-400">
                      {error}
                    </p>
                  )}

                  {/* Section action */}
                  <div className="mt-8 space-y-4">
                    {isFree ? (
                      /* Événement gratuit : confirmation directe (pending → reserved) */
                      <button
                        onClick={handleConfirm}
                        disabled={confirming}
                        className={`flex w-full items-center justify-center gap-2 rounded-lg p-4 text-sm font-semibold transition-all ${
                          confirming
                            ? "cursor-not-allowed bg-gray-700 text-gray-400"
                            : "bg-[#C9A84C] text-black hover:bg-[#F0CB6A] hover:shadow-md hover:shadow-[#C9A84C]/30 active:scale-[0.98]"
                        }`}
                      >
                        {confirming ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                            Confirmation…
                          </>
                        ) : (
                          "Confirmer la réservation"
                        )}
                      </button>
                    ) : (
                      /* Événement payant : redirection vers le paiement carte CMI */
                      <button
                        onClick={handlePayCmi}
                        disabled={paying}
                        className={`flex w-full items-center justify-center gap-2 rounded-lg p-4 text-sm font-semibold transition-all ${
                          paying
                            ? "cursor-not-allowed bg-gray-700 text-gray-400"
                            : "bg-[#C9A84C] text-black hover:bg-[#F0CB6A] hover:shadow-md hover:shadow-[#C9A84C]/30 active:scale-[0.98]"
                        }`}
                      >
                        {paying ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                            Redirection vers le paiement…
                          </>
                        ) : (
                          <>
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                            </svg>
                            Payer par carte bancaire (CMI)
                          </>
                        )}
                      </button>
                    )}

                    {!isFree && (
                      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-gray-500">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Paiement sécurisé 3D Secure via CMI
                      </p>
                    )}
                  </div>

                  {/* Retour */}
                  <div className="mt-6 text-center">
                    <Link
                      href="/billetterie/reserver"
                      className="text-sm text-gray-500 underline hover:text-gray-300"
                    >
                      ← Modifier ma réservation
                    </Link>
                  </div>
                </>
              )}
            </motion.div>

            <p className="mt-6 text-center text-xs text-gray-600">
              {isFree
                ? "Cet événement est gratuit. Votre réservation sera confirmée immédiatement."
                : "Vous allez être redirigé vers la plateforme de paiement sécurisée CMI pour régler par carte bancaire."}
            </p>
          </div>
        </div>
      </main>
    </>
  );
}