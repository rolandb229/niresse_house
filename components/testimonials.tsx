import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    nom: "Marie Agbossou",
    ville: "Abomey-Calavi",
    texte: "J'ai trouv\u00e9 mon appartement en moins d'une semaine gr\u00e2ce \u00e0 ImmoBénin. Le processus \u00e9tait simple et les biens v\u00e9rifi\u00e9s. Je recommande vivement !",
    note: 5,
  },
  {
    nom: "Sédro Kpadonou",
    ville: "Parakou",
    texte: "Excellente plateforme ! J'ai pu vendre ma maison rapidement. L'\u00e9quipe est professionnelle et tr\u00e8s r\u00e9active. Merci ImmoBénin.",
    note: 5,
  },
  {
    nom: "Rachida Moussa",
    ville: "Dassa-Zoum\u00e9",
    texte: "Tr\u00e8s satisfaite de mon exp\u00e9rience. Les photos sont r\u00e9elles, les prix transparents. C'est la meilleure plateforme immobili\u00e8re au B\u00e9nin.",
    note: 4,
  },
]

export default function Testimonials() {
  return (
    <section className="bg-background py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-10 text-center">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#C9A227]">
            T{"é"}moignages
          </p>
          <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl text-balance">
            Ce que disent nos clients
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <Quote className="mb-3 h-8 w-8 text-[#C9A227]/30" />
              <p className="mb-4 text-sm leading-relaxed text-card-foreground/80">
                {t.texte}
              </p>
              <div className="mb-2 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={`h-4 w-4 ${
                      j < t.note ? "fill-[#C9A227] text-[#C9A227]" : "text-border"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm font-semibold text-card-foreground">{t.nom}</p>
              <p className="text-xs text-muted-foreground">{t.ville}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
