import Link from "next/link";
import Image from "next/image";
import {
  youtubeChannelUrl,
  facebookUrl,
  tiktokUrl,
  emailAddress,
  phoneNumber,
} from "@/lib/youtube-videos";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-12 text-gray-400">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Logo et slogan */}
          <div className="flex flex-col items-start gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="rounded-full ring-1 ring-[#C9A84C]/40 p-0.5 shadow-lg shadow-[#C9A84C]/10">
                <Image
                  src="/img_worship-gift/logo-worship-gift2.jpeg"
                  alt="Worship Gift"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
              </div>
              <span className="font-heading text-lg font-bold tracking-wider text-white">
                Worship Gift
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-gray-500">
              Un mouvement gospel pour louer, adorer et unir à travers la
              musique. Une offrande musicale pour la gloire de Dieu.
            </p>
          </div>

          {/* Liens utiles */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-white">
              Navigation
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <li>
                <Link href="/" className="hover:text-[#C9A84C] transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="hover:text-[#C9A84C] transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/galerie" className="hover:text-[#C9A84C] transition-colors">
                  Galerie
                </Link>
              </li>
              <li>
                <Link href="/youtube" className="hover:text-[#C9A84C] transition-colors">
                  Médias
                </Link>
              </li>
              <li>
                <Link href="/billetterie" className="hover:text-[#C9A84C] transition-colors">
                  Billetterie
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#C9A84C] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact et Réseaux */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-white">
              Nous contacter
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              {/* Email */}
              <li>
                <a
                  href={`mailto:${emailAddress}`}
                  className="inline-flex items-center gap-2 text-gray-400 transition-colors hover:text-[#C9A84C]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  {emailAddress}
                </a>
              </li>

              {/* Téléphone */}
              <li>
                <a
                  href={`tel:${phoneNumber.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 text-gray-400 transition-colors hover:text-[#C9A84C]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  {phoneNumber}
                </a>
              </li>

              {/* Réseaux sociaux */}
              <li className="pt-2">
                <span className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-3">
                  Suivez-nous
                </span>
                <div className="flex gap-4">
                  {/* YouTube */}
                  <a
                    href={youtubeChannelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 transition-colors hover:text-[#C9A84C]"
                    aria-label="YouTube Worship Gift"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>

                  {/* Facebook */}
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 transition-colors hover:text-[#C9A84C]"
                    aria-label="Facebook Worship Gift"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                  </a>

                  {/* TikTok */}
                  <a
                    href={tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 transition-colors hover:text-[#C9A84C]"
                    aria-label="TikTok Worship Gift"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/5 pt-8 text-center text-xs text-gray-600">
          <p>
            &copy; {new Date().getFullYear()} Worship Gift. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}