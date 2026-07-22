"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { upcomingEvents } from "@/lib/events-config";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import { Skeleton } from "@/components/Skeleton";

/* ================================================================
   Worship Gift — /account — Tableau de bord utilisateur
   Affiche :
   - Nombre de billets à venir (commandes reserved/paid)
   - Prochain concert
   - Dernières commandes
   ================================================================ */

interface OrderSummary {
  id: string;
  description: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
}

export default function AccountPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [stats, setStats] = useState({ ticketCount: 0, paidCount: 0 });
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
          .order("created_at", { ascending: false })
          .limit(20);

        // Comptage RÉEL des billets valides (table tickets), pas une
        // approximation à partir du nombre de commandes.
        const { count: ticketCount } = await supabase
          .from("tickets")
          .select("id", { count: "exact", head: true })
          .eq("customer_email", user.email)
          .eq("status", "valid");

        if (data) {
          setOrders(data);
          setStats({
            ticketCount: ticketCount ?? 0,
            paidCount: data.filter((o) => o.status === "paid").length,
          });
        }
      } catch {
        // Table peut ne pas exister encore
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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

  const statusColor = (s: string) => {
    const map: Record<string, string> = {
      pending: "text-yellow-400",
      reserved: "text-green-400",
      paid: "text-green-400",
      cancelled: "text-red-400",
      failed: "text-red-400",
    };
    return map[s] || "text-gray-300";
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="space-y-3 rounded-lg border border-white/10 bg-white/[0.08] p-6">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="t-h2 text-white">Mon espace</h1>
        <p className="mt-1 text-sm text-gray-300">
          Retrouvez vos billets et commandes.
        </p>
      </div>

      {/* Stats rapides */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-[#C9A84C]/20 bg-[#C9A84C]/5 p-5">
          <p className="text-sm text-gray-300">Billets à venir</p>
          <p className="mt-1 font-heading text-3xl font-bold text-[#C9A84C]">
            {stats.ticketCount}
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.08] p-5">
          <p className="text-sm text-gray-300">Prochains événements</p>
          <p className="mt-1 font-heading text-lg font-semibold text-white">
            {upcomingEvents[0]?.title || "Aucun événement à venir"}
          </p>
          {upcomingEvents[0] && (
            <p className="mt-1 text-xs text-gray-300">
              {upcomingEvents[0].date} — {upcomingEvents[0].location}
            </p>
          )}
        </div>
      </div>

      {/* Dernières commandes */}
      <div className="rounded-lg border border-white/10 bg-white/[0.08] p-6">
        <div className="flex items-center justify-between">
          <h2 className="t-h3 text-white">
            Mes commandes récentes
          </h2>
          {orders.length > 0 && (
            <Link
              href="/account/orders"
              className="text-xs text-[#C9A84C] hover:underline"
            >
              Voir tout →
            </Link>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed border-gray-700 p-8 text-center">
            <p className="text-gray-300">Aucune commande pour le moment.</p>
            <Link
              href="/billetterie"
              className="mt-4 inline-flex h-10 items-center rounded-md bg-[#C9A84C] px-5 text-sm font-semibold text-black hover:bg-[#F0CB6A]"
            >
              Réserver des billets
            </Link>
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            {orders.slice(0, 5).map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between rounded-lg border border-white/5 p-4 transition-colors hover:bg-white/[0.08]"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    {order.description}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-300">
                    {new Date(order.created_at).toLocaleDateString("fr-FR")} —{" "}
                    <span className="font-mono text-[#C9A84C]">{order.id}</span>
                  </p>
                </div>
                <div className="ml-4 flex items-center gap-4">
                  <span className="text-sm font-semibold text-white">
                    {order.amount === 0 ? "Gratuit" : formatMAD(order.amount)}
                  </span>
                  <span className={`text-xs font-medium ${statusColor(order.status)}`}>
                    {statusLabel(order.status)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Sécurité — changer le mot de passe */}
      <ChangePasswordForm />
    </div>
  );
}