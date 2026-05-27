import Link from "next/link";
import Image from "next/image";

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
              Un mouvement gospel pour louer, adorer et unir à travers la musique. Une offrande musicale pour la gloire de Dieu.
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
                  YouTube
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
              <li>
                <span className="text-gray-500">Tél :</span>{" "}
                <a
                  href="tel:+212698472691"
                  className="hover:text-[#C9A84C] transition-colors text-white"
                >
                  +212 698472691
                </a>
              </li>
              <li className="flex gap-4 pt-2">
                <a
                  href="https://www.facebook.com/share/18vm7d1oo7/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C9A84C] transition-colors"
                  aria-label="Facebook"
                >
                  Facebook
                </a>
                <a
                  href="https://youtube.com/@worshipgift?si=p_dA17hA9vSGRrI7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C9A84C] transition-colors"
                  aria-label="YouTube"
                >
                  YouTube
                </a>
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