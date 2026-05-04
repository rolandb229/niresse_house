import Link from "next/link"
import { Tag, ArrowRight } from "lucide-react"
import PropertyCard from "@/components/property-card"
import { Button } from "@/components/ui/button"
import type { Property } from "@/lib/types"

async function getPromotions(): Promise<Property[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/properties?en_promotion=true&limit=3`, {
      cache: "no-store",
    })
    if (!res.ok) return []
    const data = await res.json()
    return (data.properties || []) as Property[]
  } catch {
    return []
  }
}

export default async function PromotionsSection() {
  const promotions = await getPromotions()

  if (promotions.length === 0) return null

  return (
    <section className="bg-gradient-to-br from-red-50 to-orange-50 py-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-red-500 px-3 py-1 text-xs font-medium text-white">
              <Tag className="h-3.5 w-3.5" />
              {"Offres limitées"}
            </div>
            <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
              Promotions du moment
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {"Profitez de réductions exclusives sur ces biens sélectionnés"}
            </p>
          </div>
          <Link href="/promotions" className="hidden md:block">
            <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
              Voir toutes les promotions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {promotions.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        <div className="mt-6 text-center md:hidden">
          <Link href="/promotions">
            <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
              Voir toutes les promotions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
