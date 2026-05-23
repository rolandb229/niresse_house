"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Menu,
  X,
  Home as HomeIcon,
  Key,
  Hotel,
  Building2,
  Calendar,
  BedDouble,
  LogIn,
  ChevronDown,
  Search,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

const vivreLinks = [
  { href: "/recherche?type=location", label: "Location longue durée", icon: Key },
  { href: "/recherche?type=vente", label: "Vente", icon: HomeIcon },
  { href: "/recherche?type=appartement_meuble", label: "Appartement meublé", icon: Building2 },
]

const sejournerLinks = [
  { href: "/recherche?type=hotel", label: "Hôtels", icon: Hotel },
  { href: "/recherche?type=auberge", label: "Auberges", icon: Building2 },
  { href: "/recherche?type=court_sejour", label: "Court séjour", icon: Calendar },
  { href: "/recherche?type=chambre_meublee", label: "Chambre meublée", icon: BedDouble },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24)
    handler()
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-200 ${
        scrolled ? "bg-[#0B1F3A] border-b border-white/5" : "bg-[#0B1F3A]"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8 lg:py-4">
        <Link href="/" className="flex items-center gap-2">
          <HomeIcon className="h-5 w-5 text-[#C9A227]" />
          <span className="font-heading text-lg font-bold tracking-tight text-white">
            Niresse<span className="text-[#C9A227]">House</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-white/85 outline-none transition hover:bg-white/10 hover:text-white">
              Vivre
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-60">
              {vivreLinks.map((l) => (
                <DropdownMenuItem key={l.href} asChild>
                  <Link href={l.href} className="flex items-center gap-2">
                    <l.icon className="h-4 w-4 text-[#C9A227]" />
                    {l.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-white/85 outline-none transition hover:bg-white/10 hover:text-white">
              Séjourner
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-60">
              {sejournerLinks.map((l) => (
                <DropdownMenuItem key={l.href} asChild>
                  <Link href={l.href} className="flex items-center gap-2">
                    <l.icon className="h-4 w-4 text-[#C9A227]" />
                    {l.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href="/promotions"
            className="rounded-md px-3 py-2 text-sm font-medium text-[#C9A227] transition hover:bg-white/10"
          >
            Promotions
          </Link>

          <Link
            href="/recherche"
            className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
          >
            <Search className="h-3.5 w-3.5" />
            Rechercher
          </Link>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-white/85 hover:bg-white/10 hover:text-white"
          >
            <Link href="/connexion">
              <LogIn className="mr-1.5 h-4 w-4" />
              Connexion
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="bg-[#C9A227] font-medium text-white hover:bg-[#C9A227]/90"
          >
            <Link href="/inscription">Créer un compte</Link>
          </Button>
        </div>

        <button
          className="rounded-md p-1.5 text-white hover:bg-white/10 lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Ouvrir le menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden border-t border-white/10 bg-[#0B1F3A] lg:hidden"
          >
            <div className="flex flex-col gap-1 px-4 pb-4 pt-2">
              <p className="mb-1 mt-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-[#C9A227]">
                Vivre
              </p>
              {vivreLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-white/85 hover:bg-white/10"
                >
                  <l.icon className="h-4 w-4 text-[#C9A227]" />
                  {l.label}
                </Link>
              ))}

              <p className="mb-1 mt-3 px-3 text-[10px] font-semibold uppercase tracking-wider text-[#C9A227]">
                Séjourner
              </p>
              {sejournerLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-white/85 hover:bg-white/10"
                >
                  <l.icon className="h-4 w-4 text-[#C9A227]" />
                  {l.label}
                </Link>
              ))}

              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link
                  href="/promotions"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center rounded-md border border-[#C9A227]/40 px-3 py-2 text-sm font-medium text-[#C9A227]"
                >
                  Promotions
                </Link>
                <Link
                  href="/recherche"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-1.5 rounded-md bg-white/10 px-3 py-2 text-sm font-medium text-white"
                >
                  <Search className="h-4 w-4" />
                  Rechercher
                </Link>
              </div>

              <div className="mt-3 flex gap-2 border-t border-white/10 pt-3">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="flex-1 border-white/20 bg-transparent text-white hover:bg-white/10"
                >
                  <Link href="/connexion" onClick={() => setMobileOpen(false)}>
                    Connexion
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="flex-1 bg-[#C9A227] text-white hover:bg-[#C9A227]/90"
                >
                  <Link href="/inscription" onClick={() => setMobileOpen(false)}>
                    Inscription
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
