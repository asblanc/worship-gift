import Navbar from "@/components/Navbar";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        <section className="border-b border-white/10 px-6 py-20 md:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-heading text-5xl font-bold text-[#C9A84C] md:text-6xl">
              Contact
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-300">
              Tu souhaites nous contacter, rejoindre le mouvement ou simplement
              en savoir plus ? Écris-nous, nous serons ravis de t'accueillir.
            </p>
          </div>
        </section>

        <section className="px-6 py-16 md:py-20">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-12 md:grid-cols-2">
              {/* Infos de contact */}
              <div className="space-y-8">
                <div>
                  <h2 className="font-heading text-3xl font-semibold text-white">
                    Nous contacter
                  </h2>
                  <p className="mt-4 leading-relaxed text-gray-400">
                    N'hésite pas à nous joindre directement par téléphone ou à nous suivre sur nos réseaux sociaux pour rester connecté à la louange.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="rounded-lg border border-white/10 p-6 bg-white/[0.02]">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      Téléphone
                    </h3>
                    <a
                      href="tel:+212698472691"
                      className="mt-2 block text-xl font-medium text-white hover:text-[#C9A84C] transition-colors"
                    >
                      +212 698472691
                    </a>
                  </div>

                  <div className="rounded-lg border border-white/10 p-6 bg-white/[0.02]">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      Présence en ligne
                    </h3>
                    <div className="mt-3 flex flex-col gap-3">
                      <a
                        href="https://www.facebook.com/share/18vm7d1oo7/?mibextid=wwXIfr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-[#C9A84C] transition-colors flex items-center gap-2"
                      >
                        <span className="h-2 w-2 rounded-full bg-[#C9A84C]" />
                        Page Facebook Officielle
                      </a>
                      <a
                        href="https://youtube.com/@worshipgift?si=p_dA17hA9vSGRrI7"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-[#C9A84C] transition-colors flex items-center gap-2"
                      >
                        <span className="h-2 w-2 rounded-full bg-[#C9A84C]" />
                        Chaîne YouTube Officielle
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formulaire */}
              <div>
                <h2 className="font-heading text-3xl font-semibold text-white">
                  Envoie-nous un message
                </h2>
                <form className="mt-8 space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="nom" className="block text-sm font-medium text-gray-300">
                        Nom complet
                      </label>
                      <input
                        type="text"
                        id="nom"
                        placeholder="Ton nom"
                        className="mt-2 block w-full rounded-md border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none ring-0 transition-colors focus:border-[#C9A84C]"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                        Adresse email
                      </label>
                      <input
                        type="email"
                        id="email"
                        placeholder="ton@email.com"
                        className="mt-2 block w-full rounded-md border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none ring-0 transition-colors focus:border-[#C9A84C]"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                      Votre message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="Écris ton message ici..."
                      className="mt-2 block w-full rounded-md border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none ring-0 transition-colors focus:border-[#C9A84C] resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex h-12 items-center justify-center rounded-md bg-[#C9A84C] px-8 text-sm font-medium text-black transition-colors hover:bg-[#F0CB6A]"
                  >
                    Envoyer le message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}