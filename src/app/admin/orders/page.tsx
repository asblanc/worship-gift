"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";

interface Order {
  id: string;
  customer_email: string;
  customer_name: string;
  description: string;
  amount: number;
  status: string;
  created_at: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let query = supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });

        if (statusFilter !== "all") {
          query = query.eq("status", statusFilter);
        }

        const { data } = await query;
        if (data) setOrders(data);
      } catch {
        // Table inexistante
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [statusFilter]);

  const formatMAD = (cents: number) =>
    new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD" }).format(cents / 100);

  const statusBadge = (s: string) => {
    const map: Record<string, { label: string; classes: string }> = {
      pending: { label: "En attente", classes: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
      reserved: { label: "Confirmée", classes: "bg-green-500/10 text-green-400 border-green-500/20" },
      paid: { label: "Payée", classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
      cancelled: { label: "Annulée", classes: "bg-red-500/10 text-red-400 border-red-500/20" },
      failed: { label: "Échouée", classes: "bg-red-500/10 text-red-400 border-red-500/20" },
    };
    const info = map[s] || { label: s, classes: "bg-gray-500/10 text-gray-400 border-gray-500/20" };
    return (
      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${info.classes}`}>
        {info.label}
      </span>
    );
  };

  const statuses = [
    { value: "all", label: "Toutes" },
    { value: "pending", label: "En attente" },
    { value: "reserved", label: "Confirmées" },
    { value: "paid", label: "Payées" },
    { value: "cancelled", label: "Annulées" },
  ];

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-white">Commandes</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gérez toutes les commandes de la billetterie.
        </p>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button
            key={s.value}
            onClick={() => setStatusFilter(s.value)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
              statusFilter === s.value
                ? "border-[#C9A84C]/40 bg-[#C9A84C]/10 text-[#C9A84C]"
                : "border-white/[0.06] text-gray-500 hover:border-white/10 hover:text-gray-300"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#C9A84C] border-t-transparent" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <p className="text-sm text-gray-600">
            {statusFilter === "all" ? "Aucune commande." : "Aucune commande dans cette catégorie."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/[0.06] bg-white/[0.01]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.04] text-left text-xs font-medium text-gray-600">
                <th className="px-4 py-3">Référence</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 text-right">Montant</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-white/[0.02] transition-colors hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-gray-500">{order.id.slice(0, 12)}…</span>
                  </td>
                  <td className="px-4 py-3 text-white max-w-[140px] truncate">
                    {order.customer_name || order.customer_email || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-400 max-w-[180px] truncate">
                    {order.description || "—"}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-[#C9A84C]">
                    {order.amount === 0 ? "Gratuit" : formatMAD(order.amount)}
                  </td>
                  <td className="px-4 py-3">{statusBadge(order.status)}</td>
                  <td className="px-4 py-3 text-right text-xs text-gray-600">
                    {new Date(order.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-xs text-[#C9A84C] transition-colors hover:text-[#F0CB6A]"
                    >
                      Détails →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}