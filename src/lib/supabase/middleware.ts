import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // Canonicalisation : rediriger l'ancien domaine Vercel vers le domaine
  // principal (évite le contenu dupliqué dans Google). On cible UNIQUEMENT
  // le host de prod vercel.app — les déploiements de preview ne sont pas touchés.
  const host = request.headers.get("host") || "";
  if (host === "worship-gift.vercel.app") {
    const url = request.nextUrl.clone();
    url.protocol = "https";
    url.host = "www.worship-gift.com";
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Redirection après login : admin → /admin, utilisateur normal → /account
  if (user && pathname.startsWith("/auth/login")) {
    const url = request.nextUrl.clone();
    const isAdmin = user.app_metadata?.role === "admin";
    url.pathname = isAdmin ? "/admin" : "/account";
    return NextResponse.redirect(url);
  }

  // /dashboard (ancien) → /account (nouveau) si connecté
  if (pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = user ? "/account" : "/auth/login";
    return NextResponse.redirect(url);
  }

  // Protéger /account
  if (!user && pathname.startsWith("/account")) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // Protéger /admin — rediriger vers /auth/login si non connecté ou non admin
  if (pathname.startsWith("/admin")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }

    const isAdmin = user.app_metadata?.role === "admin";
    if (!isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = "/account";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}