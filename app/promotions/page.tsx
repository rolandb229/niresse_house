import { Metadata } from "next"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PropertyCard from "@/components/property-card"
import { Tag, Percent, Clock, Star } from "lucide-react"
import type { Property } from "@/lib/types"

export const metadata: Metadata = {
  title: "Promotions - NiresseHouse",
  description: "Découvrez nos meilleures offres promotionnelles sur les locations, ventes, auberges et hôtels au Bénin.",
}

async function getPromotions(): Promise<Property[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/properties?en_promotion=true&limit=50`, {
      cache: "no-store",
    })
    if (!res.ok) return []
    const data = await res.json()
    return (data.properties || []) as Property[]
  } catch {
    return []
  }
}

export default async function PromotionsPage() {
  const promotions = await getPromotions()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0B1F3A] via-[#0B1F3A] to-[#1a3a5c] py-16 text-white">
          <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-red-500 px-4 py-1.5 text-sm font-medium mb-4">
              <Tag className="h-4 w-4" />
              Offres Exclusives
            </div>
            <h1 className="font-heading text-3xl font-bold md:text-5xl text-balance">
              Promotions du moment
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/80 md:text-lg">
              Profitez de nos meilleures offres sur les locations, ventes, auberges et {"h\u00f4tels"} au {"B\u00e9nin"}. Offres {"limit\u00e9es"} dans le temps !
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b border-border bg-card py-8">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <Percent className="h-6 w-6 text-red-500" />
                </div>
                <p className="font-heading text-2xl font-bold text-foreground">{promotions.length}</p>
                <p className="text-xs text-muted-foreground">Offres actives</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <Tag className="h-6 w-6 text-green-500" />
                </div>
                <p className="font-heading text-2xl font-bold text-foreground">{"Jusqu'\u00e0"} -25%</p>
                <p className="text-xs text-muted-foreground">De {"r\u00e9duction"}</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <Clock className="h-6 w-6 text-blue-500" />
                </div>
                <p className="font-heading text-2xl font-bold text-foreground">{"Limit\u00e9"}</p>
                <p className="text-xs text-muted-foreground">Dans le temps</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                  <Star className="h-6 w-6 text-yellow-500" />
                </div>
                <p className="font-heading text-2xl font-bold text-foreground">{"V\u00e9rifi\u00e9s"}</p>
                <p className="text-xs text-muted-foreground">Biens de {"qualit\u00e9"}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Promotions Grid */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            {promotions.length > 0 ? (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{promotions.length}</span> offre{promotions.length > 1 ? "s" : ""} en promotion
                  </p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {promotions.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-border bg-card p-12 text-center">
                <Tag className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="font-heading text-lg font-semibold text-card-foreground">
                  Aucune promotion en cours
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Revenez bient{"o\u0302t"} pour {"d\u00e9couvrir"} nos nouvelles offres !
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#C9A227]/10 py-12">
          <div className="mx-auto max-w-3xl px-4 text-center lg:px-8">
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Vous {"\u00eates"} propri{"e\u0301taire"} ?
            </h2>
            <p className="mt-2 text-muted-foreground">
              Mettez votre bien en promotion pour attirer plus de clients. Contactez-nous pour en savoir plus.
            </p>
            <a
              href="https://wa.me/0166369842"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#25D366]/90 transition"
            >
              Nous contacter sur WhatsApp
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
