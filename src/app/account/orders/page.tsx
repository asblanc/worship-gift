"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

/* ================================================================
   Worship Gift — /account/orders — Liste complète des commandes
   ================================================================ */

interface OrderRow {
  id: string;
  description: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user?.email) return;

        const { data } = await supabase
          .from("orders")
          .select("id, description, amount, currency, status, created_at")
          .eq("customer_email", user.email)
          .order("created_at", { ascending: false });

        if (data) setOrders(data);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
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
    const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ";
    const colors: Record<string, string> = {
      pending: "bg-yellow-400/10 text-yellow-400 border border-yellow-400/30",
      reserved: "bg-green-400/10 text-green-400 border border-green-400/30",
      paid: "bg-green-400/10 text-green-400 border border-green-400/30",
      cancelled: "bg-red-400/10 text-red-400 border border-red-400/30",
      failed: "bg-red-400/10 text-red-400 border border-red-400/30",
    };
    return base + (colors[s] || "bg-gray-400/10 text-gray-400 border border-gray-400/30");
  };

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
          Mes commandes
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          Historique complet de vos réservations et achats.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-700 p-10 text-center">
          <p className="text-gray-400">Aucune commande trouvée.</p>
          <Link
            href="/billetterie"
            className="mt-4 inline-flex h-10 items-center rounded-md bg-[#C9A84C] px-5 text-sm font-semibold text-black hover:bg-[#F0CB6A]"
          >
            Réserver des billets
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-white/10">
          {/* Table header (hidden mobile) */}
          <div className="hidden border-b border-white/10 bg-white/5 px-5 py-3 text-xs font-medium text-gray-400 sm:grid sm:grid-cols-[2fr_1fr_1fr_100px]">
            <span>Commande</span>
            <span>Montant</span>
            <span>Statut</span>
            <span className="text-right">Date</span>
          </div>

          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="block border-b border-white/5 px-5 py-4 transition-colors hover:bg-white/5 last:border-b-0"
            >
              {/* Mobile layout */}
              <div className="flex flex-col gap-1 sm:hidden">
                <p className="truncate text-sm font-medium text-white">
                  {order.description}
                </p>
                <div className="flex items-center gap-3 text-sm">
                  <span className="font-semibold text-[#C9A84C]">
                    {order.amount === 0 ? "Gratuit" : formatMAD(order.amount)}
                  </span>
                  <span className={statusBadge(order.status)}>
                    {statusLabel(order.status)}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  {new Date(order.created_at).toLocaleDateString("fr-FR")}
                </p>
              </div>

              {/* Desktop layout */}
              <div className="hidden sm:grid sm:grid-cols-[2fr_1fr_1fr_100px] sm:items-center sm:gap-4">
                <div>
                  <p className="truncate text-sm font-medium text-white">
                    {order.description}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-gray-400">
                    {order.id}
                  </p>
                </div>
                <span className="text-sm font-semibold text-[#C9A84C]">
                  {order.amount === 0 ? "Gratuit" : formatMAD(order.amount)}
                </span>
                <span className={statusBadge(order.status)}>
                  {statusLabel(order.status)}
                </span>
                <span className="text-right text-xs text-gray-400">
                  {new Date(order.created_at).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}