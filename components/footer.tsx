import Link from "next/link"
import { Home, Phone, Mail, MapPin, MessageCircle } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2">
              <Home className="h-6 w-6 text-accent" />
              <span className="font-heading text-lg font-bold">
                Niresse<span className="text-accent">House</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-primary-foreground/70">
              {"Votre partenaire immobilier de confiance au B\u00e9nin. Location, vente, auberges, h\u00f4tels et appartements meubl\u00e9s dans les 12 d\u00e9partements du B\u00e9nin."}
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-accent">
              Nos Services
            </h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/recherche?type=location" className="text-sm text-primary-foreground/70 transition hover:text-accent">
                  Location longue {"dur\u00e9e"}
                </Link>
              </li>
              <li>
                <Link href="/recherche?type=vente" className="text-sm text-primary-foreground/70 transition hover:text-accent">
                  Vente immobilier
                </Link>
              </li>
              <li>
                <Link href="/recherche?type=auberge" className="text-sm text-primary-foreground/70 transition hover:text-accent">
                  Auberges
                </Link>
              </li>
              <li>
                <Link href="/recherche?type=hotel" className="text-sm text-primary-foreground/70 transition hover:text-accent">
                  {"Chambres d'h\u00f4tel"}
                </Link>
              </li>
              <li>
                <Link href="/recherche?type=appartement_meuble" className="text-sm text-primary-foreground/70 transition hover:text-accent">
                  {"Appartements meubl\u00e9s"}
                </Link>
              </li>
              <li>
                <Link href="/promotions" className="text-sm text-accent transition hover:text-accent/80">
                  Promotions
                </Link>
              </li>
            </ul>
          </div>

          {/* Villes populaires */}
          <div>
            <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-accent">
              Villes Populaires
            </h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/recherche?ville=Cotonou" className="text-sm text-primary-foreground/70 transition hover:text-accent">
                  Cotonou
                </Link>
              </li>
              <li>
                <Link href="/recherche?ville=Abomey-Calavi" className="text-sm text-primary-foreground/70 transition hover:text-accent">
                  Abomey-Calavi
                </Link>
              </li>
              <li>
                <Link href="/recherche?ville=Porto-Novo" className="text-sm text-primary-foreground/70 transition hover:text-accent">
                  Porto-Novo
                </Link>
              </li>
              <li>
                <Link href="/recherche?ville=Parakou" className="text-sm text-primary-foreground/70 transition hover:text-accent">
                  Parakou
                </Link>
              </li>
              <li>
                <Link href="/recherche?ville=Bohicon" className="text-sm text-primary-foreground/70 transition hover:text-accent">
                  Bohicon
                </Link>
              </li>
              <li>
                <Link href="/recherche?ville=Savalou" className="text-sm text-primary-foreground/70 transition hover:text-accent">
                  Savalou
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-accent">
              Contact
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a 
                  href="tel:0166369842" 
                  className="flex items-center gap-2 text-sm text-primary-foreground/70 transition hover:text-accent"
                >
                  <Phone className="h-4 w-4 text-accent" />
                  01 66 36 98 42
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/0166369842" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary-foreground/70 transition hover:text-accent"
                >
                  <MessageCircle className="h-4 w-4 text-accent" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a 
                  href="mailto:niressedigital@gmail.com"
                  className="flex items-center gap-2 text-sm text-primary-foreground/70 transition hover:text-accent"
                >
                  <Mail className="h-4 w-4 text-accent" />
                  niressedigital@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-primary-foreground/70">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {"B\u00e9nin"}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-primary-foreground/10 pt-6 text-center">
          <p className="text-xs text-primary-foreground/50">
            {"\u00a9 2026 NiresseHouse. Tous droits r\u00e9serv\u00e9s. Plateforme immobili\u00e8re digitale au B\u00e9nin."}
          </p>
        </div>
      </div>
    </footer>
  )
}
