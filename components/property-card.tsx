import Image from "next/image"
import Link from "next/link"
import { MapPin, Bed, ShowerHead, Maximize, BadgeCheck, Star, Tag, Eye, MessageSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Property } from "@/lib/types"
import { PROPERTY_TYPES } from "@/lib/types"
import { formatPrice } from "@/lib/utils"

interface PropertyCardProps {
  property: Property
  viewMode?: "grid" | "list"
}

const typeColors: Record<string, string> = {
  vente: "bg-[#0B1F3A] text-white",
  location: "bg-[#1DB954] text-white",
  court_sejour: "bg-purple-600 text-white",
  auberge: "bg-orange-500 text-white",
  hotel: "bg-blue-600 text-white",
  chambre_meublee: "bg-pink-500 text-white",
  appartement_meuble: "bg-teal-500 text-white",
}

export default function PropertyCard({ property, viewMode = "grid" }: PropertyCardProps) {
  if (viewMode === "list") {
    return (
      <Link href={`/bien/${property.id}`} className="group block">
        <article className="flex overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-lg">
          {/* Image */}
          <div className="relative aspect-[4/3] w-48 shrink-0 overflow-hidden sm:w-64">
            <Image
              src={property.images[0] || "/images/villa1.jpg"}
              alt={property.titre}
              fill
              sizes="256px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {property.en_promotion && (
              <div className="absolute left-2 top-2">
                <Badge className="bg-red-500 text-white text-xs font-medium">
                  <Tag className="mr-0.5 h-3 w-3" />
                  -{property.reduction}%
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col justify-between p-4">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge className={`text-xs font-medium ${typeColors[property.type] || "bg-gray-500 text-white"}`}>
                  {PROPERTY_TYPES[property.type as keyof typeof PROPERTY_TYPES] || property.type}
                </Badge>
                {property.premium && (
                  <Badge className="bg-[#C9A227] text-white text-xs font-medium">
                    <Star className="mr-0.5 h-3 w-3" />
                    Premium
                  </Badge>
                )}
                {property.verifie && (
                  <BadgeCheck className="h-5 w-5 text-[#1DB954]" />
                )}
              </div>
              <h3 className="mb-1 font-heading text-base font-semibold leading-snug text-card-foreground line-clamp-1 group-hover:text-[#C9A227] transition-colors">
                {property.titre}
              </h3>
              <p className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {property.quartier}, {property.ville} ({property.departement})
              </p>
              <p className="text-xs text-muted-foreground line-clamp-2">{property.description}</p>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Bed className="h-3.5 w-3.5" />
                  {property.nombre_chambres}
                </span>
                <span className="flex items-center gap-1">
                  <ShowerHead className="h-3.5 w-3.5" />
                  {property.nombre_douches}
                </span>
                <span className="flex items-center gap-1">
                  <Maximize className="h-3.5 w-3.5" />
                  {property.surface} {"m\u00b2"}
                </span>
                {property.note_moyenne && (
                  <span className="flex items-center gap-1 text-[#C9A227]">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    {property.note_moyenne}
                  </span>
                )}
              </div>
              <p className="font-heading text-lg font-bold text-[#0B1F3A]">
                {formatPrice(property.prix, property.type)}
              </p>
            </div>
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link href={`/bien/${property.id}`} className="group block">
      <article className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-lg">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={property.images[0] || "/images/villa1.jpg"}
            alt={property.titre}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            <Badge className={`text-xs font-medium ${typeColors[property.type] || "bg-gray-500 text-white"}`}>
              {PROPERTY_TYPES[property.type as keyof typeof PROPERTY_TYPES]?.split(" ")[0] || property.type}
            </Badge>
            {property.premium && (
              <Badge className="bg-[#C9A227] text-white text-xs font-medium">
                <Star className="mr-0.5 h-3 w-3" />
                Premium
              </Badge>
            )}
            {property.en_promotion && (
              <Badge className="bg-red-500 text-white text-xs font-medium">
                <Tag className="mr-0.5 h-3 w-3" />
                -{property.reduction}%
              </Badge>
            )}
          </div>
          {property.verifie && (
            <div className="absolute right-3 top-3">
              <BadgeCheck className="h-6 w-6 text-[#1DB954] drop-shadow" />
            </div>
          )}
          {/* Price overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-8">
            <p className="font-heading text-lg font-bold text-white">
              {formatPrice(property.prix, property.type)}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="mb-1 font-heading text-base font-semibold leading-snug text-card-foreground line-clamp-2 group-hover:text-[#C9A227] transition-colors">
            {property.titre}
          </h3>
          <p className="mb-3 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {property.quartier}, {property.ville}
          </p>

          {/* Features */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Bed className="h-3.5 w-3.5" />
              {property.nombre_chambres} ch.
            </span>
            <span className="flex items-center gap-1">
              <ShowerHead className="h-3.5 w-3.5" />
              {property.nombre_douches} sdb.
            </span>
            <span className="flex items-center gap-1">
              <Maximize className="h-3.5 w-3.5" />
              {property.surface} {"m\u00b2"}
            </span>
          </div>

          {/* Rating and views */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {property.note_moyenne && (
                <span className="flex items-center gap-1 text-[#C9A227]">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  {property.note_moyenne} ({property.nombre_avis})
                </span>
              )}
              {property.vues && (
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {property.vues}
                </span>
              )}
            </div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60">
              {"R\u00e9f"}: {property.code_unique}
            </p>
          </div>
        </div>
      </article>
    </Link>
  )
}
