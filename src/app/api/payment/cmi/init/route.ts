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
import { rateLimit } from "@/lib/rate-limit";
import type { PaymentInitRequest } from "@/lib/payment/types";

export async function POST(request: NextRequest) {
  try {
    const limited = rateLimit(request, "cmi-init", 15, 60_000);
    if (limited) return limited;

    const body = await request.json();

    // Seul l'orderId vient du client. Tout le reste (montant, email,
    // montant a payer) est relu en base : on ne fait JAMAIS confiance au
    // montant fourni par le client.
    const orderId = typeof body.orderId === "string" ? body.orderId.trim() : "";
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

    // Construire les URLs de retour basees sur l'origine de la requete
    // (evite de hardcoder localhost en dev)
    const origin = request.headers.get("origin") || "http://localhost:3000";

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