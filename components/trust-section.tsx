import { ShieldCheck, Eye, Headphones, Zap } from "lucide-react"

const features = [
  {
    icon: ShieldCheck,
    titre: "Biens v\u00e9rifi\u00e9s",
    description: "Chaque bien est visit\u00e9 et v\u00e9rifi\u00e9 par notre \u00e9quipe avant publication. Photos r\u00e9elles garanties.",
  },
  {
    icon: Eye,
    titre: "Transparence totale",
    description: "Prix clairs, pas de frais cach\u00e9s. Toutes les informations sont disponibles avant votre visite.",
  },
  {
    icon: Headphones,
    titre: "Accompagnement",
    description: "Notre \u00e9quipe vous accompagne du premier contact jusqu'\u00e0 la signature. Assistance WhatsApp disponible.",
  },
  {
    icon: Zap,
    titre: "Rapidit\u00e9",
    description: "Trouvez votre bien en quelques clics gr\u00e2ce \u00e0 notre recherche avanc\u00e9e et nos alertes personnalis\u00e9es.",
  },
]

export default function TrustSection() {
  return (
    <section className="bg-[#0B1F3A] py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-10 text-center">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#C9A227]">
            Pourquoi nous choisir
          </p>
          <h2 className="font-heading text-2xl font-bold text-white md:text-3xl text-balance">
            La confiance au c{"œ"}ur de notre service
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#C9A227]/20">
                <f.icon className="h-6 w-6 text-[#C9A227]" />
              </div>
              <h3 className="mb-2 font-heading text-base font-semibold text-white">
                {f.titre}
              </h3>
              <p className="text-sm leading-relaxed text-white/60">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
