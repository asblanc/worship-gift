/* ================================================================
   Worship Gift — POST /api/admin/tickets/validate
   Validation d'un billet à l'entrée (réservé aux admins).
   Transition valid -> used, idempotence stricte :
   - billet inexistant      -> 404
   - billet déjà used       -> 409 (avec date d'utilisation)
   - billet cancelled       -> 409
   - billet valid           -> marqué used (+ used_at) -> 200

   Corps : { "code": "WG-...-T001-XXXX" }
   ================================================================ */

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isRequestAdmin } from "@/lib/supabase/require-admin";
import { rateLimitAsync } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const limited = await rateLimitAsync(request, "ticket-validate", 60, 60_000);
  if (limited) return limited;

  if (!(await isRequestAdmin())) {
    return NextResponse.json({ ok: false, error: "Accès refusé" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const code = typeof body.code === "string" ? body.code.trim() : "";
    if (!code) {
      return NextResponse.json({ ok: false, error: "Code manquant" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: ticket } = await supabase
      .from("tickets")
      .select("id, ticket_code, event_title, event_date, event_time, customer_name, ticket_type, status, used_at")
      .eq("ticket_code", code)
      .single();

    if (!ticket) {
      return NextResponse.json(
        { ok: false, status: "not_found", error: "Billet introuvable" },
        { status: 404 },
      );
    }

    if (ticket.status === "used") {
      return NextResponse.json(
        { ok: false, status: "already_used", ticket, error: "Billet déjà utilisé" },
        { status: 409 },
      );
    }
    if (ticket.status === "cancelled") {
      return NextResponse.json(
        { ok: false, status: "cancelled", ticket, error: "Billet annulé" },
        { status: 409 },
      );
    }

    // Transition atomique valid -> used (la clause .eq('status','valid')
    // évite une double validation concurrente)
    const usedAt = new Date().toISOString();
    const { data: updated, error: updErr } = await supabase
      .from("tickets")
      .update({ status: "used", used_at: usedAt })
      .eq("id", ticket.id)
      .eq("status", "valid")
      .select("id")
      .single();

    if (updErr || !updated) {
      return NextResponse.json(
        { ok: false, status: "already_used", ticket, error: "Billet déjà utilisé" },
        { status: 409 },
      );
    }

    return NextResponse.json({
      ok: true,
      status: "validated",
      ticket: { ...ticket, status: "used", used_at: usedAt },
    });
  } catch (error) {
    console.error("[Ticket Validate] Erreur:", error);
    return NextResponse.json({ ok: false, error: "Erreur interne du serveur" }, { status: 500 });
  }
}
