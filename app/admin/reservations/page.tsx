"use client"

import { useEffect, useState, useCallback } from "react"
import { CalendarCheck, Phone, Mail, Search, Check, X, Clock, RefreshCw, AlertCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Reservation {
  id: number
  property_id: number
  nom_client: string
  telephone: string
  email?: string
  date_debut: string
  date_fin: string
  nombre_personnes: number
  statut: "en_attente" | "confirmee" | "annulee" | "terminee"
  montant_total?: number
  notes?: string
  date_creation: string
  property_titre?: string
}

const statusColors: Record<string, string> = {
  en_attente: "bg-yellow-100 text-yellow-700",
  confirmee: "bg-green-100 text-green-700",
  annulee: "bg-red-100 text-red-700",
  terminee: "bg-gray-100 text-gray-700",
}

const statusLabels: Record<string, string> = {
  en_attente: "En attente",
  confirmee: "Confirmée",
  annulee: "Annulée",
  terminee: "Terminée",
}

function formatPrice(n?: number) {
  if (!n) return "—"
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF", maximumFractionDigits: 0 }).format(n)
}

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [updating, setUpdating] = useState<number | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/reservations")
      if (!res.ok) throw new Error("Erreur de chargement")
      const data = await res.json()
      setReservations(data.reservations || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function updateStatut(id: number, statut: string) {
    setUpdating(id)
    try {
      await fetch(`/api/reservations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut }),
      })
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, statut: statut as Reservation["statut"] } : r))
      )
    } finally {
      setUpdating(null)
    }
  }

  async function deleteReservation(id: number) {
    if (!confirm("Supprimer cette réservation ?")) return
    await fetch(`/api/reservations/${id}`, { method: "DELETE" })
    setReservations((prev) => prev.filter((r) => r.id !== id))
  }

  const filtered = reservations.filter((r) => {
    const matchesFilter = filter === "all" || r.statut === filter
    const matchesSearch =
      search === "" ||
      r.nom_client.toLowerCase().includes(search.toLowerCase()) ||
      r.telephone.includes(search)
    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-foreground">Réservations</h1>
          <p className="text-sm text-muted-foreground">
            Gérez les réservations pour les auberges, hôtels et courts séjours
          </p>
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

      {/* Filtres */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher par nom ou téléphone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
          />
        </div>
        <div className="flex gap-2">
          {["all", "en_attente", "confirmee", "annulee", "terminee"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                filter === s
                  ? "bg-[#0B1F3A] text-white"
                  : "border border-border bg-card text-foreground hover:bg-secondary/50"
              }`}
            >
              {s === "all" ? "Tout" : statusLabels[s]}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <RefreshCw className="h-5 w-5 animate-spin text-[#C9A227]" />
          <span className="ml-2 text-sm text-muted-foreground">Chargement...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Aucune réservation trouvée.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[r.statut]}`}>
                      {statusLabels[r.statut]}
                    </span>
                    {r.property_titre && (
                      <span className="text-xs text-muted-foreground">{r.property_titre}</span>
                    )}
                  </div>
                  <p className="font-medium text-foreground">{r.nom_client}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      {r.telephone}
                    </span>
                    {r.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" />
                        {r.email}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <CalendarCheck className="h-3.5 w-3.5" />
                      {new Date(r.date_debut).toLocaleDateString("fr-FR")} → {new Date(r.date_fin).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-muted-foreground">{r.nombre_personnes} pers.</span>
                    {r.montant_total && (
                      <span className="font-medium text-[#C9A227]">{formatPrice(r.montant_total)}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {r.statut === "en_attente" && (
                    <Button
                      size="sm"
                      className="bg-[#1DB954] text-white hover:bg-[#1DB954]/90"
                      onClick={() => updateStatut(r.id, "confirmee")}
                      disabled={updating === r.id}
                    >
                      <Check className="mr-1.5 h-3.5 w-3.5" />
                      Confirmer
                    </Button>
                  )}
                  {r.statut === "confirmee" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatut(r.id, "terminee")}
                      disabled={updating === r.id}
                    >
                      <Clock className="mr-1.5 h-3.5 w-3.5" />
                      Terminée
                    </Button>
                  )}
                  {(r.statut === "en_attente" || r.statut === "confirmee") && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => updateStatut(r.id, "annulee")}
                      disabled={updating === r.id}
                    >
                      <X className="mr-1.5 h-3.5 w-3.5" />
                      Annuler
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteReservation(r.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
