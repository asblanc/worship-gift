import Navbar from "@/components/Navbar";

export default function AProposPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        {/* Hero section de page */}
        <section className="border-b border-white/10 px-6 py-20 md:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-heading text-5xl font-bold text-[#C9A84C] md:text-6xl">
              À propos
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-300">
              Worship Gift est un mouvement gospel né d'une passion commune
              pour la louange et l'adoration. Notre mission est de créer
              des espaces où la musique devient une rencontre avec Dieu.
            </p>
          </div>
        </section>

        {/* Vision */}
        <section className="px-6 py-16 md:py-20">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-12 md:grid-cols-2">
              <div>
                <h2 className="font-heading text-3xl font-semibold text-white">
                  Notre vision
                </h2>
                <p className="mt-4 leading-relaxed text-gray-400">
                  Voir une génération transformée par la puissance de la louange,
                  où chaque voix trouve sa place dans l'unité du corps de
                  Christ. Nous croyons que le gospel est un langage universel qui
                  parle au cœur de l'homme.
                </p>
              </div>
              <div>
                <h2 className="font-heading text-3xl font-semibold text-white">
                  Notre mission
                </h2>
                <p className="mt-4 leading-relaxed text-gray-400">
                  Rassembler, former et équiper des adorateurs passionnés pour
                  impacter notre génération par la musique gospel. À travers des
                  événements, des formations et des rencontres, nous semons
                  l'espérance et la joie.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Valeurs */}
        <section className="bg-white/[0.02] px-6 py-16 md:py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-heading text-center text-3xl font-semibold text-[#C9A84C]">
              Nos valeurs
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                { title: "Louange", desc: "Au centre de tout ce que nous faisons. La musique comme offrande et rencontre." },
                { title: "Unité", desc: "Au-delà des différences, nous formons un seul corps pour une même adoration." },
                { title: "Excellence", desc: "Offrir le meilleur de nous-mêmes pour la gloire de Dieu, avec professionnalisme et cœur." },
              ].map((valeur) => (
                <div key={valeur.title} className="rounded-lg border border-white/10 p-6">
                  <h3 className="font-heading text-xl font-semibold text-white">{valeur.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-400">{valeur.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}