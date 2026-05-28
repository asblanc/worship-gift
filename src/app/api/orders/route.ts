/* ================================================================
   Worship Gift — Route POST /api/orders
   Cree une commande + tickets quand l'utilisateur clique "Reserver".
   
   Corps attendu (JSON) :
   {
     "eventId": "evt-001",
     "quantity": 2,
     "ticketType": "Entree libre",
     "customerName": "Ahmed",
     "customerEmail": "ahmed@email.com",
     "telephone": "+212 6XX XXX XXX"
   }
   
   Reponse :
   {
     "success": true,
     "orderId": "WG-20260528-ABC12",
     "tickets": [...]
   }
   
   TODO: BRANCHER CMI ICI — Quand le paiement sera pret :
   Apres creation de la commande, au lieu de renvoyer orderId,
   appeler CmiProvider.initiatePayment() et renvoyer le formHtml.
   Le flux deviendra : creation commande -> redirection CMI -> callback -> success.
   ================================================================ */

import { NextRequest, NextResponse } from "next/server";
import { upcomingEvents } from "@/lib/events-config";
import { createOrder } from "@/lib/orders-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation
    if (!body.eventId || !body.quantity || !body.customerName || !body.customerEmail) {
      return NextResponse.json(
        { success: false, error: "Champs requis manquants: eventId, quantity, customerName, customerEmail" },
        { status: 400 }
      );
    }

    if (body.quantity < 1 || body.quantity > 10) {
      return NextResponse.json(
        { success: false, error: "Quantite invalide (1-10 billets max)" },
        { status: 400 }
      );
    }

    // Trouver l'evenement
    const event = upcomingEvents.find((e) => e.id === body.eventId);
    if (!event) {
      return NextResponse.json(
        { success: false, error: "Evenement introuvable" },
        { status: 404 }
      );
    }

    // TODO: BRANCHER CMI ICI (etape 1/2)
    // Quand tu auras les identifiants CMI, tu pourras :
    // 1. Continuer avec createOrder (ci-dessous)
    // 2. Puis appeler CmiProvider.initiatePayment() pour generer le formulaire
    // 3. Renvoyer le formHtml au lieu du JSON orderId
    // Voir src/app/api/payment/cmi/init/route.ts pour l'implementation CMI

    const result = await createOrder({
      event,
      quantity: body.quantity,
      ticketType: body.ticketType || "Entree libre",
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      telephone: body.telephone,
    });

    return NextResponse.json({
      success: true,
      orderId: result.orderId,
      tickets: result.tickets,
    });
  } catch (error) {
    console.error("[API Orders] Erreur:", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}