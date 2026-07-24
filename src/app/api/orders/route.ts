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
import { createPendingOrder } from "@/lib/orders-service.server";
import { rateLimitAsync } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    // Max 10 créations de commande / minute / IP
    const limited = await rateLimitAsync(request, "orders", 10, 60_000);
    if (limited) return limited;

    const body = await request.json();

    const paymentMethod = body.paymentMethod === "delivery" ? "delivery" : "online";
    const customerName = String(body.customerName ?? "").trim().slice(0, 120);
    const customerEmail = body.customerEmail
      ? String(body.customerEmail).trim().slice(0, 254)
      : "";
    const telephone = body.telephone
      ? String(body.telephone).trim().slice(0, 40)
      : "";

    // Champs de base
    if (!body.eventId || !body.quantity || customerName.length < 2) {
      return NextResponse.json(
        { success: false, error: "Champs requis manquants (événement, quantité, nom)." },
        { status: 400 },
      );
    }

    // Coordonnées : en ligne = email requis ; livraison = téléphone requis.
    if (paymentMethod === "online") {
      if (!EMAIL_RE.test(customerEmail)) {
        return NextResponse.json(
          { success: false, error: "Un email valide est requis." },
          { status: 400 },
        );
      }
    } else {
      if (telephone.replace(/\D/g, "").length < 6) {
        return NextResponse.json(
          { success: false, error: "Un numéro de téléphone valide est requis pour la livraison." },
          { status: 400 },
        );
      }
      if (customerEmail && !EMAIL_RE.test(customerEmail)) {
        return NextResponse.json(
          { success: false, error: "Email invalide." },
          { status: 400 },
        );
      }
    }

    const quantity = Number(body.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
      return NextResponse.json(
        { success: false, error: "Quantité invalide (1 à 10 billets)." },
        { status: 400 },
      );
    }

    const event = upcomingEvents.find((e) => e.id === body.eventId);
    if (!event) {
      return NextResponse.json(
        { success: false, error: "Événement introuvable." },
        { status: 404 },
      );
    }

    // Catégorie de billet : le PRIX est résolu côté serveur depuis la config
    // (source de vérité), jamais reçu du client.
    let ticketLabel = "Entrée libre";
    let unitPriceValue = event.priceValue;
    if (Array.isArray(event.ticketTypes) && event.ticketTypes.length > 0) {
      const tier =
        event.ticketTypes.find((t) => t.id === body.ticketTypeId) ?? event.ticketTypes[0];
      if (tier.soldOut) {
        return NextResponse.json(
          { success: false, error: "Cette catégorie est épuisée." },
          { status: 409 },
        );
      }
      ticketLabel = tier.label;
      unitPriceValue = tier.priceValue;
    } else if (typeof body.ticketType === "string") {
      ticketLabel = body.ticketType.slice(0, 60);
    }

    // Commande "en attente" — billets générés à la validation admin
    // (paiement traité hors-site par le prestataire, ou à la livraison).
    const result = await createPendingOrder({
      event,
      quantity,
      ticketType: ticketLabel,
      unitPriceValue,
      customerName,
      customerEmail: customerEmail || undefined,
      telephone: telephone || undefined,
      paymentMethod,
    });

    return NextResponse.json({
      success: true,
      orderId: result.orderId,
      amount: result.amount,
    });
  } catch (error) {
    console.error("[API Orders] Erreur:", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}