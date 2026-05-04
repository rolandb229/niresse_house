"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PropertyGalleryProps {
  images: string[]
  titre: string
}

export default function PropertyGallery({ images, titre }: PropertyGalleryProps) {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1))

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="group relative aspect-[16/10] overflow-hidden rounded-xl">
        <Image
          src={images[current] || "/images/villa1.jpg"}
          alt={`${titre} - Photo ${current + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
          priority
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md opacity-0 transition group-hover:opacity-100 hover:bg-white"
              aria-label="Image précédente"
            >
              <ChevronLeft className="h-5 w-5 text-[#0B1F3A]" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md opacity-0 transition group-hover:opacity-100 hover:bg-white"
              aria-label="Image suivante"
            >
              <ChevronRight className="h-5 w-5 text-[#0B1F3A]" />
            </button>
          </>
        )}
        {/* Counter */}
        <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
          {current + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg transition ${
                i === current
                  ? "ring-2 ring-[#C9A227] ring-offset-2"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={img} alt={`Miniature ${i + 1}`} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
