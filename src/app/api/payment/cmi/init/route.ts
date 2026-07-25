/* ================================================================
   Worship Gift — Route POST /api/payment/cmi/init
   Genere le formulaire de redirection vers CMI.
   
   Corps attendu (JSON) :
   {
     "orderId": "WG-20260528-001",
     "amount": 5000,            // centimes (50.00 MAD)
     "currency": "MAD",
     "customerEmail": "client@email.com",
     "customerName": "Ahmed",
     "description": "Concert Worship Gift - 2 billets VIP"
   }
   
   Reponse : HTML du formulaire CMI (auto-submit)
   ================================================================ */

import { NextRequest, NextResponse } from "next/server";
import { CmiProvider } from "@/lib/payment/cmi-provider";
import { getOrderForPayment } from "@/lib/orders-service.server";
import { rateLimitAsync } from "@/lib/rate-limit";
import type { PaymentInitRequest } from "@/lib/payment/types";

/**
 * Résout l'origine à utiliser pour les URLs de retour CMI.
 * 1. NEXT_PUBLIC_SITE_URL (origine canonique, source de vérité).
 * 2. En développement uniquement : origine de la requête si localhost
 *    (pratique pour tester sans config).
 * Tout autre Origin fourni par le client est ignoré.
 */
function resolveReturnOrigin(request: NextRequest): string {
  const canonical = process.env.NEXT_PUBLIC_SITE_URL;
  if (canonical) return canonical.replace(/\/+$/, "");

  if (process.env.NODE_ENV !== "production") {
    const reqOrigin = request.headers.get("origin") || "";
    try {
      const host = new URL(reqOrigin).hostname;
      if (host === "localhost" || host === "127.0.0.1" || host.endsWith(".local")) {
        return reqOrigin.replace(/\/+$/, "");
      }
    } catch {
      // origine invalide → ignorée
    }
  }

  return "http://localhost:3000";
}

export async function POST(request: NextRequest) {
  try {
    const limited = await rateLimitAsync(request, "cmi-init", 15, 60_000);
    if (limited) return limited;

    // Accepte JSON (fetch) ou form-urlencoded (POST plein-page depuis
    // le checkout, qui permet la redirection navigateur vers CMI).
    const contentType = request.headers.get("content-type") || "";
    let rawOrderId = "";
    if (contentType.includes("application/json")) {
      const body = await request.json();
      rawOrderId = typeof body.orderId === "string" ? body.orderId : "";
    } else {
      const form = await request.formData();
      rawOrderId = String(form.get("orderId") || "");
    }

    // Seul l'orderId vient du client. Le montant est relu en base :
    // on ne fait JAMAIS confiance au montant fourni par le client.
    const orderId = rawOrderId.trim();
    if (!orderId) {
      return NextResponse.json(
        { error: "Champ requis manquant : orderId" },
        { status: 400 }
      );
    }

    const order = await getOrderForPayment(orderId);
    if (!order) {
      return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
    }
    if (order.status === "paid") {
      return NextResponse.json({ error: "Commande deja payee" }, { status: 409 });
    }
    if (!order.amount || order.amount <= 0) {
      return NextResponse.json(
        { error: "Cette commande est gratuite, aucun paiement requis" },
        { status: 400 }
      );
    }

    // URLs de retour : on utilise l'ORIGINE CANONIQUE du site (env),
    // jamais l'en-tête Origin brut de la requête. Un attaquant peut
    // envoyer un Origin arbitraire (curl / serveur tiers) et ferait
    // sinon pointer okUrl/failUrl vers son domaine → open-redirect /
    // phishing post-paiement. En dev (pas de NEXT_PUBLIC_SITE_URL), on
    // retombe sur l'origine de la requête si elle est locale.
    const origin = resolveReturnOrigin(request);

    const initRequest: PaymentInitRequest = {
      orderId: order.id,
      amount: order.amount, // montant serveur (centimes)
      currency: (order.currency as PaymentInitRequest["currency"]) || "MAD",
      customerEmail: order.customer_email,
      customerName: order.customer_name || "Client",
      description: order.description || "Paiement Worship Gift",
      okUrl: `${origin}/billetterie/success?order=${order.id}`,
      failUrl: `${origin}/billetterie/checkout?error=1&order=${order.id}`,
    };

    const provider = new CmiProvider();
    const result = await provider.initiatePayment(initRequest);

    if (!result.formHtml) {
      return NextResponse.json(
        { error: "Erreur lors de la generation du formulaire CMI" },
        { status: 500 }
      );
    }

    // Retourner le HTML du formulaire
    return new NextResponse(result.formHtml, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("[CMI Init] Erreur:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}