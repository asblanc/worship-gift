/* ================================================================
   Worship Gift — CMI Payment Provider
   Implementation de la passerelle CMI (Centre Monetique Interbancaire).
   
   DOC OFFICIELLE CMI : 
   - Formulaire POST vers la gateway CMI avec champs signes
   - Algorithme de hash : SHA-512 (base64(sha512(...)))
   - Callback serveur : CMI POST les resultats sur l'URL callback
   - Verification : recalculer le hash cote serveur et comparer

   CONFIGURATION REQUISE dans .env.local :
   CMI_CLIENT_ID        -> ID marchand fourni par CMI
   CMI_STORE_KEY        -> Cle secrete fournie par CMI
   CMI_GATEWAY_URL_TEST -> https://testpayment.cmi.co.ma/fim/est3Dgate
   CMI_GATEWAY_URL_PROD -> https://payment.cmi.co.ma/fim/est3Dgate
   CMI_OK_URL           -> https://TONSITE.com/billetterie/success
   CMI_FAIL_URL         -> https://TONSITE.com/billetterie/checkout?error=1
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

/* ------------------------------------------------------------------
   Configuration CMI depuis les variables d'environnement
   ------------------------------------------------------------------ */

function getCmiConfig() {
  const env = process.env.PAYMENT_ENV || "test";
  const isProd = env === "prod";

  return {
    clientId: process.env.CMI_CLIENT_ID || "60000000",
    storeKey: process.env.CMI_STORE_KEY || "TEST1234",
    gatewayUrl: isProd
      ? process.env.CMI_GATEWAY_URL_PROD || "https://payment.cmi.co.ma/fim/est3Dgate"
      : process.env.CMI_GATEWAY_URL_TEST || "https://testpayment.cmi.co.ma/fim/est3Dgate",
    okUrl: process.env.CMI_OK_URL || "http://localhost:3000/billetterie/success",
    failUrl: process.env.CMI_FAIL_URL || "http://localhost:3000/billetterie/checkout?error=1",
    callbackUrl: process.env.CMI_CALLBACK_URL || "http://localhost:3000/api/payment/cmi/callback",
    environment: env as "test" | "prod",
  };
}

/* ------------------------------------------------------------------
   Fonction de hash CMI (SHA-512 -> base64)
   Ordre standard (a verifier avec la doc CMI fournie par ta banque) :
   storeKey + clientId + oid + amount + okUrl + failUrl + transactionType + instalmentCount + lang + storeKey
   ------------------------------------------------------------------ */

async function computeCmiHash(params: {
  clientId: string;
  oid: string;
  amount: string;
  okUrl: string;
  failUrl: string;
  storeKey: string;
}): Promise<string> {
  const raw = [
    params.storeKey,
    params.clientId,
    params.oid,
    params.amount,
    params.okUrl,
    params.failUrl,
    "",
    "",
    "fr",
    params.storeKey,
  ].join("");

  const encoder = new TextEncoder();
  const data = encoder.encode(raw);
  const hashBuffer = await crypto.subtle.digest("SHA-512", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashBase64 = btoa(String.fromCharCode(...hashArray));

  return hashBase64;
}

/* ------------------------------------------------------------------
   Verification du hash dans le callback CMI
   ------------------------------------------------------------------ */

async function verifyCmiHash(
  callback: PaymentCallback,
  storeKey: string
): Promise<boolean> {
  const oid = callback.oid || "";
  const amount = callback.amount || "";
  const clientId = callback.rawBody?.clientid?.toString() || "";

  const raw = [
    storeKey,
    clientId,
    oid,
    amount,
    callback.ProcReturnCode || "",
    callback.Response || "",
    callback.TransId || "",
  ].join("");

  const encoder = new TextEncoder();
  const data = encoder.encode(raw);
  const hashBuffer = await crypto.subtle.digest("SHA-512", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const computedHash = btoa(String.fromCharCode(...hashArray));

  return computedHash === (callback.HASH || "");
}

/**
 * Convertit un montant en centimes (entier) vers chaine CMI (ex: 5000 -> "50.00")
 */
function formatCmiAmount(amountInCents: number): string {
  return (amountInCents / 100).toFixed(2);
}

/* ------------------------------------------------------------------
   Echappement HTML (evite les attaques XSS dans le formulaire)
   Utilise String.fromCharCode pour eviter l'interpretation des
   entites HTML dans le code source TypeScript.
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
    req: PaymentInitRequest
  ): Promise<PaymentInitResponse> {
    const config = getCmiConfig();
    const amountFormatted = formatCmiAmount(req.amount);

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
      encoding: "UTF-8",
      storetype: "3D_PAY_HOSTING",
      trantype: "PreAuth",
    };

    const hash = await computeCmiHash({
      clientId: config.clientId,
      oid: req.orderId,
      amount: amountFormatted,
      okUrl: req.okUrl,
      failUrl: req.failUrl,
      storeKey: config.storeKey,
    });

    formParams.hash = hash;
    formParams.HASH = hash;

    const formFields = Object.entries(formParams)
      .map(
        ([name, value]) =>
          '<input type="hidden" name="' +
          escapeHtml(name) +
          '" value="' +
          escapeHtml(value) +
          '" />'
      )
      .join("\n");

    const safeGatewayUrl = escapeHtml(config.gatewayUrl);

    const formHtml =
      '<!DOCTYPE html>\n' +
      '<html lang="fr">\n' +
      '<head>\n' +
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
      '<body>\n' +
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
    callback: PaymentCallback
  ): Promise<PaymentVerificationResult> {
    const config = getCmiConfig();

    const hashValid = await verifyCmiHash(callback, config.storeKey);

    const responseCode = callback.Response || "";
    const isSuccess = hashValid && responseCode === "00";

    return {
      success: isSuccess,
      orderId: callback.oid || "",
      amount: parseFloat(callback.amount || "0") * 100,
      transactionId: callback.TransId,
      errorCode: isSuccess ? undefined : callback.ProcReturnCode || "UNKNOWN",
      errorMessage: isSuccess
        ? undefined
        : callback.ErrMsg || "Paiement echoue",
    };
  }
}