import { notFound } from "next/navigation"
import Link from "next/link"
import {
  MapPin,
  Bed,
  ShowerHead,
  Maximize,
  BadgeCheck,
  Phone,
  ArrowLeft,
  Share2,
  Heart,
  Calendar,
  Star,
  Eye,
  Tag,
  Check,
  Wifi,
  Car,
  Wind,
  Droplets,
  Shield,
  Tv,
  Utensils,
  Trees,
} from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PropertyGallery from "@/components/property-gallery"
import ContactForm from "@/components/contact-form"
import PropertyCard from "@/components/property-card"
import ReviewsSection from "@/components/reviews-section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Property, Review } from "@/lib/types"

const PROPERTY_TYPES: Record<string, string> = {
  vente: "Vente",
  location: "Location",
  court_sejour: "Court séjour",
  auberge: "Auberge",
  hotel: "Hôtel",
  chambre_meublee: "Chambre meublée",
  appartement_meuble: "Appartement meublé",
}

const equipementIcons: Record<string, React.ReactNode> = {
  "WiFi": <Wifi className="h-4 w-4" />,
  "Climatisation": <Wind className="h-4 w-4" />,
  "Climatisation centrale": <Wind className="h-4 w-4" />,
  "Garage": <Car className="h-4 w-4" />,
  "Garage 3 voitures": <Car className="h-4 w-4" />,
  "Parking": <Car className="h-4 w-4" />,
  "Parking sécurisé": <Car className="h-4 w-4" />,
  "Piscine": <Droplets className="h-4 w-4" />,
  "Sécurité": <Shield className="h-4 w-4" />,
  "Sécurité 24h": <Shield className="h-4 w-4" />,
  "TV": <Tv className="h-4 w-4" />,
  "TV satellite": <Tv className="h-4 w-4" />,
  "Cuisine équipée": <Utensils className="h-4 w-4" />,
  "Jardin": <Trees className="h-4 w-4" />,
  "Jardin paysager": <Trees className="h-4 w-4" />,
}

function formatPrice(prix: number, type: string): string {
  const formatted = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(prix)
  if (type === "location" || type === "court_sejour" || type === "chambre_meublee" || type === "appartement_meuble") {
    return `${formatted}/mois`
  }
  if (type === "auberge" || type === "hotel") {
    return `${formatted}/nuit`
  }
  return formatted
}

async function getProperty(id: string): Promise<Property | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/properties/${id}`, { cache: "no-store" })
    if (!res.ok) return null
    const data = await res.json()
    return data.property || null
  } catch {
    return null
  }
}

async function getReviews(propertyId: number): Promise<Review[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/avis?property_id=${propertyId}`, { cache: "no-store" })
    if (!res.ok) return []
    const data = await res.json()
    return data.avis || []
  } catch {
    return []
  }
}

