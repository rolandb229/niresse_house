import Link from "next/link"
import {
  Home,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Facebook,
  Instagram,
  ArrowUpRight,
} from "lucide-react"

const services = [
  { href: "/recherche?type=location", label: "Location longue durée" },
  { href: "/recherche?type=vente", label: "Vente immobilière" },
  { href: "/recherche?type=appartement_meuble", label: "Appartements meublés" },
  { href: "/recherche?type=hotel", label: "Hôtels" },
  { href: "/recherche?type=auberge", label: "Auberges" },
  { href: "/recherche?type=court_sejour", label: "Court séjour" },
]

const cities = [
  "Cotonou",
  "Abomey-Calavi",
  "Porto-Novo",
  "Parakou",
  "Bohicon",
  "Savalou",
]

const company = [
  { href: "/promotions", label: "Promotions", highlight: true },
  { href: "/recherche", label: "Tous les biens" },
  { href: "/connexion", label: "Espace client" },
  { href: "/inscription", label: "Créer un compte" },
]

export default function Footer() {
  return (
    <footer className="bg-[#081628] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          <div>
            <Link href="/" className="mb-5 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C9A227]/15 ring-1 ring-[#C9A227]/30">
                <Home className="h-5 w-5 text-[#C9A227]" />
              </div>
              <span className="font-heading text-lg font-bold">
                Niresse<span className="text-[#C9A227]">House</span>
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-white/65">
              Votre partenaire immobilier de confiance au Bénin. Location, vente, hôtels et auberges vérifiés dans les 12 départements.
            </p>

            <div className="mt-6 flex gap-2">
              <a
                href="https://wa.me/0166369842"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition hover:border-[#1DB954] hover:bg-[#1DB954] hover:text-white"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition hover:border-[#C9A227] hover:bg-[#C9A227] hover:text-white"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition hover:border-[#C9A227] hover:bg-[#C9A227] hover:text-white"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-5 font-heading text-xs font-semibold uppercase tracking-widest text-[#C9A227]">
              Nos services
            </h3>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="text-sm text-white/70 transition hover:text-[#C9A227]"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 font-heading text-xs font-semibold uppercase tracking-widest text-[#C9A227]">
              Villes populaires
            </h3>
            <ul className="space-y-2.5">
              {cities.map((c) => (
                <li key={c}>
                  <Link
                    href={`/recherche?ville=${c}`}
                    className="text-sm text-white/70 transition hover:text-[#C9A227]"
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="mb-3 mt-7 font-heading text-xs font-semibold uppercase tracking-widest text-[#C9A227]">
              Plateforme
            </h3>
            <ul className="space-y-2.5">
              {company.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className={`text-sm transition hover:text-[#C9A227] ${
                      c.highlight ? "text-[#C9A227]" : "text-white/70"
                    }`}
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 font-heading text-xs font-semibold uppercase tracking-widest text-[#C9A227]">
              Contact
            </h3>
            <a
              href="https://wa.me/0166369842"
              target="_blank"
              rel="noopener noreferrer"
              className="group mb-4 flex items-center gap-3 rounded-xl border border-[#1DB954]/30 bg-[#1DB954]/10 p-3 transition hover:border-[#1DB954] hover:bg-[#1DB954]/15"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1DB954]/20 text-[#1DB954]">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#1DB954]">
                  WhatsApp 7j/7
                </p>
                <p className="text-sm font-medium text-white">01 66 36 98 42</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-[#1DB954] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="tel:0166369842"
                  className="flex items-center gap-2 text-white/70 transition hover:text-[#C9A227]"
                >
                  <Phone className="h-4 w-4 text-[#C9A227]" />
                  01 66 36 98 42
                </a>
              </li>
              <li>
                <a
                  href="mailto:niressedigital@gmail.com"
                  className="flex items-center gap-2 text-white/70 transition hover:text-[#C9A227]"
                >
                  <Mail className="h-4 w-4 text-[#C9A227]" />
                  niressedigital@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-white/70">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A227]" />
                Bénin · 12 départements
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-xs text-white/45">
            © 2026 NiresseHouse. Tous droits réservés. Plateforme immobilière du Bénin.
          </p>
          <div className="flex gap-5 text-xs text-white/45">
            <a href="#" className="transition hover:text-[#C9A227]">Mentions légales</a>
            <a href="#" className="transition hover:text-[#C9A227]">Conditions générales</a>
            <a href="#" className="transition hover:text-[#C9A227]">Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
