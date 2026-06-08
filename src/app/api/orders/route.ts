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
import { createOrder } from "@/lib/orders-service.server";
import { rateLimit } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    // Max 10 créations de commande / minute / IP
    const limited = rateLimit(request, "orders", 10, 60_000);
    if (limited) return limited;

    const body = await request.json();

    // Validation
    if (!body.eventId || !body.quantity || !body.customerName || !body.customerEmail) {
      return NextResponse.json(
        { success: false, error: "Champs requis manquants: eventId, quantity, customerName, customerEmail" },
        { status: 400 }
      );
    }

    const quantity = Number(body.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
      return NextResponse.json(
        { success: false, error: "Quantite invalide (1-10 billets max)" },
        { status: 400 }
      );
    }

    const customerEmail = String(body.customerEmail).trim().slice(0, 254);
    const customerName = String(body.customerName).trim().slice(0, 120);
    if (!EMAIL_RE.test(customerEmail) || customerName.length < 2) {
      return NextResponse.json(
        { success: false, error: "Email ou nom invalide" },
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

    // Le montant est calculé côté serveur dans createOrder à partir de
    // event.priceValue (source de vérité) — jamais reçu du client.
    const result = await createOrder({
      event,
      quantity,
      ticketType: typeof body.ticketType === "string" ? body.ticketType.slice(0, 60) : "Entree libre",
      customerName,
      customerEmail,
      telephone: typeof body.telephone === "string" ? body.telephone.slice(0, 40) : undefined,
    });

    return NextResponse.json({
      success: true,
      orderId: result.orderId,
      amount: result.amount,
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