"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import { upcomingEvents } from "@/lib/events-config";

interface StatsData {
  totalOrders: number;
  totalPaid: number;
  totalTickets: number;
  totalScanned: number;
  deliveriesToHonor: number;
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

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsData>({ totalOrders: 0, totalPaid: 0, totalTickets: 0, totalScanned: 0, deliveriesToHonor: 0 });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { count: totalOrders, data: allOrders } = await supabase
          .from("orders")
          .select("amount, status, payment_method", { count: "exact" });

        const { count: totalTickets } = await supabase
          .from("tickets")
          .select("*", { count: "exact", head: true });

        const { count: totalScanned } = await supabase
          .from("tickets")
          .select("*", { count: "exact", head: true })
          .eq("status", "used");

        const totalPaid =
          allOrders
            ?.filter((o) => o.status === "paid")
            .reduce((sum, o) => sum + (o.amount || 0), 0) || 0;

        // Livraisons à honorer : commandes « à la livraison » pas encore payées
        const deliveriesToHonor =
          allOrders?.filter(
            (o) =>
              o.payment_method === "delivery" &&
              (o.status === "pending" || o.status === "reserved"),
          ).length || 0;

        setStats({
          totalOrders: totalOrders || 0,
          totalPaid,
          totalTickets: totalTickets || 0,
          totalScanned: totalScanned || 0,
          deliveriesToHonor,
        });

        const { data: recent } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(6);

