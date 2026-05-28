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
import type { PaymentInitRequest } from "@/lib/payment/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation minimale
    if (!body.orderId || !body.amount || !body.customerEmail) {
      return NextResponse.json(
        { error: "Champs requis manquants : orderId, amount, customerEmail" },
        { status: 400 }
      );
    }

    // Construire les URLs de retour basees sur l'origine de la requete
    // (evite de hardcoder localhost en dev)
    const origin = request.headers.get("origin") || "http://localhost:3000";

    const initRequest: PaymentInitRequest = {
      orderId: body.orderId,
      amount: body.amount,
      currency: body.currency || "MAD",
      customerEmail: body.customerEmail,
      customerName: body.customerName || "Client",
      description: body.description || "Paiement Worship Gift",
      okUrl: `${origin}/billetterie/success?order=${body.orderId}`,
      failUrl: `${origin}/billetterie/checkout?error=1&order=${body.orderId}`,
      metadata: body.metadata,
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