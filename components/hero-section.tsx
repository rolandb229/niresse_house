"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Search, MapPin, Home, DollarSign, Hotel, Building2, Key, BedDouble, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PROPERTY_TYPES, DEPARTEMENTS_BENIN } from "@/lib/types"

const typeIcons: Record<string, React.ReactNode> = {
  location: <Key className="h-4 w-4" />,
  vente: <Home className="h-4 w-4" />,
  court_sejour: <Calendar className="h-4 w-4" />,
  auberge: <Building2 className="h-4 w-4" />,
  hotel: <Hotel className="h-4 w-4" />,
  chambre_meublee: <BedDouble className="h-4 w-4" />,
  appartement_meuble: <Building2 className="h-4 w-4" />,
}

export default function HeroSection() {
  const router = useRouter()
  const [type, setType] = useState("location")
  const [departement, setDepartement] = useState("")
  const [ville, setVille] = useState("")
  const [keyword, setKeyword] = useState("")
  const [prixMax, setPrixMax] = useState("")

  const villes = departement ? DEPARTEMENTS_BENIN[departement as keyof typeof DEPARTEMENTS_BENIN] || [] : []

  function handleSearch() {
    const params = new URLSearchParams()
    if (type) params.set("type", type)
    if (departement) params.set("departement", departement)
    if (ville) params.set("ville", ville)
    if (keyword) params.set("keyword", keyword)
    if (prixMax) params.set("prix_max", prixMax)
    router.push(`/recherche?${params.toString()}`)
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <section className="relative flex min-h-[650px] items-center justify-center overflow-hidden lg:min-h-[750px]">
      {/* Background Image */}
      <Image
        src="/images/hero-bg.jpg"
        alt="Immobilier au B\u00e9nin - NiresseHouse"
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#0B1F3A]/80" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-16 text-center">
        <h1 className="font-heading text-3xl font-bold leading-tight text-white md:text-5xl lg:text-6xl text-balance">
          {"Trouvez votre logement id\u00e9al au B\u00e9nin"}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
          {"Location, vente, auberges, h\u00f4tels et appartements meubl\u00e9s dans les 12 d\u00e9partements du B\u00e9nin"}
        </p>

        {/* Search Bar */}
        <div className="mx-auto mt-8 max-w-5xl rounded-xl bg-white p-4 shadow-2xl md:p-6">
          {/* Type Tabs */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {Object.entries(PROPERTY_TYPES).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setType(key)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition md:text-sm ${
                  type === key
                    ? "bg-[#0B1F3A] text-white"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {typeIcons[key]}
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{label.split(" ")[0]}</span>
              </button>
            ))}
          </div>

          {/* Global Search Input */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher par mot-cl\u00e9 (villa, piscine, climatisation, WiFi...)"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-4 md:gap-4">
            {/* D\u00e9partement */}
            <div>
              <label className="mb-1 flex items-center gap-1 text-xs font-medium text-foreground/60">
                <MapPin className="h-3 w-3" />
                {"D\u00e9partement"}
              </label>
              <select
                value={departement}
                onChange={(e) => {
                  setDepartement(e.target.value)
                  setVille("")
                }}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
              >
                <option value="">Tous les {"d\u00e9partements"}</option>
                {Object.keys(DEPARTEMENTS_BENIN).map((dep) => (
                  <option key={dep} value={dep}>{dep}</option>
                ))}
              </select>
            </div>

            {/* Ville */}
            <div>
              <label className="mb-1 flex items-center gap-1 text-xs font-medium text-foreground/60">
                <MapPin className="h-3 w-3" />
                Ville
              </label>
              <select
                value={ville}
                onChange={(e) => setVille(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                disabled={!departement}
              >
                <option value="">Toutes les villes</option>
                {villes.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            {/* Budget */}
            <div>
              <label className="mb-1 flex items-center gap-1 text-xs font-medium text-foreground/60">
                <DollarSign className="h-3 w-3" />
                Budget max (FCFA)
              </label>
              <input
                type="number"
                placeholder="Ex: 200000"
                value={prixMax}
                onChange={(e) => setPrixMax(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
              />
            </div>

            {/* CTA */}
            <div className="flex items-end">
              <Button
                onClick={handleSearch}
                className="w-full bg-[#C9A227] text-white hover:bg-[#C9A227]/90 px-8 py-2.5 font-medium"
              >
                <Search className="mr-2 h-4 w-4" />
                Rechercher
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-6 md:gap-10">
          <div className="text-center">
            <p className="font-heading text-2xl font-bold text-[#C9A227] md:text-3xl">500+</p>
            <p className="text-xs text-white/70 md:text-sm">Biens disponibles</p>
          </div>
          <div className="text-center">
            <p className="font-heading text-2xl font-bold text-[#C9A227] md:text-3xl">12</p>
            <p className="text-xs text-white/70 md:text-sm">{"D\u00e9partements"}</p>
          </div>
          <div className="text-center">
            <p className="font-heading text-2xl font-bold text-[#C9A227] md:text-3xl">50+</p>
            <p className="text-xs text-white/70 md:text-sm">{"H\u00f4tels partenaires"}</p>
          </div>
          <div className="text-center">
            <p className="font-heading text-2xl font-bold text-[#C9A227] md:text-3xl">2000+</p>
            <p className="text-xs text-white/70 md:text-sm">Clients satisfaits</p>
          </div>
        </div>
      </div>
    </section>
  )
}