        if (recent) setRecentOrders(recent);
      } catch {
        // Tables pas encore créées — valeurs par défaut
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-8">
      {/* En-tête */}
      <motion.div variants={fadeUp}>
        <h1 className="t-h2 text-white">
          Tableau de bord
        </h1>
            <p className="mt-1 text-sm text-gray-400">
              Vue d&rsquo;ensemble de l&rsquo;activité Worship Gift.
            </p>
      </motion.div>

      {/* Stats cards */}
      {loading ? (
        <div className="flex justify-center py-12">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#C9A84C] border-t-transparent" />
        </div>
      ) : (
        <motion.div variants={stagger} className="grid gap-4 sm:grid-cols-3">
          <motion.div variants={fadeUp} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.03]">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-400">Commandes totales</p>
                <p className="font-heading text-2xl font-bold text-white">{stats.totalOrders}</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="rounded-xl border border-[#C9A84C]/20 bg-[#C9A84C]/5 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#C9A84C]/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-400">Montant payé</p>
                <p className="font-heading text-2xl font-bold text-[#C9A84C]">{formatMAD(stats.totalPaid)}</p>
              </div>
            </div>
          </motion.div>

          {/* Commandes à transmettre au prestataire (livraison non traitée) */}
          <motion.div
            variants={fadeUp}
            className={`rounded-xl border p-6 backdrop-blur-sm ${
              stats.deliveriesToHonor > 0
                ? "border-[#25D366]/25 bg-[#25D366]/[0.06]"
                : "border-white/[0.06] bg-white/[0.02]"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stats.deliveriesToHonor > 0 ? "bg-[#25D366]/15" : "bg-white/[0.03]"}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stats.deliveriesToHonor > 0 ? "#25D366" : "#C9A84C"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-400">À transmettre au prestataire</p>
                <p className={`font-heading text-2xl font-bold ${stats.deliveriesToHonor > 0 ? "text-[#25D366]" : "text-white"}`}>
                  {stats.deliveriesToHonor}
                </p>
                <p className="mt-0.5 text-[11px] text-gray-400">commandes livraison à traiter</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Billetterie & paiement — géré par le prestataire billetteries.ma */}
      {!loading && (
        <motion.div variants={fadeUp} className="rounded-xl border border-white/[0.06] bg-white/[0.01] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.03]">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </div>
              <div>
                <p className="t-card-title text-white">Billetterie & paiement en ligne</p>
                <p className="text-xs text-gray-400">
                  Vente, paiement et émission des billets gérés par billetteries.ma
                </p>
              </div>
            </div>
            <Link
              href="/billetterie/en-ligne"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-3 py-1 text-[11px] font-semibold text-[#C9A84C] transition-colors hover:bg-[#C9A84C]/20"
            >
              Voir la page d&rsquo;achat →
            </Link>
          </div>
          <p className="mt-4 rounded-lg border border-white/[0.06] bg-black/20 p-3 text-xs leading-relaxed text-gray-300">
            Les billets (en ligne <strong className="text-white">et</strong> livraison) sont émis et
            contrôlés à l&rsquo;entrée par billetteries.ma. Pour changer d&rsquo;événement, mets à jour le
            code d&rsquo;intégration dans <span className="font-mono text-[11px] text-[#C9A84C]">src/lib/ticketing-config.ts</span>.
          </p>
        </motion.div>
      )}

      {/* Mise en route — affiché tant qu'aucune commande n'existe */}
      {!loading && stats.totalOrders === 0 && (
        <motion.div variants={fadeUp} className="rounded-xl border border-[#C9A84C]/15 bg-[#C9A84C]/[0.03] p-6">
          <h2 className="t-card-title text-white">Mise en route</h2>
          <p className="mt-1 text-xs text-gray-400">
            Aucune commande pour l&rsquo;instant. Voici les étapes pour être prêt à vendre.
          </p>
          <ul className="mt-5 space-y-3">
            {[
              {
                done: upcomingEvents.length > 0,
                title: "Configurer l'événement",
                desc: "Chantre, date, salle et catégories de billets sont définis dans events-config.",
                href: "/admin/events",
                cta: "Événements",
              },
              {
                done: true,
                title: "Billetterie en ligne connectée",
                desc: "Vente et paiement gérés par billetteries.ma (widget intégré). Le lien est configuré dans ticketing-config.ts.",
                href: "/billetterie/en-ligne",
                cta: "Voir la page d'achat",
              },
              {
                done: false,
                title: "Recevoir la première commande à la livraison",
                desc: "Le client envoie ses infos par WhatsApp ; elles apparaissent ici pour être transmises au prestataire.",
                href: "/billetterie",
                cta: "Voir la billetterie",
              },
            ].map((step) => (
              <li key={step.title} className="flex items-start gap-3">
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                    step.done
                      ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                      : "border-white/15 text-gray-500"
                  }`}
                >
                  {step.done ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">
                    {step.title}
                    {step.href && step.cta && (
                      <Link href={step.href} className="ml-2 text-xs font-normal text-[#C9A84C] hover:text-[#F0CB6A]">
                        {step.cta} →
                      </Link>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">{step.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Événements programmés */}
      <motion.div variants={fadeUp} className="rounded-xl border border-white/[0.06] bg-white/[0.01] p-6">
        <div className="flex items-center justify-between">
          <h2 className="t-card-title text-white">Événements programmés</h2>
          <Link href="/admin/events" className="text-xs text-[#C9A84C] transition-colors hover:text-[#F0CB6A]">
            Gérer →
          </Link>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {upcomingEvents.map((evt) => (
            <div
              key={evt.id}
              className="rounded-lg border border-white/[0.04] bg-black/20 p-4 transition-all hover:border-[#C9A84C]/20"
            >
              <p className="text-sm font-semibold text-white">{evt.title}</p>
              <p className="mt-1 text-xs text-gray-400">
                {evt.date} à {evt.time} — {evt.location}
              </p>
              <p className="mt-1 text-xs font-medium text-[#C9A84C]">{evt.price}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Dernières commandes */}
      <motion.div variants={fadeUp} className="rounded-xl border border-white/[0.06] bg-white/[0.01] p-6">
        <div className="flex items-center justify-between">
          <h2 className="t-card-title text-white">Dernières commandes</h2>
          <Link href="/admin/orders" className="text-xs text-[#C9A84C] transition-colors hover:text-[#F0CB6A]">
            Tout voir →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="mt-6 flex flex-col items-center gap-2 py-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <p className="text-sm text-gray-400">Aucune commande pour le moment.</p>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.04] text-left text-xs font-medium text-gray-400">
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Description</th>
                  <th className="pb-3 text-right">Montant</th>
                  <th className="pb-3">Statut</th>
                  <th className="pb-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-white/[0.02] transition-colors hover:bg-white/[0.01]">
                    <td className="py-3 pr-3 text-white max-w-[140px] truncate">
                      {order.customer_name || order.customer_email || "—"}
                    </td>
                    <td className="py-3 pr-3 text-gray-400 max-w-[180px] truncate">
                      {order.description || "—"}
                    </td>
                    <td className="py-3 pr-3 text-right font-mono text-xs text-[#C9A84C]">
                      {order.amount === 0 ? "Gratuit" : formatMAD(order.amount)}
                    </td>
                    <td className="py-3 pr-3">{statusBadge(order.status)}</td>
                    <td className="py-3 text-right text-xs text-gray-400">
                      {new Date(order.created_at).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}