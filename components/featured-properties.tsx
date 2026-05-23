import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import PropertyCarousel from "@/components/property-carousel"
import { prisma } from "@/lib/prisma"
import { propertyIncludeAll, serializeProperty } from "@/lib/serializers"

async function getFeaturedProperties() {
  const premiums = await prisma.property.findMany({
    where: { statut: "disponible", premium: true },
    include: propertyIncludeAll,
    orderBy: { dateCreation: "desc" },
    take: 9,
  })

  if (premiums.length > 0) return premiums.map(serializeProperty)

  const recent = await prisma.property.findMany({
    where: { statut: "disponible" },
    include: propertyIncludeAll,
    orderBy: { dateCreation: "desc" },
    take: 9,
  })
  return recent.map(serializeProperty)
}

export default async function FeaturedProperties() {
  const featured = await getFeaturedProperties()

  if (featured.length === 0) return null

  return (
    <section className="bg-background py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#C9A227]">
              Sélection Premium
            </p>
            <h2 className="font-heading text-3xl font-bold text-foreground text-balance md:text-4xl">
              Nos biens en vedette
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Des biens vérifiés et sélectionnés pour leur qualité exceptionnelle.
            </p>
          </div>
          <Link href="/recherche">
            <Button
              variant="outline"
              className="border-[#0B1F3A] text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white"
            >
              Voir tous les biens
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <PropertyCarousel properties={featured} />
      </div>
    </section>
  )
}
