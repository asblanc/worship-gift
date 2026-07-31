"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";

interface Order {
  id: string;
  customer_email: string | null;
  customer_name: string;
  customer_phone: string | null;
  description: string;
  ticket_type: string | null;
  quantity: number | null;
  amount: number;
  payment_method: string | null;
  status: string;
  created_at: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const STATUS_LABEL: Record<string, string> = {
  pending: "En attente",
  reserved: "Confirmée",
  paid: "Payée",
  cancelled: "Annulée",
  failed: "Échouée",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [notifying, setNotifying] = useState(false);
  const [notifyMsg, setNotifyMsg] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [testing, setTesting] = useState(false);
  const [testMsg, setTestMsg] = useState("");

  // Test de configuration Resend : envoie un e-mail à l'adresse saisie
  const sendTest = async () => {
    if (!testEmail.trim()) return;
    setTesting(true);
    setTestMsg("");
    try {
      const res = await fetch("/api/admin/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: testEmail.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestMsg(`✅ E-mail de test envoyé à ${testEmail.trim()} — vérifie la boîte (et les spams).`);
      } else {
        setTestMsg(`⚠️ Échec : ${data.error || "erreur inconnue"}`);
      }
    } catch {
      setTestMsg("⚠️ Erreur réseau.");
    } finally {
      setTesting(false);
    }
  };

  // Envoi groupé de l'e-mail « commande reçue » (hors commandes de test)
  const notifyClients = async () => {
    if (!confirm("Envoyer l'e-mail « commande reçue / traitement en cours » à TOUS les clients (hors commandes de test) ? À ne faire qu'une fois pour les commandes déjà passées — les futures sont notifiées automatiquement.")) return;
    setNotifying(true);
    setNotifyMsg("");
    try {
      const res = await fetch("/api/admin/orders/notify", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        setNotifyMsg(`✅ E-mails envoyés : ${data.sent} · ignorés (sans e-mail ou test) : ${data.skipped}`);
      } else {
        setNotifyMsg(`⚠️ ${data.error || "Échec de l'envoi."}`);
      }
    } catch {
      setNotifyMsg("⚠️ Erreur réseau.");
    } finally {
      setNotifying(false);
    }
  };

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

  const qtyOf = (o: Order) => Math.max(1, o.quantity ?? 1);
  const unitOf = (o: Order) => o.amount / qtyOf(o);
  const methodLabel = (o: Order) => (o.payment_method === "delivery" ? "Livraison" : "En ligne");

  // Totaux (sur la sélection affichée)
  const totals = orders.reduce(
    (acc, o) => {
      acc.count += 1;
      acc.tickets += qtyOf(o);
      acc.amount += o.amount || 0;
      return acc;
    },
    { count: 0, tickets: 0, amount: 0 },
  );

  // Export CSV enrichi (coordonnées + catégorie + quantité + prix)
  const exportCsv = () => {
    const headers = [
      "Référence", "Nom", "Téléphone", "Email", "Catégorie",
      "Quantité", "Prix unitaire (MAD)", "Montant total (MAD)", "Paiement", "Statut", "Date",
    ];
    const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
    const rows = orders.map((o) =>
      [
        o.id,
        o.customer_name || "",
        o.customer_phone || "",
        o.customer_email || "",
        o.ticket_type || "",
        String(qtyOf(o)),
        (unitOf(o) / 100).toFixed(2),
        (o.amount / 100).toFixed(2),
        methodLabel(o),
        STATUS_LABEL[o.status] || o.status,
        new Date(o.created_at).toLocaleString("fr-FR"),
      ].map(escape).join(","),
    );
    const csv = "﻿" + [headers.map(escape).join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `commandes-worship-gift-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      reserved: "bg-green-500/10 text-green-400 border-green-500/20",
      paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
      failed: "bg-red-500/10 text-red-400 border-red-500/20",
    };
    return (
      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${map[s] || "bg-gray-500/10 text-gray-400 border-gray-500/20"}`}>
        {STATUS_LABEL[s] || s}
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
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="t-h2 text-white">Commandes</h1>
          <p className="mt-1 text-sm text-gray-400">
            Coordonnées des clients, quantité et prix. Exporte ou imprime la liste.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={notifyClients}
            disabled={notifying || orders.length === 0}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
              notifying || orders.length === 0
                ? "cursor-not-allowed bg-gray-700 text-gray-400"
                : "bg-[#C4161C] text-white hover:bg-[#e0272d]"
            }`}
          >
            {notifying ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/50 border-t-transparent" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
            )}
            Envoyer l&rsquo;e-mail aux clients
          </button>
          <button
            onClick={() => window.print()}
            disabled={orders.length === 0}
            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-semibold transition-all ${
              orders.length === 0
                ? "cursor-not-allowed border-white/[0.06] text-gray-400"
                : "border-white/15 text-gray-200 hover:border-[#C9A84C]/50 hover:text-[#C9A84C]"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Imprimer
          </button>
          <button
            onClick={exportCsv}
            disabled={orders.length === 0}
            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-semibold transition-all ${
              orders.length === 0
                ? "cursor-not-allowed border-white/[0.06] text-gray-400"
                : "border-[#C9A84C]/40 bg-[#C9A84C]/10 text-[#C9A84C] hover:bg-[#C9A84C]/20"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Exporter CSV
          </button>
        </div>
      </div>

      {notifyMsg && (
        <div className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-gray-200">
          {notifyMsg}
        </div>
      )}

      {/* Testeur de configuration e-mail (Resend) */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.01] p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Tester l&rsquo;envoi d&rsquo;e-mail</p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendTest()}
            placeholder="adresse@exemple.com"
            className="flex-1 rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#C9A84C]"
          />
          <button
            onClick={sendTest}
            disabled={testing || !testEmail.trim()}
            className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-xs font-semibold transition-all ${
              testing || !testEmail.trim()
                ? "cursor-not-allowed bg-gray-700 text-gray-400"
                : "bg-[#C9A84C] text-black hover:bg-[#F0CB6A]"
            }`}
          >
            {testing ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/40 border-t-transparent" /> : "Envoyer le test"}
          </button>
        </div>
        {testMsg && <p className="mt-2 text-xs text-gray-300">{testMsg}</p>}
      </div>

      {/* Récap */}
      {!loading && orders.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="text-xs text-gray-400">Commandes</p>
            <p className="font-heading text-2xl font-bold text-white">{totals.count}</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="text-xs text-gray-400">Billets</p>
            <p className="font-heading text-2xl font-bold text-white">{totals.tickets}</p>
          </div>
          <div className="rounded-xl border border-[#C9A84C]/20 bg-[#C9A84C]/5 p-4">
            <p className="text-xs text-gray-400">Montant total</p>
            <p className="font-heading text-2xl font-bold text-[#C9A84C]">{formatMAD(totals.amount)}</p>
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button
            key={s.value}
            onClick={() => setStatusFilter(s.value)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
              statusFilter === s.value
                ? "border-[#C9A84C]/40 bg-[#C9A84C]/10 text-[#C9A84C]"
                : "border-white/[0.06] text-gray-400 hover:border-white/10 hover:text-gray-300"
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
          <p className="text-sm text-gray-400">
            {statusFilter === "all" ? "Aucune commande." : "Aucune commande dans cette catégorie."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/[0.06] bg-white/[0.01]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.04] text-left text-xs font-medium text-gray-400">
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Téléphone</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Catégorie</th>
                <th className="px-4 py-3 text-center">Qté</th>
                <th className="px-4 py-3 text-right">Montant</th>
                <th className="px-4 py-3">Paiement</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-white/[0.02] transition-colors hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-medium text-white">{order.customer_name || "—"}</td>
                  <td className="px-4 py-3 text-gray-300">
                    {order.customer_phone ? (
                      <a href={`tel:${order.customer_phone}`} className="hover:text-[#C9A84C]">{order.customer_phone}</a>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-400 max-w-[180px] truncate">{order.customer_email || "—"}</td>
                  <td className="px-4 py-3 text-gray-300">{order.ticket_type || "—"}</td>
                  <td className="px-4 py-3 text-center text-white">{qtyOf(order)}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-[#C9A84C]">
                    {order.amount === 0 ? "Gratuit" : formatMAD(order.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${order.payment_method === "delivery" ? "bg-[#25D366]/15 text-[#25D366]" : "bg-[#C4161C]/15 text-[#ef4444]"}`}>
                      {methodLabel(order)}
                    </span>
                  </td>
                  <td className="px-4 py-3">{statusBadge(order.status)}</td>
                  <td className="px-4 py-3 text-right text-xs text-gray-400 whitespace-nowrap">
                    {new Date(order.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/orders/${order.id}`} className="text-xs text-[#C9A84C] transition-colors hover:text-[#F0CB6A]">
                      Détails →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ============================================================
          Version imprimable (masquée à l'écran) — liste propre A4
          ============================================================ */}
      {orders.length > 0 && (
        <div className="print-area">
          <div style={{ marginBottom: "14px" }}>
            <div style={{ fontSize: "18px", fontWeight: 800 }}>
              Worship Gift — Liste des commandes
            </div>
            <div style={{ fontSize: "12px", color: "#444", marginTop: "2px" }}>
              Concert Live de Jonathan Gambela · 11 octobre 2026 · Stade RUC, Casablanca
            </div>
            <div style={{ fontSize: "12px", color: "#444", marginTop: "2px" }}>
              Éditée le {new Date().toLocaleDateString("fr-FR")} · {totals.count} commande(s)
              · {totals.tickets} billet(s) · Total {formatMAD(totals.amount)}
              {statusFilter !== "all" ? ` · Filtre : ${STATUS_LABEL[statusFilter] || statusFilter}` : ""}
            </div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
            <thead>
              <tr>
                {["#", "Nom", "Téléphone", "Email", "Catégorie", "Qté", "Prix unit.", "Total", "Paiement", "Statut"].map((h) => (
                  <th key={h} style={{ border: "1px solid #ccc", padding: "5px 6px", textAlign: "left", background: "#f3f3f3" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => (
                <tr key={o.id} className="print-ticket">
                  <td style={{ border: "1px solid #ccc", padding: "5px 6px" }}>{i + 1}</td>
                  <td style={{ border: "1px solid #ccc", padding: "5px 6px", fontWeight: 600 }}>{o.customer_name || "—"}</td>
                  <td style={{ border: "1px solid #ccc", padding: "5px 6px" }}>{o.customer_phone || "—"}</td>
                  <td style={{ border: "1px solid #ccc", padding: "5px 6px" }}>{o.customer_email || "—"}</td>
                  <td style={{ border: "1px solid #ccc", padding: "5px 6px" }}>{o.ticket_type || "—"}</td>
                  <td style={{ border: "1px solid #ccc", padding: "5px 6px", textAlign: "center" }}>{qtyOf(o)}</td>
                  <td style={{ border: "1px solid #ccc", padding: "5px 6px", textAlign: "right" }}>{(unitOf(o) / 100).toFixed(0)} MAD</td>
                  <td style={{ border: "1px solid #ccc", padding: "5px 6px", textAlign: "right", fontWeight: 700 }}>{o.amount === 0 ? "Gratuit" : `${(o.amount / 100).toFixed(0)} MAD`}</td>
                  <td style={{ border: "1px solid #ccc", padding: "5px 6px" }}>{methodLabel(o)}</td>
                  <td style={{ border: "1px solid #ccc", padding: "5px 6px" }}>{STATUS_LABEL[o.status] || o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
