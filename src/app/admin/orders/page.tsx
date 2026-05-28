"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { upcomingEvents } from "@/lib/events-config";

/* ================================================================
   Worship Gift — /admin/orders — Gestion des commandes
   Filtres par statut et événement.
   ================================================================ */

interface OrderRow {
  id: string;
  customer_email: string;
  customer_name: string;
  description: string;
  amount: number;
  status: string;
  payment_provider: string;
  transaction_id: string | null;
  created_at: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [eventFilter, setEventFilter] = useState<string>("all");

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
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [statusFilter]);

  const formatMAD = (cents: number) =>
    new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
    }).format(cents / 100);

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

  const statusBadge = (s: string) => {
    const base =
      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ";
    const colors: Record<string, string> = {
      pending: "bg-yellow-400/10 text-yellow-400 border border-yellow-400/30",
      reserved: "bg-green-400/10 text-green-400 border border-green-400/30",
      paid: "bg-green-400/10 text-green-400 border border-green-400/30",
      cancelled: "bg-red-400/10 text-red-400 border border-red-400/30",
      failed: "bg-red-400/10 text-red-400 border border-red-400/30",
    };
    return base + (colors[s] || "");
  };

  // Filtrer par événement côté client (le champ description contient le titre)
  const filteredOrders =
    eventFilter === "all"
      ? orders
      : orders.filter((o) => o.description.includes(eventFilter));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#C9A84C] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-white">
          Commandes
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          {filteredOrders.length} commande(s) trouvée(s).
        </p>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-gray-700 bg-black px-3 py-2 text-xs text-white outline-none focus:border-[#C9A84C]"
        >
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="reserved">Confirmée</option>
          <option value="paid">Payée</option>
          <option value="cancelled">Annulée</option>
          <option value="failed">Échouée</option>
        </select>

        <select
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
          className="rounded-md border border-gray-700 bg-black px-3 py-2 text-xs text-white outline-none focus:border-[#C9A84C]"
        >
          <option value="all">Tous les événements</option>
          {upcomingEvents.map((evt) => (
            <option key={evt.id} value={evt.title}>
              {evt.title}
            </option>
          ))}
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-700 p-10 text-center">
          <p className="text-gray-400">Aucune commande trouvée.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-left text-xs text-gray-400">
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium text-right">Montant</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium text-right">Date</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-white/5">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500 max-w-[80px] truncate">
                    {order.id}
                  </td>
                  <td className="px-4 py-3 text-white max-w-[120px] truncate">
                    {order.customer_name || order.customer_email}
                  </td>
                  <td className="px-4 py-3 text-gray-300 max-w-[180px] truncate">
                    {order.description}
                  </td>
                  <td className="px-4 py-3 text-right text-[#C9A84C]">
                    {order.amount === 0
                      ? "Gratuit"
                      : formatMAD(order.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={statusBadge(order.status)}>
                      {statusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-xs text-[#C9A84C] hover:underline"
                    >
                      Détail →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}