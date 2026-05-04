"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Grid3X3, List, Loader2 } from "lucide-react"
import PropertyCard from "@/components/property-card"
import { Button } from "@/components/ui/button"
import type { Property } from "@/lib/types"

const ITEMS_PER_PAGE = 9

type SortOption = "recent" | "prix_asc" | "prix_desc" | "surface_asc" | "note_desc"

export default function SearchResults() {
  const searchParams = useSearchParams()
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<SortOption>("recent")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchProperties = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const params = new URLSearchParams()
      const keyword = searchParams.get("keyword")
      const type = searchParams.get("type")
      const ville = searchParams.get("ville")
      const departement = searchParams.get("departement")
      const prixMin = searchParams.get("prix_min")
      const prixMax = searchParams.get("prix_max")
      const chambresMin = searchParams.get("chambres_min")
      const enPromotion = searchParams.get("en_promotion")

      if (keyword) params.set("keyword", keyword)
      if (type) params.set("type", type)
      if (ville) params.set("ville", ville)
      if (departement) params.set("departement", departement)
      if (prixMin) params.set("prix_min", prixMin)
      if (prixMax) params.set("prix_max", prixMax)
      if (chambresMin) params.set("chambres_min", chambresMin)
      if (enPromotion === "true") params.set("en_promotion", "true")
      params.set("statut", "disponible")
      params.set("limit", "200")

      const res = await fetch(`/api/properties?${params.toString()}`)
      if (!res.ok) throw new Error("Erreur serveur")
      const data = await res.json()
      setProperties(data.properties || [])
      setPage(1)
    } catch {
      setError("Impossible de charger les biens. Vérifiez que XAMPP/MySQL est démarré.")
    } finally {
      setLoading(false)
    }
  }, [searchParams])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  // Tri côté client
  const sorted = [...properties].sort((a, b) => {
    switch (sortBy) {
      case "prix_asc": return a.prix - b.prix
      case "prix_desc": return b.prix - a.prix
      case "surface_asc": return (b.surface || 0) - (a.surface || 0)
      case "note_desc": return (b.note_moyenne || 0) - (a.note_moyenne || 0)
      default: return new Date(b.date_creation).getTime() - new Date(a.date_creation).getTime()
    }
  })

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE)
  const paginated = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0B1F3A]" />
        <span className="ml-3 text-sm text-muted-foreground">Chargement des biens...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="font-medium text-red-700">{error}</p>
        <button
          onClick={fetchProperties}
          className="mt-3 text-sm font-medium text-red-600 hover:underline"
        >
          Réessayer
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Results count and sorting */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{sorted.length}</span>{" "}
          résultat{sorted.length > 1 ? "s" : ""} trouvé{sorted.length > 1 ? "s" : ""}
        </p>
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value as SortOption); setPage(1) }}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
          >
            <option value="recent">Plus récents</option>
            <option value="prix_asc">Prix croissant</option>
            <option value="prix_desc">Prix décroissant</option>
            <option value="surface_asc">Surface croissante</option>
            <option value="note_desc">Meilleures notes</option>
          </select>
          <div className="hidden items-center rounded-lg border border-border sm:flex">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              aria-label="Vue grille"
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              aria-label="Vue liste"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results grid */}
      {paginated.length > 0 ? (
        <div className={viewMode === "grid" ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col gap-4"}>
          {paginated.map((property) => (
            <PropertyCard key={property.id} property={property} viewMode={viewMode} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <p className="font-heading text-lg font-semibold text-card-foreground">
            Aucun bien trouvé
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {"Essayez de modifier vos critères de recherche."}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="border-border"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
            let pageNum: number
            if (totalPages <= 5) {
              pageNum = i + 1
            } else if (page <= 3) {
              pageNum = i + 1
            } else if (page >= totalPages - 2) {
              pageNum = totalPages - 4 + i
            } else {
              pageNum = page - 2 + i
            }
            return (
              <Button
                key={pageNum}
                variant={page === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(pageNum)}
                className={page === pageNum ? "bg-[#0B1F3A] text-white" : "border-border text-foreground"}
              >
                {pageNum}
              </Button>
            )
          })}
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="border-border"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
