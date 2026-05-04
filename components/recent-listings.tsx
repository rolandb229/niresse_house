import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import PropertyCard from "@/components/property-card"
import type { Property } from "@/lib/types"

async function getRecentListings(): Promise<Property[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/properties?statut=disponible&limit=6`, {
      cache: "no-store",
    })
    if (!res.ok) return []
    const data = await res.json()
    return (data.properties || []) as Property[]
  } catch {
    return []
  }
}

export default async function RecentListings() {
  const recent = await getRecentListings()

  if (recent.length === 0) return null

  return (
    <section className="bg-secondary py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#1DB954]">
              {"Nouveautés"}
            </p>
            <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl text-balance">
              {"Annonces récentes"}
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              {"Les dernières offres ajoutées sur notre plateforme."}
            </p>
          </div>
          <Link href="/recherche">
            <Button variant="outline" className="border-[#0B1F3A] text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white">
              Tout voir
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  )
}
