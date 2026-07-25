/* ================================================================
   Worship Gift — CMI Payment Provider
   Implementation de la passerelle CMI (Centre Monetique Interbancaire).

   DOC OFFICIELLE CMI :
   - Formulaire POST vers la gateway CMI avec champs signes
   - Algorithme de hash : "ver3"
       hashval = valeurs des parametres triees par nom (insensible a
       la casse), echappees, jointes par "|", suivies de la storeKey
       echappee ; puis SHA-512 -> base64.
       Sont exclus du calcul : "encoding" et "hash"/"HASH".
   - Callback serveur : CMI POST les resultats sur l'URL callback
   - Verification : recalculer le hash ver3 cote serveur et comparer

   CONFIGURATION REQUISE dans .env.local :
   CMI_CLIENT_ID        -> ID marchand fourni par CMI
   CMI_STORE_KEY        -> Cle secrete fournie par CMI
   CMI_GATEWAY_URL_TEST -> https://testpayment.cmi.co.ma/fim/est3Dgate
   CMI_GATEWAY_URL_PROD -> https://payment.cmi.co.ma/fim/est3Dgate
   CMI_CALLBACK_URL     -> https://TONSITE.com/api/payment/cmi/callback
   PAYMENT_ENV          -> "test" ou "prod"
   ================================================================ */

import type {
  PaymentProvider,
  PaymentInitRequest,
  PaymentInitResponse,
  PaymentCallback,
  PaymentVerificationResult,
  Currency,
} from "./types";
import { safeEqual } from "@/lib/security";

/* ------------------------------------------------------------------
   Configuration CMI — FAIL-CLOSED
   En production, on refuse de fonctionner sans clientId/storeKey
   reels. En test, on autorise des valeurs par defaut CMI sandbox.
   ------------------------------------------------------------------ */

function getCmiConfig() {
  const env = process.env.PAYMENT_ENV || "test";
  const isProd = env === "prod";

  const clientId = process.env.CMI_CLIENT_ID;
  const storeKey = process.env.CMI_STORE_KEY;
  const callbackUrl = process.env.CMI_CALLBACK_URL;

  if (isProd && (!clientId || !storeKey || !callbackUrl)) {
    throw new Error(
      "[CMI] Configuration de production manquante (CMI_CLIENT_ID / CMI_STORE_KEY / CMI_CALLBACK_URL)",
    );
  }

  return {
    clientId: clientId || "60000000",
    storeKey: storeKey || "TEST1234",
    gatewayUrl: isProd
      ? process.env.CMI_GATEWAY_URL_PROD || "https://payment.cmi.co.ma/fim/est3Dgate"
      : process.env.CMI_GATEWAY_URL_TEST || "https://testpayment.cmi.co.ma/fim/est3Dgate",
    callbackUrl: callbackUrl || "http://localhost:3000/api/payment/cmi/callback",
    environment: env as "test" | "prod",
  };
}

/* ------------------------------------------------------------------
   Hash CMI ver3
   ------------------------------------------------------------------ */

async function sha512Base64(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-512", data);
  const bytes = new Uint8Array(hashBuffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/** Echappement ver3 : "\" -> "\\" puis "|" -> "\|" */
function escapeHashValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\|/g, "\\|");
}

/**
 * Calcule le hash ver3 a partir d'un ensemble de parametres.
 * Exclut "encoding", "hash" et "HASH" (insensible a la casse).
 */
async function computeVer3Hash(
  params: Record<string, string>,
  storeKey: string,
): Promise<string> {
  const keys = Object.keys(params)
    .filter((k) => {
      const lower = k.toLowerCase();
      return lower !== "encoding" && lower !== "hash";
    })
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase(), "en"));

  const hashval =
    keys.map((k) => escapeHashValue(params[k] ?? "")).join("|") +
    "|" +
    escapeHashValue(storeKey);

  return sha512Base64(hashval);
}

/**
 * Convertit un montant en centimes (entier) vers chaine CMI (ex: 5000 -> "50.00")
 */
function formatCmiAmount(amountInCents: number): string {
  return (amountInCents / 100).toFixed(2);
}

/* ------------------------------------------------------------------
   Echappement HTML (evite les attaques XSS dans le formulaire)
   ------------------------------------------------------------------ */

const AMP = String.fromCharCode(38) + "amp;";
const LT = String.fromCharCode(38) + "lt;";
const GT = String.fromCharCode(38) + "gt;";
const QUOT = String.fromCharCode(38) + "quot;";
const APOS = String.fromCharCode(38) + "#039;";

