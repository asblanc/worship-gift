"use client";

import { useEffect } from "react";
import { trackMeta } from "@/lib/meta-pixel";

/**
 * Filet global pour les CTA : les nouveaux liens gardent automatiquement un
 * suivi cohérent sans coupler chaque composant visuel à Meta Pixel.
 */
export default function MetaClickTracking() {
  useEffect(() => {
    const trackClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href") ?? "";
      if (href.startsWith("/billetterie") || href.includes("billetteries.ma")) {
        trackMeta("InitiateCheckout", { content_name: "Billetterie", source: "cta" });
      }

      if (href.startsWith("https://wa.me/") || href.startsWith("tel:")) {
        trackMeta("Contact", { content_name: "Contact", source: href.startsWith("tel:") ? "telephone" : "whatsapp" });
      }
    };

    document.addEventListener("click", trackClick);
    return () => document.removeEventListener("click", trackClick);
  }, []);

  return null;
}
