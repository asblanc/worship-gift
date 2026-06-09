"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";

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

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
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
      pending: "En attente", reserved: "Confirmée", paid: "Payée",
      cancelled: "Annulée", failed: "Échouée",
    };
    return map[s] || s;
  };

  const statusColor = (s: string) => {
    const map: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      reserved: "bg-green-500/10 text-green-400 border-green-500/20",
      paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
      failed: "bg-red-500/10 text-red-400 border-red-500/20",
    };
    return map[s] || "bg-gray-500/10 text-gray-400 border-gray-500/20";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#C9A84C] border-t-transparent" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <Link href="/admin/orders" className="inline-flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-[#C9A84C]">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Retour
        </Link>
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-sm text-gray-400">Commande introuvable.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-6">
      <Link href="/admin/orders" className="inline-flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-[#C9A84C]">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
        </svg>
        Retour aux commandes
      </Link>

      {/* Détail commande */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.01] p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <h1 className="font-heading text-2xl font-bold text-white">{order.description || "Commande"}</h1>
            <p className="font-mono text-xs text-gray-400">{order.id}</p>
            <p className="text-xs text-gray-400">
              {new Date(order.created_at).toLocaleDateString("fr-FR", {
                year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
              })}
            </p>
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${statusColor(order.status)}`}>
              {statusLabel(order.status)}
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-gray-400">Montant</p>
            <p className="font-heading text-2xl font-bold text-[#C9A84C]">
              {order.amount === 0 ? "Gratuit" : formatMAD(order.amount)}
            </p>
          </div>
        </div>

        {/* Infos client */}
        <div className="mt-6 grid gap-3 rounded-lg border border-white/[0.04] bg-black/20 p-4 text-sm sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="text-gray-400">Client :</span>
            <span className="font-medium text-white">{order.customer_name || "—"}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span className="text-gray-400">Email :</span>
            <span className="font-medium text-white">{order.customer_email || "—"}</span>
          </div>
          {order.transaction_id && (
            <div className="flex items-center gap-2 sm:col-span-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" />
                <polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" />
                <line x1="4" y1="4" x2="9" y2="9" />
              </svg>
              <span className="text-gray-400">Transaction :</span>
              <span className="font-mono text-xs text-[#C9A84C]">{order.transaction_id}</span>
              {order.paid_at && (
                <span className="text-xs text-gray-400">
                  — Payé le {new Date(order.paid_at).toLocaleDateString("fr-FR")}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Changer statut */}
        <div className="mt-6 border-t border-white/[0.04] pt-6">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-3">Modifier le statut</p>
          <div className="flex flex-wrap gap-2">
            {ALL_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                disabled={updating || order.status === s}
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                  order.status === s
                    ? "bg-[#C9A84C]/15 text-[#C9A84C] border border-[#C9A84C]/20 cursor-default"
                    : "border border-white/[0.06] text-gray-400 hover:border-[#C9A84C]/30 hover:text-[#C9A84C] disabled:opacity-30"
                }`}
              >
                {statusLabel(s)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Billets */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.01] p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C9A84C]/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 5v2" /><path d="M15 11v2" /><path d="M15 17v2" />
              <path d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z" />
            </svg>
          </div>
          <h2 className="font-heading text-lg font-semibold text-white">
            Billets ({tickets.length})
          </h2>
        </div>

        {tickets.length === 0 ? (
          <div className="mt-6 flex flex-col items-center gap-2 py-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 5v2" /><path d="M15 11v2" /><path d="M15 17v2" />
              <path d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z" />
            </svg>
            <p className="text-sm text-gray-400">Aucun billet pour cette commande.</p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="rounded-lg border border-[#C9A84C]/10 bg-[#C9A84C]/[0.02] p-4 transition-all hover:border-[#C9A84C]/20">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">{ticket.event_title || "Événement"}</p>
                    {(ticket.event_date || ticket.event_time || ticket.event_location) && (
                      <p className="text-xs text-gray-400">
                        {[ticket.event_date, ticket.event_time, ticket.event_location].filter(Boolean).join(" — ")}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">{ticket.ticket_type || "Entrée libre"}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-lg border border-[#C9A84C]/20 bg-black/30 px-3 py-2 font-mono text-xs text-[#C9A84C]">
                      {ticket.ticket_code}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}