const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": AMP,
  "<": LT,
  ">": GT,
  '"': QUOT,
  "'": APOS,
};

function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char] || char);
}

/* ================================================================
   CMI Provider
   ================================================================ */

export class CmiProvider implements PaymentProvider {
  readonly name = "cmi";
  readonly displayName = "Carte bancaire (CMI)";
  readonly supportedCurrencies: Currency[] = ["MAD"];

  async initiatePayment(
    req: PaymentInitRequest,
  ): Promise<PaymentInitResponse> {
    const config = getCmiConfig();
    const amountFormatted = formatCmiAmount(req.amount);

    // Parametres du formulaire (hors hash, qui est calcule ensuite)
    const formParams: Record<string, string> = {
      clientid: config.clientId,
      oid: req.orderId,
      amount: amountFormatted,
      currency: "504",
      okUrl: req.okUrl,
      failUrl: req.failUrl,
      callbackUrl: config.callbackUrl,
      shopurl: req.failUrl,
      email: req.customerEmail,
      BillToName: req.customerName,
      description: req.description,
      lang: "fr",
      hashAlgorithm: "ver3",
      storetype: "3D_PAY_HOSTING",
      trantype: "PreAuth",
      rnd: Date.now().toString(),
    };

    // Hash ver3 calcule sur l'ensemble des parametres ci-dessus
    const hash = await computeVer3Hash(formParams, config.storeKey);
    formParams.HASH = hash;
    // encoding ajoute APRES le calcul (exclu du hash)
    formParams.encoding = "UTF-8";

    const formFields = Object.entries(formParams)
      .map(
        ([name, value]) =>
          '<input type="hidden" name="' +
          escapeHtml(name) +
          '" value="' +
          escapeHtml(value) +
          '" />',
      )
      .join("\n");

    const safeGatewayUrl = escapeHtml(config.gatewayUrl);

    const formHtml =
      "<!DOCTYPE html>\n" +
      '<html lang="fr">\n' +
      "<head>\n" +
      '  <meta charset="UTF-8" />\n' +
      "  <title>Redirection vers le paiement CMI</title>\n" +
      "  <style>\n" +
      "    body { display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#000;color:#fff;font-family:'Inter',system-ui,sans-serif; }\n" +
      "    .loader { text-align:center; }\n" +
      "    .spinner { width:40px;height:40px;border:3px solid #333;border-top-color:#C9A84C;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto 16px; }\n" +
      "    @keyframes spin { to { transform:rotate(360deg); } }\n" +
      "    p { color:#B0B0B0;font-size:14px; }\n" +
      "  </style>\n" +
      "</head>\n" +
      "<body>\n" +
      '  <div class="loader">\n' +
      '    <div class="spinner"></div>\n' +
      "    <p>Redirection vers le paiement securise CMI...</p>\n" +
      "  </div>\n" +
      '  <form id="cmi-form" action="' +
      safeGatewayUrl +
      '" method="POST">\n' +
      "    " +
      formFields +
      "\n" +
      "  </form>\n" +
      "  <script>document.getElementById('cmi-form').submit();</script>\n" +
      "</body>\n" +
      "</html>";

    return {
      formHtml,
      transactionId: req.orderId,
    };
  }

  async verifyCallback(
    callback: PaymentCallback,
  ): Promise<PaymentVerificationResult> {
    const config = getCmiConfig();

    // Recalcule le hash ver3 sur l'ensemble des champs renvoyes par CMI
    const flat: Record<string, string> = {};
    for (const [k, v] of Object.entries(callback.rawBody || {})) {
      flat[k] = Array.isArray(v) ? v.join(",") : String(v ?? "");
    }

    const computed = await computeVer3Hash(flat, config.storeKey);
    const received = callback.HASH || "";
    // Comparaison à temps constant : empêche un attaquant de deviner le
    // hash signature octet par octet en mesurant le temps de réponse.
    const hashValid = received.length > 0 && safeEqual(computed, received);

    // CMI renvoie ProcReturnCode "00" et Response "Approved" en cas de succes
    const approved =
      callback.Response === "Approved" || callback.ProcReturnCode === "00";
    const isSuccess = hashValid && approved;

    return {
      success: isSuccess,
      orderId: callback.oid || "",
      amount: Math.round(parseFloat(callback.amount || "0") * 100),
      transactionId: callback.TransId,
      errorCode: hashValid ? callback.ProcReturnCode || undefined : "HASH_INVALID",
      errorMessage: isSuccess
        ? undefined
        : !hashValid
          ? "Signature CMI invalide"
          : callback.ErrMsg || "Paiement echoue",
    };
  }
}
