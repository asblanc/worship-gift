/* ================================================================
   Worship Gift — POST /api/contact
   Reçoit le formulaire de contact et envoie le message à l'équipe
   (contact@worship-gift.com) via Resend, avec reply-to = visiteur.
   ================================================================ */

import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  // Anti-spam : 5 messages / minute / IP
  const limited = rateLimit(request, "contact", 5, 60_000);
  if (limited) return limited;

  try {
    const body = await request.json();
    const name = String(body.name || "").trim().slice(0, 120);
    const email = String(body.email || "").trim().slice(0, 254);
    const message = String(body.message || "").trim().slice(0, 5000);

    if (name.length < 2 || !EMAIL_RE.test(email) || message.length < 5) {
      return NextResponse.json(
        { success: false, error: "Merci de remplir correctement le nom, l'email et le message." },
        { status: 400 },
      );
    }

    const ok = await sendContactEmail({ name, email, message });
    if (!ok) {
      return NextResponse.json(
        { success: false, error: "Envoi indisponible pour le moment. Réessaie plus tard ou écris-nous sur WhatsApp." },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API Contact] Erreur:", error);
    return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 });
  }
}
