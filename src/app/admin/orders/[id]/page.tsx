"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";

interface OrderDetail {
  id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  channel: string | null;
  payment_method: string | null;
  ticket_type: string | null;
  quantity: number | null;
  event_title: string | null;
  event_date: string | null;
  event_time: string | null;
  event_location: string | null;
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

const ALL_STATUSES = ["pending", "reserved", "paid", "cancelled", "failed"] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Suppression définitive (nettoyage des commandes de test)
  const handleDelete = async () => {
    if (!confirm("Supprimer définitivement cette commande ? Cette action est irréversible.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}/delete`, { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Échec de la suppression");
      router.push("/admin/orders");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur lors de la suppression");
      setDeleting(false);
    }
  };

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
      } catch {
        // table inexistante
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    try {
      // Écriture côté serveur (service_role) : les RLS bloquent l'écriture client.
      const res = await fetch(`/api/admin/orders/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Échec de la mise à jour");
      }
      setOrder((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              paid_at: newStatus === "paid" ? new Date().toISOString() : prev.paid_at,
            }
          : prev,
      );
    } catch (err) {
      console.error("Erreur changement statut:", err);
      alert(err instanceof Error ? err.message : "Erreur lors de la mise à jour du statut");
    } finally {
      setUpdating(false);
    }
  };

  // Copie les infos client à transmettre au prestataire (billetteries.ma)
  const copyForProvider = async () => {
    if (!order) return;
    const lines = [
      `Commande Worship Gift — ${order.id}`,
      `Événement : ${order.event_title ?? order.description ?? ""}`,
      order.event_date ? `Date : ${order.event_date} ${order.event_time ?? ""}` : "",
      `Catégorie : ${order.ticket_type ?? "—"}`,
      `Quantité : ${order.quantity ?? 1}`,
      `Nom : ${order.customer_name ?? "—"}`,
      `Téléphone : ${order.customer_phone ?? "—"}`,
      order.customer_email ? `Email : ${order.customer_email}` : "",
      `Montant : ${order.amount === 0 ? "Gratuit" : `${(order.amount / 100).toFixed(2)} MAD`} (à la livraison)`,
    ].filter(Boolean);
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert("Copie impossible. Sélectionnez les infos manuellement.");
    }
  };

  // Lien WhatsApp pré-rempli vers le client (normalise le numéro au format
  // international marocain : 0X… -> 212X…, 9 chiffres -> 212…).
  const waHref = (): string => {
    if (!order?.customer_phone) return "";
    const digits = order.customer_phone.replace(/\D/g, "");
    let intl = digits;
    if (digits.startsWith("0")) intl = "212" + digits.slice(1);
    else if (digits.length === 9) intl = "212" + digits;
    const msg = `Bonjour ${order.customer_name || ""}, ici l'équipe Worship Gift. Nous avons bien reçu votre commande ${order.id} (${order.quantity ?? 1} billet(s)${order.ticket_type ? " · " + order.ticket_type : ""}) pour le Concert Live de Jonathan Gambela — 11 octobre 2026 au Stade RUC, Casablanca. Votre commande est en cours de traitement, nous revenons vers vous très vite. Merci !`;
    return `https://wa.me/${intl}?text=${encodeURIComponent(msg)}`;
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
            <h1 className="t-h3 text-white">{order.description || "Commande"}</h1>
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
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.81.36 1.6.7 2.34a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.74-1.27a2 2 0 0 1 2.11-.45c.74.34 1.53.57 2.34.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span className="text-gray-400">Téléphone :</span>
            <span className="font-medium text-white">{order.customer_phone || "—"}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
            <span className="text-gray-400">Paiement :</span>
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${order.payment_method === "delivery" ? "bg-[#25D366]/15 text-[#25D366]" : "bg-[#C9A84C]/15 text-[#C9A84C]"}`}>
              {order.payment_method === "delivery" ? "À la livraison" : "En ligne"}
            </span>
            {order.ticket_type ? (
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-gray-300">{order.ticket_type}</span>
            ) : null}
            {order.quantity ? <span className="text-gray-400">· {order.quantity} billet(s)</span> : null}
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
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">Suivi de la commande</p>
          <p className="mb-3 text-[11px] text-gray-500">« Confirmée » = infos transmises au prestataire · « Payée » = billet émis / réglé. Aucun billet n&rsquo;est généré ici : c&rsquo;est billetteries.ma qui l&rsquo;émet.</p>
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

      {/* Traitement de la commande — à transmettre au prestataire (billetteries.ma) */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.01] p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#25D366]/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </div>
          <h2 className="t-card-title text-white">Émission du billet</h2>
        </div>

        <div className="mt-4 rounded-lg border border-[#25D366]/20 bg-[#25D366]/[0.04] p-4 text-xs leading-relaxed text-gray-300">
          <p className="font-semibold text-[#25D366]">Le billet est émis par billetteries.ma</p>
          <p className="mt-1">
            1. Le client a envoyé ses infos (WhatsApp) →
            2. <strong className="text-white">Transmettez-les au prestataire</strong> pour l&rsquo;édition du billet →
            3. Passez la commande en <strong className="text-white">« Confirmée »</strong> (transmise), puis <strong className="text-white">« Payée »</strong> à l&rsquo;encaissement.
            Le billet officiel (et son contrôle à l&rsquo;entrée) est géré par billetteries.ma — rien à générer ici.
          </p>
        </div>

        {/* Bloc infos à transmettre + copie */}
        <div className="mt-4 rounded-lg border border-white/[0.06] bg-black/20 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Infos à transmettre</p>
            <div className="flex flex-wrap gap-2">
              {order.customer_phone && (
                <a
                  href={waHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#25D366]/40 bg-[#25D366]/10 px-3 py-1.5 text-xs font-semibold text-[#25D366] transition-all hover:bg-[#25D366]/20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893C23.945 5.335 18.61.001 12.05 0" /></svg>
                  Contacter (WhatsApp)
                </a>
              )}
              <button
                onClick={copyForProvider}
                className="inline-flex items-center gap-2 rounded-lg border border-[#C9A84C]/40 bg-[#C9A84C]/10 px-3 py-1.5 text-xs font-semibold text-[#C9A84C] transition-all hover:bg-[#C9A84C]/20"
              >
                {copied ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    Copié
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                    Copier les infos
                  </>
                )}
              </button>
            </div>
          </div>
          <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
            <div className="flex justify-between gap-3 border-b border-white/[0.04] pb-2"><dt className="text-gray-400">Événement</dt><dd className="text-right text-white">{order.event_title || order.description || "—"}</dd></div>
            <div className="flex justify-between gap-3 border-b border-white/[0.04] pb-2"><dt className="text-gray-400">Date</dt><dd className="text-right text-gray-300">{[order.event_date, order.event_time].filter(Boolean).join(" ") || "—"}</dd></div>
            <div className="flex justify-between gap-3 border-b border-white/[0.04] pb-2"><dt className="text-gray-400">Catégorie</dt><dd className="text-right text-white">{order.ticket_type || "—"}</dd></div>
            <div className="flex justify-between gap-3 border-b border-white/[0.04] pb-2"><dt className="text-gray-400">Quantité</dt><dd className="text-right text-white">{order.quantity ?? 1}</dd></div>
            <div className="flex justify-between gap-3 border-b border-white/[0.04] pb-2"><dt className="text-gray-400">Nom</dt><dd className="text-right text-white">{order.customer_name || "—"}</dd></div>
            <div className="flex justify-between gap-3 border-b border-white/[0.04] pb-2"><dt className="text-gray-400">Téléphone</dt><dd className="text-right text-white">{order.customer_phone || "—"}</dd></div>
            {order.customer_email && (
              <div className="flex justify-between gap-3 border-b border-white/[0.04] pb-2 sm:col-span-2"><dt className="text-gray-400">Email</dt><dd className="text-right text-white">{order.customer_email}</dd></div>
            )}
          </dl>
        </div>
      </div>

      {/* Zone de suppression (nettoyage des commandes de test) */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.04] p-5">
        <div>
          <p className="text-sm font-semibold text-red-300">Supprimer cette commande</p>
          <p className="mt-0.5 text-xs text-gray-400">Action irréversible — à réserver aux commandes de test.</p>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
            deleting ? "cursor-not-allowed bg-gray-700 text-gray-400" : "border border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20"
          }`}
        >
          {deleting ? (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
          )}
          Supprimer définitivement
        </button>
      </div>
    </motion.div>
  );
}