/* ================================================================
   Worship Gift — POST /api/admin/test-email
   Envoie un e-mail de test (design de confirmation) à l'adresse
   fournie, pour vérifier la configuration Resend. Réservé aux admins.
   Corps : { "to": "adresse@exemple.com" }
   ================================================================ */

import { NextRequest, NextResponse } from "next/server";
import { isRequestAdmin } from "@/lib/supabase/require-admin";
import { rateLimitAsync } from "@/lib/rate-limit";
import { sendTestEmail } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const limited = await rateLimitAsync(request, "admin-test-email", 20, 60_000);
  if (limited) return limited;

  if (!(await isRequestAdmin())) {
    return NextResponse.json({ success: false, error: "Accès refusé" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const to = String(body.to || "").trim().slice(0, 254);
    if (!EMAIL_RE.test(to)) {
      return NextResponse.json({ success: false, error: "Adresse e-mail invalide" }, { status: 400 });
    }

    const result = await sendTestEmail(to);
    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API Admin Test Email] Erreur:", error);
    return NextResponse.json({ success: false, error: "Erreur interne" }, { status: 500 });
  }
}
