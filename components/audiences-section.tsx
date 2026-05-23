"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Users, Globe2, Plane, ArrowRight, Check } from "lucide-react"

const audiences = [
  {
    icon: Users,
    eyebrow: "Pour les résidents au Bénin",
    title: "Trouvez votre prochain chez-vous",
    description:
      "Location longue durée, achat, appartements meublés. Visite gratuite sur tous les biens, à votre rythme.",
    features: ["Visite physique gratuite", "Biens vérifiés sur place", "Sans frais cachés"],
    cta: "Explorer les logements",
    href: "/recherche?type=location",
  },
  {
    icon: Globe2,
    eyebrow: "Pour la diaspora",
    title: "Achetez ou louez depuis l'étranger",
    description:
      "Photos réelles, vidéos sur demande, visite virtuelle. Notre équipe vous représente sur place, en toute confiance.",
    features: ["Photos & vidéos garanties", "Représentation sur place", "Paiement sécurisé"],
    cta: "Acheter depuis l'étranger",
    href: "/recherche?type=vente",
  },
  {
    icon: Plane,
    eyebrow: "Pour les voyageurs",
    title: "Réservez votre séjour au Bénin",
    description:
      "Hôtels, auberges et chambres meublées dans toutes les villes. Réservation immédiate avec disponibilités en temps réel.",
    features: ["Réservation directe", "Disponibilités à jour", "Annulation flexible"],
    cta: "Réserver un séjour",
    href: "/recherche?type=hotel",
  },
]

export default function AudiencesSection() {
  return (
    <section className="bg-background py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#C9A227]">
            Une plateforme, trois usages
          </p>
          <h2 className="font-heading text-3xl font-bold text-foreground text-balance md:text-4xl">
            NiresseHouse s'adapte à vous,
            <span className="block text-[#0B1F3A]/70">pas l'inverse.</span>
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {audiences.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
            >
              <Link
                href={a.href}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-7 transition hover:-translate-y-0.5 hover:border-[#0B1F3A]"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B1F3A] text-white">
                    <a.icon className="h-6 w-6" />
                  </div>
                  <p className="mt-5 text-[11px] font-semibold uppercase tracking-wider text-[#C9A227]">
                    {a.eyebrow}
                  </p>
                  <h3 className="mt-1 font-heading text-xl font-bold text-foreground">{a.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {a.description}
                  </p>

                  <ul className="mt-5 space-y-2 border-t border-border/70 pt-4">
                    {a.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                        <Check className="h-4 w-4 shrink-0 text-[#0B1F3A]" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex items-center gap-2 text-sm font-medium text-[#0B1F3A]">
                    {a.cta}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mt-12 text-center text-sm text-muted-foreground"
        >
          Tous les biens sont vérifiés par notre équipe. Support WhatsApp 7j/7.
        </motion.p>
      </div>
    </section>
  )
}
