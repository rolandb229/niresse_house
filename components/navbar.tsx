"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Home, Search, LogIn, User, Hotel, Building2, Key } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Home className="h-7 w-7 text-accent" />
          <span className="font-heading text-xl font-bold tracking-tight">
            Niresse<span className="text-accent">House</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-5 lg:flex">
          <Link
            href="/"
            className="text-sm font-medium text-primary-foreground/80 transition hover:text-accent"
          >
            Accueil
          </Link>
          <Link
            href="/recherche?type=location"
            className="flex items-center gap-1 text-sm font-medium text-primary-foreground/80 transition hover:text-accent"
          >
            <Key className="h-3.5 w-3.5" />
            Location
          </Link>
          <Link
            href="/recherche?type=vente"
            className="text-sm font-medium text-primary-foreground/80 transition hover:text-accent"
          >
            Vente
          </Link>
          <Link
            href="/recherche?type=auberge"
            className="flex items-center gap-1 text-sm font-medium text-primary-foreground/80 transition hover:text-accent"
          >
            <Building2 className="h-3.5 w-3.5" />
            Auberges
          </Link>
          <Link
            href="/recherche?type=hotel"
            className="flex items-center gap-1 text-sm font-medium text-primary-foreground/80 transition hover:text-accent"
          >
            <Hotel className="h-3.5 w-3.5" />
            {"H\u00f4tels"}
          </Link>
          <Link
            href="/promotions"
            className="text-sm font-medium text-accent transition hover:text-accent/80"
          >
            Promotions
          </Link>
          <Link
            href="/recherche"
            className="text-sm font-medium text-primary-foreground/80 transition hover:text-accent"
          >
            <Search className="mr-1 inline h-4 w-4" />
            Rechercher
          </Link>
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          <Button asChild variant="ghost" size="sm" className="text-primary-foreground/80 hover:text-accent hover:bg-primary/80">
            <Link href="/connexion">
              <LogIn className="mr-1 h-4 w-4" />
              Connexion
            </Link>
          </Button>
          <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 font-medium">
            <Link href="/admin">
              <User className="mr-1 h-4 w-4" />
              Espace Admin
            </Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-primary-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Ouvrir le menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-primary-foreground/10 bg-primary px-4 pb-4 lg:hidden">
          <div className="flex flex-col gap-2 pt-3">
            <Link
              href="/"
              className="rounded-md px-3 py-2 text-sm font-medium text-primary-foreground/80 hover:bg-primary-foreground/10"
              onClick={() => setMobileOpen(false)}
            >
              Accueil
            </Link>
            <Link
              href="/recherche?type=location"
              className="rounded-md px-3 py-2 text-sm font-medium text-primary-foreground/80 hover:bg-primary-foreground/10"
              onClick={() => setMobileOpen(false)}
            >
              Location
            </Link>
            <Link
              href="/recherche?type=vente"
              className="rounded-md px-3 py-2 text-sm font-medium text-primary-foreground/80 hover:bg-primary-foreground/10"
              onClick={() => setMobileOpen(false)}
            >
              Vente
            </Link>
            <Link
              href="/recherche?type=auberge"
              className="rounded-md px-3 py-2 text-sm font-medium text-primary-foreground/80 hover:bg-primary-foreground/10"
              onClick={() => setMobileOpen(false)}
            >
              Auberges
            </Link>
            <Link
              href="/recherche?type=hotel"
              className="rounded-md px-3 py-2 text-sm font-medium text-primary-foreground/80 hover:bg-primary-foreground/10"
              onClick={() => setMobileOpen(false)}
            >
              {"H\u00f4tels"}
            </Link>
            <Link
              href="/promotions"
              className="rounded-md px-3 py-2 text-sm font-medium text-accent hover:bg-primary-foreground/10"
              onClick={() => setMobileOpen(false)}
            >
              Promotions
            </Link>
            <Link
              href="/recherche"
              className="rounded-md px-3 py-2 text-sm font-medium text-primary-foreground/80 hover:bg-primary-foreground/10"
              onClick={() => setMobileOpen(false)}
            >
              Rechercher
            </Link>
            <div className="mt-2 flex flex-col gap-2">
              <Button asChild variant="outline" size="sm" className="w-full border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                <Link href="/connexion" onClick={() => setMobileOpen(false)}>
                  Connexion
                </Link>
              </Button>
              <Button asChild size="sm" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/admin" onClick={() => setMobileOpen(false)}>
                  Espace Admin
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
