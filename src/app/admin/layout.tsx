"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

/* ================================================================
   Worship Gift — Layout administrateur /admin
   Sidebar + header, protégé par le middleware.
   ================================================================ */

const sidebarLinks = [
  { href: "/admin", label: "Tableau de bord", icon: "📊" },
  { href: "/admin/orders", label: "Commandes", icon: "📦" },
  { href: "/admin/events", label: "Événements", icon: "🎵" },
  // TODO: Ajouter plus de pages admin ici
  // { href: "/admin/users", label: "Utilisateurs", icon: "👥" },
  // { href: "/admin/stats", label: "Statistiques", icon: "📈" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || user.user_metadata?.role !== "admin") {
        router.push("/admin/login");
        return;
      }
      setUserEmail(user.email || "");
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0A0A0A]/95 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            {/* Burger mobile */}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="rounded-md p-2 text-gray-400 hover:bg-white/5 lg:hidden"
              aria-label="Menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link
              href="/admin"
              className="font-heading text-lg font-bold tracking-wider text-[#C9A84C]"
            >
              Admin WG
            </Link>
            <span className="hidden rounded-full bg-[#C9A84C]/15 px-2.5 py-0.5 text-[10px] font-semibold text-[#C9A84C] sm:inline">
              ADMIN
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="hidden text-xs text-gray-400 hover:text-white sm:inline"
              target="_blank"
            >
              Voir le site ↗
            </Link>
            <span className="hidden text-xs text-gray-500 sm:inline">
              {userEmail}
            </span>
            <button
              onClick={handleLogout}
              className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-gray-400 transition-colors hover:border-red-500/30 hover:text-red-400"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {mobileMenu && (
          <nav className="border-t border-white/10 px-4 py-3 lg:hidden">
            <div className="flex flex-col gap-1">
              {sidebarLinks.map((link) => {
                const isActive =
                  link.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenu(false)}
                    className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-[#C9A84C]/15 text-[#C9A84C]"
                        : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                    }`}
                  >
                    <span>{link.icon}</span>
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </header>

      <div className="flex">
        {/* Sidebar desktop */}
        <aside className="hidden w-56 shrink-0 border-r border-white/10 lg:block">
          <div className="sticky top-16 p-4">
            <nav className="flex flex-col gap-1">
              {sidebarLinks.map((link) => {
                const isActive =
                  link.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-[#C9A84C]/15 text-[#C9A84C] border border-[#C9A84C]/30"
                        : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                    }`}
                  >
                    <span>{link.icon}</span>
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Contenu */}
        <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}