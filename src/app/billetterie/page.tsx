import Navbar from "@/components/Navbar";
import Link from "next/link";

const evenements = [
  {
    titre: "Concert de louange – Printemps 2026",
    date: "15 juin 2026",
    lieu: "Église Béthel, Paris",
    statut: "À venir",
  },
  {
    titre: "Soirée d'adoration – Session Spéciale",
    date: "12 juillet 2026",
    lieu: "Centre Évangélique, Lyon",
    statut: "À venir",
  },
];

export default function BilletteriePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        <section className="border-b border-white/10 px-6 py-20 md:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-heading text-5xl font-bold text-[#C9A84C] md:text-6xl">
              Billetterie
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-300">
              Réserve ta place pour nos prochains événements. Vis chaque
              moment de louange et d'adoration au cœur du mouvement
              Worship Gift.
            </p>
          </div>
        </section>

        {/* Liste des événements */}
        <section className="px-6 py-16 md:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-heading text-3xl font-semibold text-white">
              Événements à venir
            </h2>
            <div className="mt-8 space-y-4">
              {evenements.map((event) => (
                <div
                  key={event.titre}
                  className="flex flex-col gap-4 rounded-lg border border-white/10 p-6 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-white">
                      {event.titre}
                    </h3>
                    <p className="mt-1 text-sm text-gray-400">
                      {event.date} — {event.lieu}
                    </p>
                    <span className="mt-2 inline-block rounded-full bg-[#C9A84C]/20 px-3 py-0.5 text-xs font-medium text-[#C9A84C]">
                      {event.statut}
                    </span>
                  </div>
                  <Link
                    href="#"
                    className="inline-flex h-10 shrink-0 items-center justify-center rounded-md bg-[#C9A84C] px-6 text-sm font-medium text-black transition-colors hover:bg-[#F0CB6A]"
                  >
                    Réserver
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA global */}
        <section className="px-6 py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-3xl font-semibold text-white">
              Tu veux être informé des prochains événements ?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-400">
              Suis-nous sur nos réseaux pour ne rien manquer.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="#"
                className="inline-flex h-12 items-center justify-center rounded-md bg-[#C9A84C] px-8 text-sm font-medium text-black transition-colors hover:bg-[#F0CB6A]"
              >
                Voir la billetterie
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}