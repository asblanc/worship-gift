"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/supabase/auth-context";
import TicketQR from "@/components/TicketQR";

/* ================================================================
   Worship Gift — Page Success (retour CMI OK)
   
   L'utilisateur arrive ici apres un paiement reussi via CMI.
   URL: /billetterie/success?order=WG-20260528-001
   
   Cette page :
   1. Affiche une confirmation
   2. Verifie le statut de la commande dans Supabase
   3. Propose de voir ses billets dans le dashboard
   ================================================================ */

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const orderId = searchParams.get("order") || "";

  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<
    { ticket_code: string; event_title: string; ticket_type: string }[]
  >([]);

  // Verifier la commande via la route serveur (fonctionne aussi pour
  // un invité non connecté, contrairement à une lecture directe sous RLS).
  useEffect(() => {
    const checkOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.order?.status) setOrderStatus(data.order.status);
          if (Array.isArray(data.tickets)) setTickets(data.tickets);
        }
      } catch {
        // Erreur réseau — on affiche quand même la confirmation
      } finally {
        setLoading(false);
      }
    };

    checkOrder();
  }, [orderId]);

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col bg-black pt-20">
        <div className="flex-1 px-4 py-8 md:py-16">
          <div className="mx-auto max-w-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="rounded-xl border border-[#C9A84C]/30 bg-black/50 p-8 text-center backdrop-blur-sm"
            >
              {/* Icône succès */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#C9A84C] to-[#F0CB6A]"
              >
                <svg
                  className="h-10 w-10 text-black"
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

              <h1 className="font-heading text-3xl font-bold text-white md:text-4xl">
                Paiement confirme !
              </h1>
              <p className="mt-3 text-gray-300">
                Votre paiement a ete traite avec succes. Merci pour votre
                confiance.
              </p>

              {loading ? (
                <div className="mt-6 flex justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#C9A84C] border-t-transparent" />
                </div>
              ) : (
                <>
                  {/* Infos commande */}
                  {orderId && (
                    <div className="mt-6 rounded-lg bg-gray-900/50 p-4 text-sm">
                      <p className="text-gray-300">
                        Reference de commande :
                        <span className="ml-1 font-mono font-semibold text-white">
                          {orderId}
                        </span>
                      </p>
                      {orderStatus && (
                        <p className="mt-1 text-gray-300">
                          Statut :
                          <span className="ml-1 font-semibold text-green-400">
                            {orderStatus === "paid" ? "Paye" : orderStatus}
                          </span>
                        </p>
                      )}
                    </div>
                  )}

                  {/* Billets generes */}
                  {tickets.length > 0 && (
                    <div className="mt-6 space-y-2">
                      <p className="text-sm font-medium text-gray-300">
                        Vos billets :
                      </p>
                      {tickets.map((ticket) => (
                        <div
                          key={ticket.ticket_code}
                          className="flex items-center gap-3 rounded-lg border border-[#C9A84C]/20 bg-[#C9A84C]/5 p-3 text-left"
                        >
                          <TicketQR code={ticket.ticket_code} size={88} />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white">
                              {ticket.event_title}
                            </p>
                            <p className="text-xs text-gray-300">
                              {ticket.ticket_type}
                            </p>
                            <p className="mt-0.5 truncate font-mono text-[11px] text-[#C9A84C]">
                              {ticket.ticket_code}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Actions */}
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
                    Creer un compte pour suivre mes billets
                  </Link>
                )}
                <Link
                  href="/"
                  className="inline-flex h-11 items-center justify-center rounded-md border border-gray-600 px-6 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800"
                >
                  Retour a l'accueil
                </Link>
              </div>

              {/* Note */}
              <p className="mt-6 text-xs text-gray-300">
                Vous recevrez un email de confirmation avec vos billets a
                l'adresse fournie lors du paiement.
              </p>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
}