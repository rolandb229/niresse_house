"use client"

import { useEffect, useState, useCallback } from "react"
import { Phone, MessageSquare, CheckCircle, Clock, XCircle, RefreshCw, AlertCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Message {
  id: number
  property_id: number
  nom: string
  telephone: string
  email?: string
  message: string
  statut: "nouveau" | "en_traitement" | "cloture"
  date_creation: string
  property_titre?: string
}

const statutColors: Record<string, string> = {
  nouveau: "bg-[#1DB954]/10 text-[#1DB954]",
  en_traitement: "bg-[#C9A227]/10 text-[#C9A227]",
  cloture: "bg-muted text-muted-foreground",
}

const statutLabels: Record<string, string> = {
  nouveau: "Nouveau",
  en_traitement: "En traitement",
  cloture: "Clôturé",
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterStatut, setFilterStatut] = useState("")
  const [selectedMsg, setSelectedMsg] = useState<number | null>(null)
  const [updating, setUpdating] = useState<number | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const url = filterStatut ? `/api/messages?statut=${filterStatut}` : "/api/messages"
      const res = await fetch(url)
      if (!res.ok) throw new Error("Erreur de chargement")
      const data = await res.json()
      setMessages(data.messages || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur")
    } finally {
      setLoading(false)
    }
  }, [filterStatut])

  useEffect(() => { load() }, [load])

  async function updateStatut(id: number, statut: string) {
    setUpdating(id)
    try {
      await fetch(`/api/messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut }),
      })
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, statut: statut as Message["statut"] } : m))
      )
    } finally {
      setUpdating(null)
    }
  }

  async function deleteMsg(id: number) {
    if (!confirm("Supprimer ce message ?")) return
    await fetch(`/api/messages/${id}`, { method: "DELETE" })
    setMessages((prev) => prev.filter((m) => m.id !== id))
    if (selectedMsg === id) setSelectedMsg(null)
  }

  const counts = {
    total: messages.length,
    nouveau: messages.filter((m) => m.statut === "nouveau").length,
    en_traitement: messages.filter((m) => m.statut === "en_traitement").length,
    cloture: messages.filter((m) => m.statut === "cloture").length,
  }

  const filtered = filterStatut
    ? messages.filter((m) => m.statut === filterStatut)
    : messages

  const selectedMessage = messages.find((m) => m.id === selectedMsg)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-foreground">Messages de contact</h1>
          <p className="text-sm text-muted-foreground">{messages.length} messages au total</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Actualiser
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error} — Vérifiez que XAMPP/MySQL est démarré.
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Nouveaux", key: "nouveau", icon: MessageSquare, color: "text-[#1DB954]" },
          { label: "En traitement", key: "en_traitement", icon: Clock, color: "text-[#C9A227]" },
          { label: "Clôturés", key: "cloture", icon: CheckCircle, color: "text-muted-foreground" },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => setFilterStatut(filterStatut === s.key ? "" : s.key)}
            className={`rounded-xl border p-4 text-center transition ${
              filterStatut === s.key ? "border-[#0B1F3A] bg-[#0B1F3A]/5" : "border-border bg-card hover:bg-secondary/50"
            }`}
          >
            <s.icon className={`mx-auto mb-1 h-5 w-5 ${s.color}`} />
            <p className="text-2xl font-bold text-foreground">{counts[s.key as keyof typeof counts]}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <RefreshCw className="h-5 w-5 animate-spin text-[#C9A227]" />
          <span className="ml-2 text-sm text-muted-foreground">Chargement...</span>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Liste */}
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
                Aucun message.
              </div>
            ) : (
              filtered.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => setSelectedMsg(msg.id === selectedMsg ? null : msg.id)}
                  className={`w-full text-left rounded-xl border p-4 transition ${
                    selectedMsg === msg.id
                      ? "border-[#C9A227] bg-[#C9A227]/5"
                      : "border-border bg-card hover:bg-secondary/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${statutColors[msg.statut]}`}>
                          {statutLabels[msg.statut]}
                        </span>
                        {msg.property_titre && (
                          <span className="text-[10px] text-muted-foreground truncate">
                            {msg.property_titre}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 font-medium text-foreground">{msg.nom}</p>
                      <p className="truncate text-sm text-muted-foreground">{msg.message}</p>
                    </div>
                    <span className="shrink-0 text-[10px] text-muted-foreground">
                      {new Date(msg.date_creation).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Détail */}
          {selectedMessage ? (
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-foreground">Détail du message</h3>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${statutColors[selectedMessage.statut]}`}>
                  {statutLabels[selectedMessage.statut]}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Nom</p>
                  <p className="font-medium text-foreground">{selectedMessage.nom}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${selectedMessage.telephone}`} className="text-[#0B1F3A] hover:underline">
                    {selectedMessage.telephone}
                  </a>
                </div>
                {selectedMessage.email && (
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="text-foreground">{selectedMessage.email}</p>
                  </div>
                )}
                {selectedMessage.property_titre && (
                  <div>
                    <p className="text-muted-foreground">Bien concerné</p>
                    <p className="font-medium text-foreground">{selectedMessage.property_titre}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">Message</p>
                  <p className="mt-1 rounded-lg bg-secondary/50 p-3 text-foreground">{selectedMessage.message}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Reçu le {new Date(selectedMessage.date_creation).toLocaleString("fr-FR")}
                </p>
              </div>

              {/* Actions */}
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedMessage.statut !== "en_traitement" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatut(selectedMessage.id, "en_traitement")}
                    disabled={updating === selectedMessage.id}
                  >
                    <Clock className="mr-1.5 h-3.5 w-3.5" />
                    En traitement
                  </Button>
                )}
                {selectedMessage.statut !== "cloture" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatut(selectedMessage.id, "cloture")}
                    disabled={updating === selectedMessage.id}
                  >
                    <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                    Clôturer
                  </Button>
                )}
                {selectedMessage.statut !== "nouveau" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatut(selectedMessage.id, "nouveau")}
                    disabled={updating === selectedMessage.id}
                  >
                    <XCircle className="mr-1.5 h-3.5 w-3.5" />
                    Réouvrir
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteMsg(selectedMessage.id)}
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  Supprimer
                </Button>
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex items-center justify-center rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
              Sélectionnez un message pour voir les détails
            </div>
          )}
        </div>
      )}
    </div>
  )
}
