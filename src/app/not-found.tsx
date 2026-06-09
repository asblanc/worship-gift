import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#0D0D0D] px-6 pt-20 text-center">
        <p className="font-heading text-7xl font-bold text-[#C9A84C] md:text-8xl">404</p>
        <h1 className="mt-4 font-heading text-2xl font-bold text-white md:text-3xl">
          Page introuvable
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-300">
          La page que tu cherches n&rsquo;existe pas ou a été déplacée. Reviens à
          l&rsquo;accueil pour continuer l&rsquo;expérience Worship Gift.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-md bg-[#C9A84C] px-6 text-sm font-semibold text-black transition-colors hover:bg-[#F0CB6A]"
          >
            Retour à l&rsquo;accueil
          </Link>
          <Link
            href="/billetterie"
            className="inline-flex h-11 items-center justify-center rounded-md border border-white/15 px-6 text-sm font-medium text-gray-200 transition-colors hover:border-[#C9A84C]/50 hover:text-[#C9A84C]"
          >
            Voir la billetterie
          </Link>
        </div>
      </main>
    </>
  );
}
