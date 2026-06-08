"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import TicketQR from "@/components/TicketQR";

/* ================================================================
   Worship Gift — /account/orders/[id] — Détail d'une commande
   Affiche : infos concert, billets, statut, total.
   ================================================================ */

interface OrderDetail {
  id: string;
  description: string;
  amount: number;
  currency: string;
  status: string;
  customer_name: string;
  customer_email: string;
  transaction_id: string | null;
  error_message: string | null;
  paid_at: string | null;
  created_at: string;
}

interface TicketRow {
  id: string;
  ticket_code: string;
  event_title: string;
  event_date: string;
  event_time: string;
  event_location: string;
  ticket_type: string;
  status: string;
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        // Récupérer la commande
        const { data: orderData } = await supabase
          .from("orders")
          .select("*")
          .eq("id", id)
          .single();

        if (orderData) {
          // Vérifier que c'est bien la commande de l'utilisateur connecté
          if (
            user?.email &&
            orderData.customer_email !== user.email
          ) {
            setOrder(null); // Pas autorisé
          } else {
            setOrder(orderData);
          }
        }

        // Récupérer les billets
        const { data: ticketData } = await supabase
          .from("tickets")
          .select("*")
          .eq("order_id", id);

        if (ticketData) setTickets(ticketData);
      } catch {
        // Table inexistante — pas de données
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const formatMAD = (cents: number) =>
    new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
    }).format(cents / 100);

  const statusLabel = (s: string) => {
    const map: Record<string, string> = {
      pending: "En attente de confirmation",
      reserved: "Confirmée",
      paid: "Payée",
      cancelled: "Annulée",
      failed: "Échouée",
    };
    return map[s] || s;
  };

  const statusBadge = (s: string) => {
    const base =
      "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ";
    const colors: Record<string, string> = {
      pending: "bg-yellow-400/15 text-yellow-400 border border-yellow-400/40",
      reserved: "bg-green-400/15 text-green-400 border border-green-400/40",
      paid: "bg-green-400/15 text-green-400 border border-green-400/40",
      cancelled: "bg-red-400/15 text-red-400 border border-red-400/40",
      failed: "bg-red-400/15 text-red-400 border border-red-400/40",
    };
    return base + (colors[s] || "bg-gray-400/15 text-gray-400");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#C9A84C] border-t-transparent" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <Link
          href="/account/orders"
          className="text-xs text-gray-400 hover:text-[#C9A84C]"
        >
          ← Retour aux commandes
        </Link>
        <div className="rounded-lg border border-dashed border-gray-700 p-10 text-center">
          <p className="text-gray-400">Commande introuvable.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Retour */}
      <Link
        href="/account/orders"
        className="text-xs text-gray-400 hover:text-[#C9A84C]"
      >
        ← Retour aux commandes
      </Link>

      {/* En-tête commande */}
      <div className="rounded-lg border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-white">
              {order.description}
            </h1>
            <p className="mt-1 font-mono text-sm text-gray-500">{order.id}</p>
            <p className="mt-1 text-sm text-gray-400">
              Commandé le{" "}
              {new Date(order.created_at).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className={statusBadge(order.status)}>
              {statusLabel(order.status)}
            </span>
            <span className="font-heading text-2xl font-bold text-[#C9A84C]">
              {order.amount === 0 ? "Gratuit" : formatMAD(order.amount)}
            </span>
          </div>
        </div>

        {/* Infos transaction si paiement CMI */}
        {order.transaction_id && (
          <div className="mt-4 rounded-md bg-gray-900/50 p-3 text-xs text-gray-400">
            Transaction CMI : {order.transaction_id}
            {order.paid_at && (
              <>
                {" — "}
                Payé le{" "}
                {new Date(order.paid_at).toLocaleDateString("fr-FR")}
              </>
            )}
          </div>
        )}

        {order.error_message && (
          <div className="mt-3 rounded-md bg-red-500/10 p-3 text-xs text-red-400">
            {order.error_message}
          </div>
        )}
      </div>

      {/* Billets */}
      <div className="rounded-lg border border-white/10 bg-white/5 p-6">
        <h2 className="font-heading text-lg font-semibold text-white">
          Billets ({tickets.length})
        </h2>

        {tickets.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">
            Les billets seront générés après confirmation du paiement.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="rounded-lg border border-[#C9A84C]/20 bg-[#C9A84C]/5 p-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-white">
                      {ticket.event_title}
                    </p>
                    <p className="mt-0.5 text-sm text-gray-400">
                      {ticket.event_date} à {ticket.event_time} —{" "}
                      {ticket.event_location}
                    </p>
                    <p className="mt-1 text-sm text-gray-300">
                      {ticket.ticket_type}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="rounded-md border border-[#C9A84C]/30 bg-black px-3 py-1.5 font-mono text-xs text-[#C9A84C]">
                        {ticket.ticket_code}
                      </span>
                      {ticket.status === "used" ? (
                        <span className="rounded-full bg-gray-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-gray-400">
                          Déjà utilisé
                        </span>
                      ) : ticket.status === "cancelled" ? (
                        <span className="rounded-full bg-red-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-red-400">
                          Annulé
                        </span>
                      ) : (
                        <span className="rounded-full bg-green-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-green-400">
                          Valide
                        </span>
                      )}
                    </div>
                  </div>
                  {/* QR code à présenter à l'entrée */}
                  <div className="flex flex-col items-center gap-1 self-center">
                    <TicketQR code={ticket.ticket_code} size={132} />
                    <span className="text-[10px] text-gray-500">À scanner à l&rsquo;entrée</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}