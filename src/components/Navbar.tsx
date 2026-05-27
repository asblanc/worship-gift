"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "À propos", href: "/a-propos" },
  { label: "Galerie", href: "/galerie" },
  { label: "YouTube", href: "/youtube" },
  { label: "Billetterie", href: "/billetterie" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

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

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="relative text-sm font-medium text-gray-300 transition-colors hover:text-[#C9A84C]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

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
                    className="block rounded-md px-4 py-3 text-base font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-[#C9A84C]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}