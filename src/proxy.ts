import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") || "unknown";
}

// Chemins sensibles dont on trace les accès (audit léger dans les logs Vercel).
function shouldAudit(pathname: string) {
  return [
    "/admin",
    "/auth/login",
    "/billetterie",
    "/api/admin",
    "/api/orders",
    "/api/payment",
  ].some((prefix) => pathname === prefix || pathname.startsWith(prefix));
}

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (shouldAudit(pathname)) {
    console.info("[request-audit]", {
      timestamp: new Date().toISOString(),
      method: request.method,
      path: pathname,
      ip: getClientIp(request),
      userAgent: request.headers.get("user-agent") || "unknown",
      referer: request.headers.get("referer") || "direct",
    });
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
