"use client"

import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import PropertyCard from "@/components/property-card"
import type { Property } from "@/lib/types"

interface PropertyCarouselProps {
  properties: Property[]
}

export default function PropertyCarousel({ properties }: PropertyCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  })

  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanPrev(emblaApi.canScrollPrev())
    setCanNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
  }, [emblaApi, onSelect])

  if (!properties || properties.length === 0) return null

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="-ml-4 flex">
          {properties.map((p) => (
            <div
              key={p.id}
              className="min-w-0 shrink-0 grow-0 basis-[85%] pl-4 sm:basis-[55%] md:basis-[45%] lg:basis-[33.3333%]"
            >
              <PropertyCard property={p} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-2">
        <button
          onClick={() => emblaApi?.scrollPrev()}
          disabled={!canPrev}
          aria-label="Précédent"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:border-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-card disabled:hover:text-foreground"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => emblaApi?.scrollNext()}
          disabled={!canNext}
          aria-label="Suivant"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:border-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-card disabled:hover:text-foreground"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
