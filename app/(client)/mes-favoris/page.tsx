"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Heart, Search } from "lucide-react"
import PropertyCard from "@/components/property-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { Property } from "@/lib/types"

export default function MesFavorisPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const favorisIds = JSON.parse(localStorage.getItem("niresse_favoris") || "[]") as number[]
    if (favorisIds.length === 0) {
      setLoading(false)
      return
    }

    // TODO: ajouter un filtre ?ids=1,2,3 sur GET /api/properties pour éviter
    // de fetcher tous les biens et filtrer côté client.
    fetch("/api/properties?limit=200")
      .then((r) => r.json())
      .then((data) => {
        const all = (data.properties || []) as Property[]
        setProperties(all.filter((p) => favorisIds.includes(p.id)))
      })
      .catch(() => setProperties([]))
      .finally(() => setLoading(false))
  }, [])

  function handleRemove(id: number) {
    const next = properties.filter((p) => p.id !== id)
    setProperties(next)
    const ids = next.map((p) => p.id)
    localStorage.setItem("niresse_favoris", JSON.stringify(ids))
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-72 rounded-xl" />
        ))}
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-dashed border-border bg-card p-10 text-center">
        <Heart className="mx-auto h-10 w-10 text-muted-foreground" />
        <h2 className="mt-4 font-heading text-base font-semibold text-foreground">
          Aucun favori pour le moment
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Cliquez sur le cœur d&apos;un bien lors de votre recherche pour l&apos;ajouter ici.
        </p>
        <Button asChild className="mt-6 bg-[#0B1F3A] text-white hover:bg-[#0B1F3A]/90">
          <Link href="/recherche">
            <Search className="mr-2 h-4 w-4" />
            Parcourir les biens
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {properties.length} {properties.length > 1 ? "biens" : "bien"} dans vos favoris
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((p) => (
          <div key={p.id} className="relative">
            <PropertyCard property={p} />
            <button
              onClick={() => handleRemove(p.id)}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 text-rose-500 shadow-md hover:bg-white"
              aria-label="Retirer des favoris"
            >
              <Heart className="h-4 w-4 fill-current" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
