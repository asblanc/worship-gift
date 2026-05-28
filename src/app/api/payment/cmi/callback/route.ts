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

    // Mettre a jour la commande dans Supabase
    if (result.orderId) {
      try {
        const supabase = getServiceClient();

        if (result.success) {
          // Paiement reussi -> marquer la commande comme "paid"
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
          }
        } else {
          // Paiement echoue
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

    // Toujours retourner "APPROVED" a CMI pour confirmer la reception
    // (sinon CMI reessaie le callback)
    return new NextResponse("APPROVED", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error("[CMI Callback] Erreur fatale:", error);
    // Meme en cas d'erreur, on retourne APPROVED pour eviter les reessais infinis
    // (on log l'erreur pour debug)
    return new NextResponse("APPROVED", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }
}