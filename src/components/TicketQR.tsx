"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

/* ================================================================
   Worship Gift — QR code d'un billet
   Encode le ticket_code (scanné à l'entrée pour validation).
   Généré côté client en data URL (aucun appel réseau externe).
   ================================================================ */

export default function TicketQR({
  code,
  size = 160,
}: {
  code: string;
  size?: number;
}) {
  const [dataUrl, setDataUrl] = useState("");

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(code, {
      width: size,
      margin: 1,
      color: { dark: "#000000", light: "#ffffff" },
      errorCorrectionLevel: "M",
    })
      .then((url) => {
        if (active) setDataUrl(url);
      })
      .catch(() => {
        if (active) setDataUrl("");
      });
    return () => {
      active = false;
    };
  }, [code, size]);

  if (!dataUrl) {
    return (
      <div
        className="flex items-center justify-center rounded-lg bg-white/5"
        style={{ width: size, height: size }}
      >
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#C9A84C] border-t-transparent" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={dataUrl}
      alt={`QR code du billet ${code}`}
      width={size}
      height={size}
      className="rounded-lg bg-white p-2"
    />
  );
}
