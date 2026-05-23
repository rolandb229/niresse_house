"use client"

import { useCallback, useEffect, useState } from "react"
import { motion } from "framer-motion"
import useEmblaCarousel from "embla-carousel-react"
import { Star, Quote, ChevronLeft, ChevronRight, MapPin } from "lucide-react"

const testimonials = [
  {
    nom: "Marie Agbossou",
    ville: "Abomey-Calavi",
    role: "Locataire",
    initiales: "MA",
    texte:
      "J'ai trouvé mon appartement en moins d'une semaine grâce à NiresseHouse. Le processus était simple et les biens vérifiés. Je recommande vivement !",
    note: 5,
  },
  {
    nom: "Sédro Kpadonou",
    ville: "Parakou",
    role: "Vendeur",
    initiales: "SK",
    texte:
      "Excellente plateforme ! J'ai pu vendre ma maison rapidement. L'équipe est professionnelle et très réactive. Merci NiresseHouse.",
    note: 5,
  },
  {
    nom: "Rachida Moussa",
    ville: "Dassa-Zoumé",
    role: "Voyageuse",
    initiales: "RM",
    texte:
      "Très satisfaite de mon expérience. Les photos sont réelles, les prix transparents. C'est la meilleure plateforme immobilière au Bénin.",
    note: 5,
  },
  {
    nom: "Bertrand N'Doli",
    ville: "Paris (diaspora)",
    role: "Acheteur",
    initiales: "BN",
    texte:
      "Acheter depuis la France semblait impossible. NiresseHouse m'a accompagné de A à Z avec des visites virtuelles et un suivi WhatsApp parfait.",
    note: 5,
  },
  {
    nom: "Aïssatou Sani",
    ville: "Cotonou",
    role: "Voyageuse pro",
    initiales: "AS",
    texte:
      "Je réserve mes hôtels à Cotonou exclusivement sur NiresseHouse depuis 6 mois. Disponibilités fiables et tarifs justes.",
    note: 4,
  },
]

export default function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    slidesToScroll: 1,
  })

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [snapCount, setSnapCount] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    setSnapCount(emblaApi.scrollSnapList().length)
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
  }, [emblaApi, onSelect])

  return (
    <section className="bg-secondary/30 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#C9A227]">
            Témoignages clients
          </p>
          <h2 className="font-heading text-3xl font-bold text-foreground text-balance md:text-4xl">
            Ils ont trouvé leur bien<span className="text-[#C9A227]">.</span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            +2 000 clients satisfaits dans les 12 départements du Bénin.
          </p>
        </motion.div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="-ml-4 flex">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="min-w-0 shrink-0 grow-0 basis-[92%] pl-4 sm:basis-[60%] lg:basis-[40%]"
              >
                <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-sm">
                  <Quote className="h-8 w-8 text-[#C9A227]/30" />
                  <p className="mt-3 text-sm leading-relaxed text-foreground/80">{t.texte}</p>
                  <div className="mt-4 flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className={`h-4 w-4 ${
                          j < t.note ? "fill-[#C9A227] text-[#C9A227]" : "text-border"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="mt-5 flex items-center gap-3 border-t border-border/70 pt-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0B1F3A] font-heading text-sm font-bold text-white">
                      {t.initiales}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.nom}</p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {t.ville} · {t.role}
                      </p>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={() => emblaApi?.scrollPrev()}
            aria-label="Précédent"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:border-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: snapCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                aria-label={`Aller au témoignage ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === selectedIndex ? "w-6 bg-[#C9A227]" : "w-1.5 bg-border"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => emblaApi?.scrollNext()}
            aria-label="Suivant"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:border-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
