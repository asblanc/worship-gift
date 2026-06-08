/* ================================================================
   Worship Gift — Route POST /api/payment/cmi/callback
   Recoit la notification serveur-a-serveur de CMI apres paiement.
   
   CMI POST les donnees suivantes (x-www-form-urlencoded) :
   - clientid, oid, amount, Response, ProcReturnCode, TransId, HASH, etc.
   
   Cette route :
   1. Extrait les donnees POST
   2. Verifie le hash CMI
   3. Met a jour la commande dans Supabase (orders/tickets)
   4. Retourne "APPROVED" si tout est OK (sinon CMI reessaie)
   
   ⚠️ IMPORTANT : CMI attend la reponse "APPROVED" en texte brut.
      Si CMI ne recoit pas "APPROVED", il reessaiera le callback.
   ================================================================ */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { CmiProvider } from "@/lib/payment/cmi-provider";
import { sendOrderConfirmation } from "@/lib/email";
import type { PaymentCallback } from "@/lib/payment/types";

/* ------------------------------------------------------------------
   Client Supabase service_role (privileges admin pour le callback)
   ------------------------------------------------------------------ */

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!url || !key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY manquante");
  }
  return createClient(url, key);
}

/**
 * Parse le body form-urlencoded du callback CMI
 */
async function parseCmiBody(request: NextRequest): Promise<Record<string, string | string[]>> {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return (await request.json()) as Record<string, string>;
  }
  // form-urlencoded (methode standard CMI)
  const text = await request.text();
  const params = new URLSearchParams(text);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

export async function POST(request: NextRequest) {
  console.log("[CMI Callback] Recu");

  try {
    const rawBody = await parseCmiBody(request);

    const callback: PaymentCallback = {
      TransId: rawBody.TransId?.toString(),
      oid: rawBody.oid?.toString(),
      amount: rawBody.amount?.toString(),
      Response: rawBody.Response?.toString(),
      HASH: rawBody.HASH?.toString() || rawBody.hash?.toString(),
      ProcReturnCode: rawBody.ProcReturnCode?.toString(),
      ErrMsg: rawBody.ErrMsg?.toString(),
      rawBody,
    };

    console.log("[CMI Callback] Donnees:", {
      oid: callback.oid,
      Response: callback.Response,
      TransId: callback.TransId,
    });

    // Verifier le paiement via le CmiProvider
    const provider = new CmiProvider();
    const result = await provider.verifyCallback(callback);

    console.log("[CMI Callback] Verification:", {
      success: result.success,
      orderId: result.orderId,
    });

    // Signature invalide -> callback forge/corrompu : on REJETTE.
    // On ne touche pas a la commande et on renvoie "FAILURE" a CMI.
    if (result.errorCode === "HASH_INVALID") {
      console.error("[CMI Callback] Signature invalide — callback rejete:", result.orderId);
      return new NextResponse("FAILURE", {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }

    // Mettre a jour la commande dans Supabase (signature valide a ce stade)
    if (result.orderId) {
      try {
        const supabase = getServiceClient();

        if (result.success) {
          // Verifier que le montant paye correspond a la commande enregistree
          const { data: order } = await supabase
            .from("orders")
            .select("amount, status")
            .eq("id", result.orderId)
            .single();

          if (!order) {
            console.error("[CMI Callback] Commande introuvable:", result.orderId);
          } else if (order.amount !== result.amount) {
            // Montant incoherent -> tentative de fraude : on marque failed
            console.error(
              "[CMI Callback] Montant incoherent:",
              { attendu: order.amount, recu: result.amount },
            );
            await supabase
              .from("orders")
              .update({
                status: "failed",
                transaction_id: result.transactionId,
                error_code: "AMOUNT_MISMATCH",
                error_message: "Montant paye different du montant commande",
              })
              .eq("id", result.orderId);
          } else if (order.status === "paid") {
            // Idempotent : deja paye, on ne refait rien
            console.log("[CMI Callback] Commande deja payee:", result.orderId);
          } else {
            const { error: updateErr } = await supabase
              .from("orders")
              .update({
                status: "paid",
                transaction_id: result.transactionId,
                paid_at: new Date().toISOString(),
              })
              .eq("id", result.orderId);
            if (updateErr) {
              console.error("[CMI Callback] Erreur update orders:", updateErr);
            } else {
              // Email de confirmation (no-op si Resend non configuré)
              await sendOrderConfirmation(result.orderId);
            }
          }
        } else {
          // Paiement echoue (signature valide mais refus banque)
          const { error: updateErr } = await supabase
            .from("orders")
            .update({
              status: "failed",
              transaction_id: result.transactionId,
              error_code: result.errorCode,
              error_message: result.errorMessage,
            })
            .eq("id", result.orderId);

          if (updateErr) {
            console.error("[CMI Callback] Erreur update orders:", updateErr);
          }
        }
      } catch (dbError) {
        console.error("[CMI Callback] Erreur Supabase:", dbError);
        // Ne pas bloquer la reponse a CMI meme si DB echoue
      }
    }

    // Signature valide : on acquitte la reception aupres de CMI.
    return new NextResponse("APPROVED", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error("[CMI Callback] Erreur fatale:", error);
    // Erreur interne : on renvoie FAILURE pour que CMI reessaie le callback
    // (mieux qu'acquitter a tort un paiement qu'on n'a pas pu traiter).
    return new NextResponse("FAILURE", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }
}