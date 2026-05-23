import Link from "next/link"
import { Tag, ArrowRight } from "lucide-react"
import PropertyCarousel from "@/components/property-carousel"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { propertyIncludeAll, serializeProperty } from "@/lib/serializers"

async function getPromotions() {
  const promos = await prisma.property.findMany({
    where: { statut: "disponible", enPromotion: true },
    include: propertyIncludeAll,
    orderBy: { dateCreation: "desc" },
    take: 9,
  })
  return promos.map(serializeProperty)
}

export default async function PromotionsSection() {
  const promotions = await getPromotions()

  if (promotions.length === 0) return null

  return (
    <section className="bg-[#0B1F3A] py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-red-400/40 px-3 py-1 text-xs font-medium uppercase tracking-wider text-red-300">
              Offres limitées
            </div>
            <h2 className="font-heading text-3xl font-bold text-white text-balance md:text-4xl">
              Promotions du moment
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-white/70">
              Profitez de réductions exclusives sur ces biens sélectionnés.
            </p>
          </div>
          <Link href="/promotions">
            <Button
              variant="outline"
              className="border-[#C9A227] bg-transparent text-[#C9A227] hover:bg-[#C9A227] hover:text-white"
            >
              <Tag className="mr-2 h-4 w-4" />
              Toutes les promotions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="[&_button]:border-white/20 [&_button]:bg-white/5 [&_button]:text-white [&_button:hover]:border-[#C9A227] [&_button:hover]:bg-[#C9A227]">
          <PropertyCarousel properties={promotions} />
        </div>
      </div>
    </section>
  )
}
