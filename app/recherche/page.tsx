import { Suspense } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import SearchFilters from "@/components/search-filters"
import SearchResults from "@/components/search-results"

export const metadata = {
  title: "Recherche - ImmoBénin",
  description: "Recherchez parmi nos biens immobiliers à Abomey-Calavi, Dassa-Zoumé et Parakou.",
}

export default function RecherchePage() {
  return (
    <main>
      <Navbar />
      <div className="bg-secondary">
        {/* Header */}
        <div className="bg-[#0B1F3A] px-4 py-12 text-center lg:px-8">
          <h1 className="font-heading text-2xl font-bold text-white md:text-3xl text-balance">
            Rechercher un bien immobilier
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-sm text-white/70">
            {"Utilisez nos filtres pour trouver le bien qui correspond parfaitement à vos critères."}
          </p>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Sidebar Filters */}
            <aside className="w-full shrink-0 lg:w-72">
              <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-muted" />}>
                <SearchFilters />
              </Suspense>
            </aside>

            {/* Results */}
            <div className="flex-1">
              <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-muted" />}>
                <SearchResults />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
