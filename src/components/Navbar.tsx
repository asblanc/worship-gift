"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/supabase/auth-context";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "À propos", href: "/a-propos" },
  { label: "Galerie", href: "/galerie" },
  { label: "Médias", href: "/youtube" },
  { label: "Billetterie", href: "/billetterie" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const isActive = (href: string) => pathname === href;

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-8">
        <div className="absolute inset-0 -z-10 border-b border-white/10 bg-black/60 backdrop-blur-md" />

        <Link href="/" className="relative z-10 flex items-center gap-3">
          <div className="rounded-full ring-1 ring-[#C9A84C]/40 p-0.5 shadow-lg shadow-[#C9A84C]/10">
            <Image
              src="/img_worship-gift/logo-worship-gift2.jpeg"
              alt="Worship Gift"
              width={56}
              height={56}
              className="h-12 w-12 rounded-full object-cover md:h-14 md:w-14"
            />
          </div>
          <span className="font-heading text-xl font-bold tracking-wider text-white md:text-2xl">
            Worship Gift
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors duration-300 ${
                    isActive(link.href)
                      ? "text-[#C9A84C]"
                      : "text-gray-300 hover:text-[#C9A84C]"
                  } group`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-[2px] bg-[#C9A84C] transition-all duration-300 ease-out group-hover:w-full ${
                      isActive(link.href) ? "w-full" : "w-0"
                    }`}
                  />
                </Link>
              </li>
            ))}
          </ul>

          {/* Auth sur desktop */}
          {!loading && (
            <>
              {user ? (
                <Link
                  href="/account"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/10 text-sm font-bold text-[#C9A84C] transition-colors hover:bg-[#C9A84C]/20"
                  title="Mon espace"
                  aria-label="Mon espace"
                >
                  {(user.email?.charAt(0) || "?").toUpperCase()}
                </Link>
              ) : (
                <Link
                  href="/auth/login"
                  className="rounded-md border border-[#C9A84C] bg-[#C9A84C]/10 px-4 py-2 text-sm font-semibold text-[#C9A84C] shadow-sm shadow-[#C9A84C]/20 transition-all hover:bg-[#C9A84C] hover:text-black hover:shadow-[#C9A84C]/40"
                >
                  Connexion
                </Link>
              )}
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="relative z-10 flex flex-col gap-1.5 md:hidden"
          aria-label="Menu"
        >
          <motion.span
            animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
            className="block h-0.5 w-6 bg-white"
          />
          <motion.span
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block h-0.5 w-6 bg-white"
          />
          <motion.span
            animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
            className="block h-0.5 w-6 bg-white"
          />
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="border-b border-white/10 bg-black/95 backdrop-blur-lg md:hidden"
          >
            <ul className="flex flex-col gap-2 px-4 pb-6 pt-2">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded-md px-4 py-3 text-base font-medium transition-colors hover:bg-white/[0.08] ${
                      isActive(link.href)
                        ? "text-[#C9A84C] bg-[#C9A84C]/10"
                        : "text-gray-300 hover:text-[#C9A84C]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {/* Auth sur mobile */}
              <li className="border-t border-white/10 pt-2 mt-2">
                {!loading && (
                  <>
                    {user ? (
                      <Link
                        href="/account"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 rounded-md px-4 py-3 text-base font-medium text-[#C9A84C] transition-colors hover:bg-white/[0.08]"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/10 text-sm font-bold">
                          {(user.email?.charAt(0) || "?").toUpperCase()}
                        </span>
                        Mon espace
                      </Link>
                    ) : (
                      <Link
                        href="/auth/login"
                        onClick={() => setMobileOpen(false)}
                        className="block rounded-md border border-[#C9A84C] bg-[#C9A84C]/10 px-4 py-3 text-center text-base font-semibold text-[#C9A84C] transition-all hover:bg-[#C9A84C] hover:text-black"
                      >
                        Connexion
                      </Link>
                    )}
                  </>
                )}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}