"use client"

import { useState } from "react"
import { Send, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ContactFormProps {
  propertyId: number
}

export default function ContactForm({ propertyId }: ContactFormProps) {
  const [nom, setNom] = useState("")
  const [telephone, setTelephone] = useState("")
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ property_id: propertyId, nom, telephone, message }),
      })

      if (res.ok) {
        setSent(true)
        setNom("")
        setTelephone("")
        setMessage("")
      }
    } catch (err) {
      console.error("[contact-form]", err)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <CheckCircle className="mx-auto mb-3 h-10 w-10 text-[#1DB954]" />
        <p className="font-heading text-base font-semibold text-card-foreground">
          Message envoy{"é"} !
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {"Notre équipe vous contactera très bientôt."}
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-4 text-xs font-medium text-[#0B1F3A] hover:underline"
        >
          Envoyer un autre message
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-card p-6 shadow-sm"
    >
      <h3 className="mb-4 font-heading text-base font-semibold text-card-foreground">
        {"Contactez-nous pour ce bien"}
      </h3>

      <div className="flex flex-col gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Votre nom
          </label>
          <input
            type="text"
            required
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Ex: Koffi Mensah"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            T{"é"}l{"é"}phone
          </label>
          <input
            type="tel"
            required
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            placeholder="+229 XX XX XX XX"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Message
          </label>
          <textarea
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={"Bonjour, je suis intéressé(e) par ce bien..."}
            className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#C9A227] text-white hover:bg-[#C9A227]/90"
        >
          <Send className="mr-2 h-4 w-4" />
          {loading ? "Envoi en cours..." : "Envoyer le message"}
        </Button>
      </div>
    </form>
  )
}
