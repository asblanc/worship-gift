"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { upcomingEvents } from "@/lib/events-config";

/* ================================================================
   Worship Gift — /admin — Tableau de bord administrateur
   Stats : total commandes, montant payé, billets vendus, dernières commandes
   ================================================================ */

interface StatsData {
  totalOrders: number;
  totalPaid: number;
  totalTickets: number;
}

interface RecentOrder {
  id: string;
  customer_email: string;
  customer_name: string;
  description: string;
  amount: number;
  status: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsData>({
    totalOrders: 0,
    totalPaid: 0,
    totalTickets: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Stats commandes
        const { count: totalOrders, data: allOrders } = await supabase
          .from("orders")
          .select("amount, status", { count: "exact" });

        // Stats tickets
        const { count: totalTickets } = await supabase
          .from("tickets")
          .select("*", { count: "exact", head: true });

        const totalPaid =
          allOrders
            ?.filter((o) => o.status === "paid")
            .reduce((sum, o) => sum + (o.amount || 0), 0) || 0;

        setStats({
          totalOrders: totalOrders || 0,
          totalPaid,
          totalTickets: totalTickets || 0,
        });

        // Dernières commandes
        const { data: recent } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10);

        if (recent) setRecentOrders(recent);
      } catch {
        // Tables inexistantes
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#C9A84C] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-white">
          Tableau de bord
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          Vue d'ensemble de l'activité Worship Gift.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-gray-400">Commandes totales</p>
          <p className="mt-1 font-heading text-3xl font-bold text-white">
            {stats.totalOrders}
          </p>
        </div>
        <div className="rounded-lg border border-[#C9A84C]/20 bg-[#C9A84C]/5 p-5">
          <p className="text-sm text-gray-400">Montant payé</p>
          <p className="mt-1 font-heading text-3xl font-bold text-[#C9A84C]">
            {formatMAD(stats.totalPaid)}
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-gray-400">Billets émis</p>
          <p className="mt-1 font-heading text-3xl font-bold text-white">
            {stats.totalTickets}
          </p>
        </div>
      </div>

      {/* Événements à venir */}
      <div className="rounded-lg border border-white/10 bg-white/5 p-6">
        <h2 className="font-heading text-lg font-semibold text-white">
          Événements programmés
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {upcomingEvents.map((evt) => (
            <div
              key={evt.id}
              className="rounded-lg border border-white/10 bg-black/30 p-4"
            >
              <p className="font-semibold text-white text-sm">{evt.title}</p>
              <p className="mt-1 text-xs text-gray-400">
                {evt.date} à {evt.time} — {evt.location}
              </p>
              <p className="mt-1 text-xs text-[#C9A84C]">{evt.price}</p>
            </div>
          ))}
        </div>
        <Link
          href="/admin/events"
          className="mt-4 inline-block text-xs text-[#C9A84C] hover:underline"
        >
          Gérer les événements →
        </Link>
      </div>

      {/* Dernières commandes */}
      <div className="rounded-lg border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-white">
            Dernières commandes
          </h2>
          <Link
            href="/admin/orders"
            className="text-xs text-[#C9A84C] hover:underline"
          >
            Voir tout →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">Aucune commande.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs text-gray-400">
                  <th className="pb-2 font-medium">ID</th>
                  <th className="pb-2 font-medium">Client</th>
                  <th className="pb-2 font-medium">Description</th>
                  <th className="pb-2 font-medium text-right">Montant</th>
                  <th className="pb-2 font-medium">Statut</th>
                  <th className="pb-2 font-medium text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5">
                    <td className="py-2 pr-2 font-mono text-xs text-gray-500 max-w-[100px] truncate">
                      {order.id}
                    </td>
                    <td className="py-2 pr-2 text-white max-w-[120px] truncate">
                      {order.customer_name || order.customer_email}
                    </td>
                    <td className="py-2 pr-2 text-gray-300 max-w-[150px] truncate">
                      {order.description}
                    </td>
                    <td className="py-2 pr-2 text-right text-[#C9A84C]">
                      {order.amount === 0
                        ? "Gratuit"
                        : formatMAD(order.amount)}
                    </td>
                    <td className="py-2 pr-2">
                      <span className={statusBadge(order.status)}>
                        {statusLabel(order.status)}
                      </span>
                    </td>
                    <td className="py-2 text-right text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}