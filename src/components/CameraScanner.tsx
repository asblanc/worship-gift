"use client";

import { useEffect, useRef, useState } from "react";

/* ================================================================
   Worship Gift — Scanner QR par caméra (html5-qrcode)
   Chargé en lazy. Démarre la caméra arrière, appelle onScan(code)
   au premier QR décodé puis s'arrête. Bouton pour fermer.
   ================================================================ */

const REGION_ID = "wg-qr-reader";

export default function CameraScanner({
  onScan,
  onClose,
}: {
  onScan: (code: string) => void;
  onClose: () => void;
}) {
  const [error, setError] = useState("");
  // Type souple : la lib html5-qrcode est importée dynamiquement
  const scannerRef = useRef<{ stop: () => Promise<void>; clear?: () => void } | null>(null);
  const handledRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (cancelled) return;

        const scanner = new Html5Qrcode(REGION_ID);
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 230, height: 230 } },
          (decodedText: string) => {
            if (handledRef.current) return;
            handledRef.current = true;
            onScan(decodedText);
            scanner.stop().catch(() => {});
          },
          () => {
            /* erreurs de frame ignorées (pas de QR dans l'image) */
          },
        );
      } catch {
        if (!cancelled) {
          setError(
            "Impossible d'accéder à la caméra. Autorise l'accès dans le navigateur, ou saisis le code manuellement.",
          );
        }
      }
    })();

    return () => {
      cancelled = true;
      const s = scannerRef.current;
      if (s) {
        s.stop().catch(() => {});
        s.clear?.();
      }
    };
  }, [onScan]);

  return (
    <div className="rounded-xl border border-white/10 bg-black/40 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-white">Caméra</p>
        <button
          onClick={onClose}
          aria-label="Fermer la caméra"
          className="rounded-md border border-white/10 px-3 py-1 text-xs text-gray-300 hover:text-white"
        >
          Fermer
        </button>
      </div>

      {error ? (
        <p className="mt-3 rounded-md bg-red-500/10 px-3 py-2 text-xs text-red-400">
          {error}
        </p>
      ) : (
        <div
          id={REGION_ID}
          className="mx-auto mt-3 w-full max-w-xs overflow-hidden rounded-lg"
        />
      )}
      <p className="mt-2 text-center text-[11px] text-gray-300">
        Vise le QR code du billet
      </p>
    </div>
  );
}
