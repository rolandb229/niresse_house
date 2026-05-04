"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Search, SlidersHorizontal, X, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PROPERTY_TYPES, DEPARTEMENTS_BENIN } from "@/lib/types"

export default function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "")
  const [type, setType] = useState(searchParams.get("type") || "")
  const [departement, setDepartement] = useState(searchParams.get("departement") || "")
  const [ville, setVille] = useState(searchParams.get("ville") || "")
  const [prixMin, setPrixMin] = useState(searchParams.get("prix_min") || "")
  const [prixMax, setPrixMax] = useState(searchParams.get("prix_max") || "")
  const [chambresMin, setChambresMin] = useState(searchParams.get("chambres_min") || "")
  const [surfaceMin, setSurfaceMin] = useState(searchParams.get("surface_min") || "")
  const [enPromotion, setEnPromotion] = useState(searchParams.get("en_promotion") === "true")
  const [showMore, setShowMore] = useState(false)

  const villes = departement ? DEPARTEMENTS_BENIN[departement as keyof typeof DEPARTEMENTS_BENIN] || [] : []

  useEffect(() => {
    setKeyword(searchParams.get("keyword") || "")
    setType(searchParams.get("type") || "")
    setDepartement(searchParams.get("departement") || "")
    setVille(searchParams.get("ville") || "")
    setPrixMin(searchParams.get("prix_min") || "")
    setPrixMax(searchParams.get("prix_max") || "")
    setChambresMin(searchParams.get("chambres_min") || "")
    setSurfaceMin(searchParams.get("surface_min") || "")
    setEnPromotion(searchParams.get("en_promotion") === "true")
  }, [searchParams])

  function applyFilters() {
    const params = new URLSearchParams()
    if (keyword) params.set("keyword", keyword)
    if (type) params.set("type", type)
    if (departement) params.set("departement", departement)
    if (ville) params.set("ville", ville)
    if (prixMin) params.set("prix_min", prixMin)
    if (prixMax) params.set("prix_max", prixMax)
    if (chambresMin) params.set("chambres_min", chambresMin)
    if (surfaceMin) params.set("surface_min", surfaceMin)
    if (enPromotion) params.set("en_promotion", "true")
    router.push(`/recherche?${params.toString()}`)
  }

  function resetFilters() {
    setKeyword("")
    setType("")
    setDepartement("")
    setVille("")
    setPrixMin("")
    setPrixMax("")
    setChambresMin("")
    setSurfaceMin("")
    setEnPromotion(false)
    router.push("/recherche")
  }

  const hasFilters = keyword || type || departement || ville || prixMin || prixMax || chambresMin || surfaceMin || enPromotion

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-heading text-base font-semibold text-card-foreground">
          <SlidersHorizontal className="h-4 w-4 text-[#C9A227]" />
          Filtres
        </h3>
        {hasFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-destructive hover:underline"
          >
            <X className="h-3 w-3" />
            {"R\u00e9initialiser"}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {/* Keyword search */}
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            {"Mot-cl\u00e9"}
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="piscine, WiFi, climatisation..."
              className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
            />
          </div>
        </div>

        {/* Type */}
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            {"Type d'annonce"}
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
          >
            <option value="">Tous les types</option>
            {Object.entries(PROPERTY_TYPES).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {/* D\u00e9partement */}
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            {"D\u00e9partement"}
          </label>
          <select
            value={departement}
            onChange={(e) => {
              setDepartement(e.target.value)
              setVille("")
            }}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
          >
            <option value="">{"Tous les d\u00e9partements"}</option>
            {Object.keys(DEPARTEMENTS_BENIN).map((dep) => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>
        </div>

        {/* Ville */}
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Ville
          </label>
          <select
            value={ville}
            onChange={(e) => setVille(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
            disabled={!departement}
          >
            <option value="">Toutes les villes</option>
            {villes.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        {/* Prix */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Prix min (FCFA)
            </label>
            <input
              type="number"
              value={prixMin}
              onChange={(e) => setPrixMin(e.target.value)}
              placeholder="0"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Prix max (FCFA)
            </label>
            <input
              type="number"
              value={prixMax}
              onChange={(e) => setPrixMax(e.target.value)}
              placeholder={"Illimit\u00e9"}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
            />
          </div>
        </div>

        {/* Promotion checkbox */}
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#C9A227] bg-[#C9A227]/5 px-3 py-2">
          <input
            type="checkbox"
            checked={enPromotion}
            onChange={(e) => setEnPromotion(e.target.checked)}
            className="h-4 w-4 rounded border-border text-[#C9A227] focus:ring-[#C9A227]"
          />
          <Tag className="h-4 w-4 text-[#C9A227]" />
          <span className="text-sm font-medium text-foreground">En promotion uniquement</span>
        </label>

        {/* More filters toggle */}
        <button
          onClick={() => setShowMore(!showMore)}
          className="text-xs font-medium text-[#0B1F3A] hover:underline"
        >
          {showMore ? "Moins de filtres" : "Plus de filtres"}
        </button>

        {showMore && (
          <>
            {/* Chambres min */}
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Chambres minimum
              </label>
              <select
                value={chambresMin}
                onChange={(e) => setChambresMin(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
              >
                <option value="">Peu importe</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>

            {/* Surface min */}
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                {"Surface min (m\u00b2)"}
              </label>
              <input
                type="number"
                value={surfaceMin}
                onChange={(e) => setSurfaceMin(e.target.value)}
                placeholder="0"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
              />
            </div>
          </>
        )}

        {/* Apply */}
        <Button
          onClick={applyFilters}
          className="w-full bg-[#0B1F3A] text-white hover:bg-[#0B1F3A]/90"
        >
          <Search className="mr-2 h-4 w-4" />
          Appliquer les filtres
        </Button>
      </div>
    </div>
  )
}
