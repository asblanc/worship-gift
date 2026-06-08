"use client";

import { useRef, useState } from "react";

/* ================================================================
   Worship Gift — /admin/scan — Validation des billets à l'entrée
   Champ auto-focus qui se valide à l'Entrée : compatible avec un
   scanner physique (émulation clavier) ET la saisie manuelle.
   Appelle /api/admin/tickets/validate (réservé admin).
   ================================================================ */

type Result = {
  kind: "validated" | "already_used" | "cancelled" | "not_found" | "error";
  message: string;
  ticket?: {
    event_title?: string;
    event_date?: string;
    event_time?: string;
    customer_name?: string;
    ticket_type?: string;
    used_at?: string;
  };
};

export default function ScanPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [count, setCount] = useState({ ok: 0, ko: 0 });
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = async (raw: string) => {
    const value = raw.trim();
    if (!value) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/admin/tickets/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: value }),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        setResult({ kind: "validated", message: "Billet valide — entrée autorisée", ticket: data.ticket });
        setCount((c) => ({ ...c, ok: c.ok + 1 }));
      } else {
        const kind: Result["kind"] =
          data.status === "already_used"
            ? "already_used"
            : data.status === "cancelled"
              ? "cancelled"
              : data.status === "not_found"
                ? "not_found"
                : "error";
        setResult({ kind, message: data.error || "Billet refusé", ticket: data.ticket });
        setCount((c) => ({ ...c, ko: c.ko + 1 }));
      }
    } catch {
      setResult({ kind: "error", message: "Erreur réseau. Réessaie." });
    } finally {
      setLoading(false);
      setCode("");
      inputRef.current?.focus();
    }
  };

  const styles: Record<Result["kind"], string> = {
    validated: "border-green-500/40 bg-green-500/10 text-green-400",
    already_used: "border-orange-500/40 bg-orange-500/10 text-orange-400",
    cancelled: "border-red-500/40 bg-red-500/10 text-red-400",
    not_found: "border-red-500/40 bg-red-500/10 text-red-400",
    error: "border-red-500/40 bg-red-500/10 text-red-400",
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-white">Validation des billets</h1>
        <p className="mt-1 text-sm text-gray-500">
          Scanne le QR code (ou saisis le code du billet) puis valide avec Entrée.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          validate(code);
        }}
        className="flex gap-2"
      >
        <input
          ref={inputRef}
          autoFocus
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="WG-…-T001-XXXXXXXX"
          aria-label="Code du billet"
          className="flex-1 rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono text-sm text-white outline-none focus:border-[#C9A84C]"
        />
        <button
          type="submit"
          disabled={loading}
          className={`rounded-md px-5 text-sm font-semibold transition-colors ${
            loading ? "cursor-not-allowed bg-gray-700 text-gray-400" : "bg-[#C9A84C] text-black hover:bg-[#F0CB6A]"
          }`}
        >
          {loading ? "…" : "Valider"}
        </button>
      </form>

      {/* Compteurs de session */}
      <div className="flex gap-3 text-xs">
        <span className="rounded-full bg-green-500/10 px-3 py-1 text-green-400">
          Validés : {count.ok}
        </span>
        <span className="rounded-full bg-red-500/10 px-3 py-1 text-red-400">
          Refusés : {count.ko}
        </span>
      </div>

      {/* Résultat */}
      {result && (
        <div className={`rounded-xl border p-5 ${styles[result.kind]}`}>
          <p className="text-lg font-bold">{result.message}</p>
          {result.ticket && (
            <div className="mt-2 space-y-0.5 text-sm text-gray-300">
              {result.ticket.event_title && <p>{result.ticket.event_title}</p>}
              {(result.ticket.event_date || result.ticket.event_time) && (
                <p className="text-gray-400">
                  {result.ticket.event_date} {result.ticket.event_time}
                </p>
              )}
              {result.ticket.customer_name && (
                <p className="text-gray-400">Titulaire : {result.ticket.customer_name}</p>
              )}
              {result.ticket.ticket_type && (
                <p className="text-gray-400">Type : {result.ticket.ticket_type}</p>
              )}
              {result.kind === "already_used" && result.ticket.used_at && (
                <p className="text-orange-300">
                  Déjà scanné le {new Date(result.ticket.used_at).toLocaleString("fr-FR")}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
