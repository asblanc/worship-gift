/* ================================================================
   Worship Gift — POST /api/admin/orders/notify
   Envoie l'e-mail « commande reçue / traitement en cours » à TOUTES
   les commandes actives disposant d'un e-mail — sauf les commandes
   de test (noms exclus). Réservé aux admins.
   Déclenché manuellement depuis le tableau de bord (l'admin garde la
   main). Les commandes futures sont notifiées automatiquement.
   ================================================================ */

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isRequestAdmin } from "@/lib/supabase/require-admin";
import { rateLimitAsync } from "@/lib/rate-limit";
import { sendOrderReceived } from "@/lib/email";

// Commandes de test à ne jamais notifier
const TEST_NAME = /zozo|anoh|leatissia|blanchard|\bsery\b/i;

export async function POST(request: NextRequest) {
  const limited = await rateLimitAsync(request, "admin-notify", 5, 60_000);
  if (limited) return limited;

  if (!(await isRequestAdmin())) {
    return NextResponse.json({ success: false, error: "Accès refusé" }, { status: 403 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { success: false, error: "E-mail non configuré (RESEND_API_KEY manquante)." },
      { status: 400 },
    );
  }

  try {
    const supabase = createAdminClient();
    const { data: orders } = await supabase
      .from("orders")
      .select("id, customer_name, customer_email")
      .in("status", ["pending", "reserved", "paid"])
      .not("customer_email", "is", null);

    let sent = 0;
    let skipped = 0;
    const skippedTest: string[] = [];

    for (const o of orders || []) {
      const name = (o.customer_name as string) || "";
      if (!o.customer_email || TEST_NAME.test(name)) {
        skipped++;
        if (TEST_NAME.test(name)) skippedTest.push(name);
        continue;
      }
      const ok = await sendOrderReceived(o.id as string);
      if (ok) sent++;
      else skipped++;
    }

    return NextResponse.json({
      success: true,
      total: orders?.length || 0,
      sent,
      skipped,
      skippedTest: [...new Set(skippedTest)],
    });
  } catch (error) {
    console.error("[API Admin Notify] Erreur:", error);
    return NextResponse.json({ success: false, error: "Erreur interne" }, { status: 500 });
  }
}
