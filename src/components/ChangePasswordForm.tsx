"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

/* ================================================================
   Worship Gift — Formulaire « Changer mon mot de passe »
   Utilise supabase.auth.updateUser({ password }) : l'utilisateur
   est déjà authentifié (session en cours), pas besoin de l'ancien
   mot de passe côté Supabase. On exige quand même une confirmation.
   ================================================================ */

const MIN_LEN = 8;

export default function ChangePasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (password.length < MIN_LEN) {
      setError(`Le mot de passe doit contenir au moins ${MIN_LEN} caractères.`);
      return;
    }
    if (password !== confirm) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (err) {
      setError(err.message);
      return;
    }
    setSuccess(true);
    setPassword("");
    setConfirm("");
  };

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-6">
      <h2 className="font-heading text-xl font-semibold text-white">
        Changer mon mot de passe
      </h2>
      <p className="mt-1 text-sm text-gray-400">
        Choisis un nouveau mot de passe ({MIN_LEN} caractères minimum).
      </p>

      <form onSubmit={handleSubmit} className="mt-5 max-w-sm space-y-4">
        <div>
          <label htmlFor="new-password" className="mb-1 block text-xs text-gray-400">
            Nouveau mot de passe
          </label>
          <input
            id="new-password"
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#C9A84C]"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label htmlFor="confirm-password" className="mb-1 block text-xs text-gray-400">
            Confirmer le mot de passe
          </label>
          <input
            id="confirm-password"
            type={show ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#C9A84C]"
            placeholder="••••••••"
          />
        </div>

        <label className="flex items-center gap-2 text-xs text-gray-400">
          <input
            type="checkbox"
            checked={show}
            onChange={(e) => setShow(e.target.checked)}
            className="accent-[#C9A84C]"
          />
          Afficher le mot de passe
        </label>

        {error && (
          <p className="rounded-md bg-red-500/10 px-3 py-2 text-xs text-red-400">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-md bg-green-500/10 px-3 py-2 text-xs text-green-400">
            Mot de passe mis à jour avec succès ✓
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`inline-flex h-10 items-center justify-center rounded-md px-5 text-sm font-semibold transition-colors ${
            loading
              ? "cursor-not-allowed bg-gray-700 text-gray-400"
              : "bg-[#C9A84C] text-black hover:bg-[#F0CB6A]"
          }`}
        >
          {loading ? "Enregistrement…" : "Mettre à jour"}
        </button>
      </form>
    </div>
  );
}
