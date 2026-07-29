import { NextRequest, NextResponse } from "next/server";

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // NextRequest.ip a été retiré depuis Next 15 : l'IP provient uniquement
  // des en-têtes proxy (x-forwarded-for / x-real-ip) posés par Vercel.
  return "unknown";
}

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

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const ip = getClientIp(request);
  const userAgent = request.headers.get("user-agent") || "unknown";
  const referer = request.headers.get("referer") || "direct";

  if (shouldAudit(pathname)) {
    console.info("[request-audit]", {
      timestamp: new Date().toISOString(),
      method: request.method,
      path: pathname,
      ip,
      userAgent,
      referer,
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)).*)",
  ],
};
