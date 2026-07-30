"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { META_PIXEL_ID, metaPixelEnabled } from "@/lib/meta-pixel";

/* ================================================================
   Worship Gift — Chargement du Meta Pixel

   - Le script n'est injecté QUE si NEXT_PUBLIC_META_PIXEL_ID existe.
   - Snippet INLINE (pas next/script) : il part dans le HTML rendu par
     le serveur et s'exécute dès le parsing, sans attendre l'hydratation
     React. C'est volontaire — sur les vieux WebView Android du trafic
     marocain, l'hydratation peut tarder ou échouer, et on perdrait
     alors le PageView (et donc la conversion attribuée à la pub).
     Même approche que le filet anti page-blanche de layout.tsx.
   - Next.js étant une SPA, les changements de page ne rechargent pas
     le script : on renvoie un PageView à chaque navigation interne
     (en sautant la première, déjà envoyée par le snippet).
   - <noscript> : pixel image de repli (navigateurs sans JS).
   ================================================================ */

const pixelSnippet = (id: string) => `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${id}');fbq('track','PageView');`;

export default function MetaPixel() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!metaPixelEnabled) return;
    // Le snippet d'init a déjà envoyé le PageView de la page d'entrée.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.fbq?.("track", "PageView");
  }, [pathname]);

  if (!metaPixelEnabled) return null;

  return (
    <>
      <script
        id="meta-pixel"
        dangerouslySetInnerHTML={{ __html: pixelSnippet(META_PIXEL_ID) }}
      />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
