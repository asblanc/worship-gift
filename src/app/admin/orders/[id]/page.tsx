"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

/* ================================================================
   Worship Gift — /admin/orders/[id] — Détail commande admin
   Permet de voir les infos client + billets + changer le statut.
   ================================================================ */

interface OrderDetail {
  id: string;
  customer_name: string;
  customer_email: string;
  description: string;
  amount: number;
  currency: string;
  status: string;
  payment_provider: string;
  transaction_id: string | null;
  error_code: string | null;
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

const ALL_STATUSES = ["pending", "reserved", "paid", "cancelled", "failed"] as const;

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        const { data: o } = await supabase
          .from("orders")
          .select("*")
          .eq("id", id)
          .single();
        if (o) setOrder(o);

        const { data: t } = await supabase
          .from("tickets")
          .select("*")
          .eq("order_id", id);
        if (t) setTickets(t);
      } catch {
        // tables inexistantes
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    try {
      const updateData: Record<string, unknown> = { status: newStatus };
      if (newStatus === "paid") {
        updateData.paid_at = new Date().toISOString();
      }
      const { error } = await supabase
        .from("orders")
        .update(updateData)
        .eq("id", id);
      if (error) throw error;
      setOrder((prev) => (prev ? { ...prev, status: newStatus } : prev));
    } catch (err) {
      console.error("Erreur changement statut:", err);
    } finally {
      setUpdating(false);
    }
  };

  const formatMAD = (cents: number) =>
    new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD" }).format(cents / 100);

  const statusLabel = (s: string) => {
    const map: Record<string, string> = {
      pending: "En attente",
      reserved: "Confirmée",
      paid: "Payée",
      cancelled: "Annulée",
      failed: "Échouée",
    };
    return map[s] || s;
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
        <Link href="/admin/orders" className="text-xs text-gray-400 hover:text-[#C9A84C]">← Retour</Link>
        <p className="text-gray-400">Commande introuvable.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/orders" className="text-xs text-gray-400 hover:text-[#C9A84C]">← Retour aux commandes</Link>

      {/* En-tête */}
      <div className="rounded-lg border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-white">{order.description}</h1>
            <p className="mt-1 font-mono text-sm text-gray-500">{order.id}</p>
            <p className="mt-1 text-sm text-gray-400">
              Commandé le {new Date(order.created_at).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="text-right">
            <p className="font-heading text-2xl font-bold text-[#C9A84C]">
              {order.amount === 0 ? "Gratuit" : formatMAD(order.amount)}
            </p>
          </div>
        </div>

        {/* Infos client */}
        <div className="mt-4 grid gap-3 rounded-lg bg-gray-900/50 p-4 text-sm sm:grid-cols-2">
          <div>
            <span className="text-gray-500">Client :</span>{" "}
            <span className="text-white">{order.customer_name}</span>
          </div>
          <div>
            <span className="text-gray-500">Email :</span>{" "}
            <span className="text-white">{order.customer_email}</span>
          </div>
          {order.transaction_id && (
            <div className="sm:col-span-2">
              <span className="text-gray-500">Transaction CMI :</span>{" "}
              <span className="font-mono text-[#C9A84C]">{order.transaction_id}</span>
              {order.paid_at && <span className="ml-2 text-gray-500">— Payé le {new Date(order.paid_at).toLocaleDateString("fr-FR")}</span>}
            </div>
          )}
        </div>

        {/* Changer le statut */}
        <div className="mt-6 border-t border-white/10 pt-4">
          <p className="text-sm font-medium text-gray-300 mb-3">Modifier le statut :</p>
          <div className="flex flex-wrap gap-2">
            {ALL_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                disabled={updating || order.status === s}
                className={`rounded-md px-4 py-2 text-xs font-semibold transition-all ${
                  order.status === s
                    ? "bg-[#C9A84C]/30 text-[#C9A84C] cursor-default"
                    : "border border-gray-700 text-gray-400 hover:border-[#C9A84C] hover:text-[#C9A84C] disabled:opacity-40"
                }`}
              >
                {statusLabel(s)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Billets */}
      <div className="rounded-lg border border-white/10 bg-white/5 p-6">
        <h2 className="font-heading text-lg font-semibold text-white">
          Billets ({tickets.length})
        </h2>
        {tickets.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">Aucun billet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="rounded-lg border border-[#C9A84C]/20 bg-[#C9A84C]/5 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-white">{ticket.event_title}</p>
                    <p className="mt-0.5 text-sm text-gray-400">
                      {ticket.event_date} à {ticket.event_time} — {ticket.event_location}
                    </p>
                    <p className="mt-1 text-sm text-gray-300">{ticket.ticket_type}</p>
                  </div>
                  <span className="rounded-md border border-[#C9A84C]/30 bg-black px-3 py-2 font-mono text-xs text-[#C9A84C]">
                    {ticket.ticket_code}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}