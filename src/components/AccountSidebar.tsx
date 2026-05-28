"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/* ================================================================
   Worship Gift — AccountSidebar (navigation espace utilisateur)
   Onglets : Tableau de bord | Mes commandes | Profil
   ================================================================ */

const links = [
  { href: "/account", label: "Tableau de bord", icon: "📊" },
  { href: "/account/orders", label: "Mes commandes", icon: "🎫" },
  // TODO: Activer quand la page profil sera prête
  // { href: "/account/profile", label: "Mon profil", icon: "👤" },
];

export default function AccountSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1" aria-label="Navigation compte">
      {links.map((link) => {
        const isActive =
          link.href === "/account"
            ? pathname === "/account"
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
              isActive
                ? "bg-[#C9A84C]/15 text-[#C9A84C] border border-[#C9A84C]/30"
                : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
            }`}
          >
            <span className="text-base">{link.icon}</span>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}