async function getSimilarProperties(type: string, excludeId: number): Promise<Property[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/properties?type=${type}&statut=disponible&limit=10`, {
      cache: "no-store",
    })
    if (!res.ok) return []
    const data = await res.json()
    return ((data.properties || []) as Property[]).filter((p) => p.id !== excludeId).slice(0, 3)
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const property = await getProperty(id)
  if (!property) return { title: "Bien non trouvé" }
  return {
    title: `${property.titre} - NiresseHouse`,
    description: (property.description || "").slice(0, 160),
  }
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const property = await getProperty(id)

  if (!property) {
    notFound()
  }

  const [reviews, similar] = await Promise.all([
    getReviews(property.id),
    getSimilarProperties(property.type, property.id),
  ])

  const whatsappMsg = encodeURIComponent(
    `Bonjour, je suis intéressé(e) par le bien "${property.titre}" (Réf: ${property.code_unique}). Pouvez-vous me donner plus d'informations ?`
  )
  const whatsappUrl = `https://wa.me/0166369842?text=${whatsappMsg}`

  const typeLabel = PROPERTY_TYPES[property.type] || property.type

  return (
    <main className="bg-background">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/recherche" className="flex items-center gap-1 hover:text-[#0B1F3A]">
            <ArrowLeft className="h-4 w-4" />
            Retour aux résultats
          </Link>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main Content */}
          <div className="flex-1">
            {/* Gallery */}
            <PropertyGallery images={property.images || []} titre={property.titre} />

            {/* Info */}
            <div className="mt-6">
              {/* Badges & Price */}
              <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="mb-2 flex flex-wrap gap-2">
                    <Badge className="bg-[#0B1F3A] text-white text-xs font-medium">
                      {typeLabel}
                    </Badge>
                    {property.verifie && (
                      <Badge className="bg-[#1DB954]/10 text-[#1DB954] text-xs font-medium">
                        <BadgeCheck className="mr-1 h-3 w-3" />
                        Vérifié
                      </Badge>
                    )}
                    {property.premium && (
                      <Badge className="bg-[#C9A227] text-white text-xs font-medium">
                        <Star className="mr-1 h-3 w-3" />
                        Premium
                      </Badge>
                    )}
                    {property.en_promotion && (
                      <Badge className="bg-red-500 text-white text-xs font-medium">
                        <Tag className="mr-1 h-3 w-3" />
                        -{property.reduction}%
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                      Réf: {property.code_unique}
                    </Badge>
                  </div>
                  <h1 className="font-heading text-xl font-bold text-foreground md:text-2xl text-balance">
                    {property.titre}
                  </h1>
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {property.quartier && `${property.quartier}, `}
                    {property.ville}
                    {property.departement && ` (${property.departement})`}
                  </p>
                  {/* Rating and views */}
                  <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                    {(property.note_moyenne ?? 0) > 0 && (
                      <span className="flex items-center gap-1 text-[#C9A227]">
                        <Star className="h-4 w-4 fill-current" />
                        {Number(property.note_moyenne).toFixed(1)} ({property.nombre_avis} avis)
                      </span>
                    )}
                    {(property.vues ?? 0) > 0 && (
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {property.vues} vues
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  {property.en_promotion && property.reduction && (
                    <p className="text-sm text-muted-foreground line-through">
                      {formatPrice(
                        Math.round(property.prix / (1 - property.reduction / 100)),
                        property.type
                      )}
                    </p>
                  )}
                  <p className="font-heading text-2xl font-bold text-[#C9A227]">
                    {formatPrice(property.prix, property.type)}
                  </p>
                </div>
              </div>

              {/* Features grid */}
              <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-lg border border-border bg-secondary p-3 text-center">
                  <Bed className="mx-auto mb-1 h-5 w-5 text-[#0B1F3A]" />
                  <p className="text-lg font-bold text-foreground">{property.nombre_chambres}</p>
                  <p className="text-xs text-muted-foreground">Chambres</p>
                </div>
                <div className="rounded-lg border border-border bg-secondary p-3 text-center">
                  <ShowerHead className="mx-auto mb-1 h-5 w-5 text-[#0B1F3A]" />
                  <p className="text-lg font-bold text-foreground">{property.nombre_douches}</p>
                  <p className="text-xs text-muted-foreground">Douches</p>
                </div>
                <div className="rounded-lg border border-border bg-secondary p-3 text-center">
                  <Maximize className="mx-auto mb-1 h-5 w-5 text-[#0B1F3A]" />
                  <p className="text-lg font-bold text-foreground">{property.surface || "-"}</p>
                  <p className="text-xs text-muted-foreground">m²</p>
                </div>
                <div className="rounded-lg border border-border bg-secondary p-3 text-center">
                  <Calendar className="mx-auto mb-1 h-5 w-5 text-[#0B1F3A]" />
                  <p className="text-sm font-bold text-foreground">
                    {new Date(property.date_creation).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                  <p className="text-xs text-muted-foreground">Publication</p>
                </div>
              </div>

              {/* Description */}
              {property.description && (
                <div className="mb-6">
                  <h2 className="mb-3 font-heading text-lg font-semibold text-foreground">
                    Description
                  </h2>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    {property.description}
                  </p>
                </div>
              )}

              {/* Equipements */}
              {property.equipements && property.equipements.length > 0 && (
                <div className="mb-6">
                  <h2 className="mb-3 font-heading text-lg font-semibold text-foreground">
                    Équipements
                  </h2>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {property.equipements.map((equip) => (
                      <div
                        key={equip}
                        className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm"
                      >
                        {equipementIcons[equip] || <Check className="h-4 w-4 text-[#1DB954]" />}
                        <span className="text-foreground">{equip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-[#25D366] text-white hover:bg-[#25D366]/90">
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    WhatsApp
                  </Button>
                </a>
                <a href="tel:0166369842">
                  <Button
                    variant="outline"
                    className="border-[#0B1F3A] text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white"
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Appeler
                  </Button>
                </a>
                <Button variant="outline" className="border-border text-foreground">
                  <Heart className="mr-2 h-4 w-4" />
                  Favoris
                </Button>
                <Button variant="outline" className="border-border text-foreground">
                  <Share2 className="mr-2 h-4 w-4" />
                  Partager
                </Button>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-8">
              <ReviewsSection
                propertyId={property.id}
                reviews={reviews}
                averageRating={property.note_moyenne || 0}
                totalReviews={property.nombre_avis || 0}
              />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full shrink-0 lg:w-80">
            <div className="sticky top-20 space-y-6">
              <ContactForm propertyId={property.id} />

              {/* Quick info card */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <h3 className="mb-3 font-heading text-sm font-semibold text-card-foreground">
                  Informations rapides
                </h3>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium text-card-foreground">{typeLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Statut</span>
                    <span className="font-medium text-[#1DB954] capitalize">{property.statut}</span>
                  </div>
                  {property.departement && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Département</span>
                      <span className="font-medium text-card-foreground">{property.departement}</span>
                    </div>
                  )}
                  {property.ville && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ville</span>
                      <span className="font-medium text-card-foreground">{property.ville}</span>
                    </div>
                  )}
                  {property.quartier && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quartier</span>
                      <span className="font-medium text-card-foreground">{property.quartier}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Similar properties */}
        {similar.length > 0 && (
          <section className="mt-12 border-t border-border pt-10">
            <h2 className="mb-6 font-heading text-xl font-bold text-foreground">
              Biens similaires
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </main>
  )
}
