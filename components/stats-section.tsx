"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion"
import { Building2, Map, Hotel, Users, ShieldCheck, Eye, Headphones, Zap } from "lucide-react"

const stats = [
  { icon: Building2, value: 500, suffix: "+", label: "Biens disponibles" },
  { icon: Map, value: 12, suffix: "", label: "Départements couverts" },
  { icon: Hotel, value: 50, suffix: "+", label: "Hôtels partenaires" },
  { icon: Users, value: 2000, suffix: "+", label: "Clients satisfaits" },
]

const trustFeatures = [
  { icon: ShieldCheck, title: "Biens vérifiés", text: "Visite physique avant publication" },
  { icon: Eye, title: "Transparence", text: "Photos réelles, prix sans frais cachés" },
  { icon: Headphones, title: "Accompagnement", text: "Support WhatsApp 7j/7" },
  { icon: Zap, title: "Rapidité", text: "Réponse en moins de 2h en moyenne" },
]

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-50px" })
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString("fr-FR"))
  const [display, setDisplay] = useState("0")

  useEffect(() => {
    if (!inView) return
    const controls = animate(count, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
    })
    const unsubscribe = rounded.on("change", (v) => setDisplay(v))
    return () => {
      controls.stop()
      unsubscribe()
    }
  }, [inView, value, count, rounded])

  return <span ref={ref}>{display}</span>
}

export default function StatsSection() {
  return (
    <section className="bg-[#0B1F3A] py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-14 text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#C9A227]"
          >
            La confiance en chiffres
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="font-heading text-3xl font-bold text-white text-balance md:text-4xl"
          >
            La référence immobilière au Bénin
          </motion.h2>
        </div>

        <div className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-white/10 p-6 text-center"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#C9A227]/40 text-[#C9A227]">
                <s.icon className="h-6 w-6" />
              </div>
              <p className="font-heading text-4xl font-bold text-white md:text-5xl">
                <AnimatedNumber value={s.value} />
                <span className="text-[#C9A227]">{s.suffix}</span>
              </p>
              <p className="mt-2 text-sm text-white/70">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustFeatures.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="flex items-start gap-3 rounded-xl border border-white/10 p-4"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#1DB954]/40 text-[#1DB954]">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{f.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-white/60">{f.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
