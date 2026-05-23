"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Search,
  MapPin,
  DollarSign,
  ArrowRight,
  Home,
  Plane,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DEPARTEMENTS_BENIN } from "@/lib/types"

export default function HeroSection() {
  const router = useRouter()
  const [departement, setDepartement] = useState("")
  const [ville, setVille] = useState("")
  const [prixMax, setPrixMax] = useState("")

  const villes = departement ? DEPARTEMENTS_BENIN[departement as keyof typeof DEPARTEMENTS_BENIN] || [] : []

  function handleSearch() {
    const params = new URLSearchParams()
    if (departement) params.set("departement", departement)
    if (ville) params.set("ville", ville)
    if (prixMax) params.set("prix_max", prixMax)
    router.push(`/recherche${params.toString() ? `?${params.toString()}` : ""}`)
  }

  return (
    <section className="relative isolate flex min-h-[640px] items-center justify-center overflow-hidden lg:min-h-[720px]">
      <Image
        src="/images/hero-bg.jpg"
        alt="Immobilier au Bénin"
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-[#0B1F3A]/85" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-14 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A227]/40 px-3 py-1 text-xs font-medium uppercase tracking-wider text-[#C9A227]">
            Plateforme immobilière du Bénin
          </span>
          <h1 className="mt-4 font-heading text-3xl font-bold leading-[1.08] text-white text-balance md:text-5xl lg:text-[3.5rem]">
            Votre maison, votre séjour,
            <span className="block text-[#C9A227]">au Bénin.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/75 md:text-base">
            Location, vente, hôtels et auberges vérifiés dans les 12 départements.
            Visite gratuite pour les logements, réservation directe pour les séjours.
          </p>
        </motion.div>

        <div className="mx-auto mt-8 grid max-w-4xl gap-4 sm:grid-cols-2">
          <IntentCard
            href="/recherche?type=location"
            icon={Home}
            eyebrow="Habiter durablement"
            title="Vivre au Bénin"
            description="Location, vente, appartements meublés"
            cta="Trouver un logement"
            badge={
              <span className="rounded-full border border-[#1DB954]/50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[#1DB954]">
                Visite gratuite
              </span>
            }
            delay={0.1}
          />
          <IntentCard
            href="/recherche?type=hotel"
            icon={Plane}
            eyebrow="Court séjour"
            title="Séjourner au Bénin"
            description="Hôtels, auberges, chambres meublées"
            cta="Réserver un séjour"
            badge={
              <span className="rounded-full border border-[#C9A227]/50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[#C9A227]">
                Réservation directe
              </span>
            }
            delay={0.18}
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mx-auto mt-6 flex max-w-4xl items-center gap-4"
        >
          <div className="h-px flex-1 bg-white/15" />
          <span className="text-xs uppercase tracking-widest text-white/50">ou recherche directe</span>
          <div className="h-px flex-1 bg-white/15" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="mx-auto mt-4 max-w-4xl rounded-2xl border border-white/10 bg-white p-3 shadow-xl md:p-4"
        >
          <div className="grid gap-2 md:grid-cols-[1.2fr_1.2fr_1fr_auto] md:items-end md:gap-3">
            <div className="rounded-xl bg-secondary/40 p-2.5">
              <label className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-foreground/60">
                <MapPin className="h-3 w-3" />
                Département
              </label>
              <select
                value={departement}
                onChange={(e) => {
                  setDepartement(e.target.value)
                  setVille("")
                }}
                className="w-full bg-transparent text-sm font-medium text-foreground outline-none"
              >
                <option value="">Tous les départements</option>
                {Object.keys(DEPARTEMENTS_BENIN).map((dep) => (
                  <option key={dep} value={dep}>
                    {dep}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-xl bg-secondary/40 p-2.5">
              <label className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-foreground/60">
                <MapPin className="h-3 w-3" />
                Ville
              </label>
              <select
                value={ville}
                onChange={(e) => setVille(e.target.value)}
                disabled={!departement}
                className="w-full bg-transparent text-sm font-medium text-foreground outline-none disabled:opacity-50"
              >
                <option value="">Toutes les villes</option>
                {villes.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-xl bg-secondary/40 p-2.5">
              <label className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-foreground/60">
                <DollarSign className="h-3 w-3" />
                Budget max
              </label>
              <input
                type="number"
                placeholder="FCFA"
                value={prixMax}
                onChange={(e) => setPrixMax(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-foreground/40 outline-none"
              />
            </div>

            <Button
              onClick={handleSearch}
              size="lg"
              className="h-12 bg-[#C9A227] px-6 font-medium text-white hover:bg-[#C9A227]/90"
            >
              <Search className="mr-2 h-4 w-4" />
              Rechercher
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/60"
        >
          <span>Biens vérifiés</span>
          <span className="text-white/30">·</span>
          <span>Photos réelles</span>
          <span className="text-white/30">·</span>
          <span>Support WhatsApp 7j/7</span>
        </motion.div>
      </div>
    </section>
  )
}

function IntentCard({
  href,
  icon: Icon,
  eyebrow,
  title,
  description,
  cta,
  badge,
  delay,
}: {
  href: string
  icon: React.ElementType
  eyebrow: string
  title: string
  description: string
  cta: string
  badge: React.ReactNode
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
      whileHover={{ y: -3 }}
    >
      <Link
        href={href}
        className="group block h-full rounded-2xl border border-white/15 bg-[#0B1F3A] p-5 transition hover:border-[#C9A227]/50"
      >
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#C9A227]/40 text-[#C9A227]">
            <Icon className="h-5 w-5" />
          </div>
          {badge}
        </div>
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-white/50">
          {eyebrow}
        </p>
        <h3 className="mt-0.5 font-heading text-lg font-bold text-white md:text-xl">{title}</h3>
        <p className="mt-1 text-sm text-white/65">{description}</p>
        <div className="mt-4 flex items-center gap-2 text-sm font-medium text-[#C9A227]">
          {cta}
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </div>
      </Link>
    </motion.div>
  )
}
