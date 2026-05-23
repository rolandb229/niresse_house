"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, MessageCircle, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CtaSection() {
  return (
    <section className="bg-[#C9A227] py-20 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 text-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-heading text-3xl font-bold leading-tight text-white text-balance md:text-5xl">
            Prêt à trouver votre prochain bien ?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg">
            Que vous cherchiez à habiter, investir ou voyager au Bénin,
            notre équipe vous accompagne à chaque étape.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-[#0B1F3A] px-7 text-white hover:bg-[#0B1F3A]/90"
            >
              <Link href="/recherche">
                Explorer les biens
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-[#0B1F3A]/30 bg-white px-7 text-[#0B1F3A] hover:bg-white/90"
            >
              <a
                href="https://wa.me/0166369842"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Discuter sur WhatsApp
              </a>
            </Button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-white/85">
            <Phone className="h-4 w-4" />
            <span>Ou appelez-nous au</span>
            <a href="tel:0166369842" className="font-semibold underline-offset-4 hover:underline">
              01 66 36 98 42
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
