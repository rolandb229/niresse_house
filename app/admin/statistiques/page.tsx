"use client"

import { useEffect, useState, useCallback } from "react"
import { Building2, TrendingUp, Eye, MessageSquare, MapPin, Users, Star, Tag, RefreshCw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Stats {
  totaux: {
    biens: number
    messages: number
    reservations: number
    users: number
    avis: number
    vues: number
    promotions: number
  }
  alertes: {
    nouveauxMessages: number
    reservationsEnAttente: number
    biensDisponibles: number
  }
  parType: { type: string; count: number }[]
  parStatut: { statut: string; count: number }[]
  topVilles: { ville: string; count: number }[]
  biensRecents: { id: number; titre: string; type: string; statut: string; date_creation: string }[]
}

const typeLabels: Record<string, string> = {
  location: "Location",
  vente: "Vente",
  court_sejour: "Court séjour",
  auberge: "Auberge",
  hotel: "Hôtel",
  chambre_meublee: "Chambre meublée",
  appartement_meuble: "Appartement meublé",
}

const statutColors: Record<string, string> = {
  disponible: "bg-green-500",
  loue: "bg-blue-500",
  vendu: "bg-gray-500",
  suspendu: "bg-red-500",
  reserve: "bg-yellow-500",
}

export default function AdminStatsPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/statistiques")
      if (!res.ok) throw new Error("Erreur de chargement")
      const data = await res.json()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <RefreshCw className="h-6 w-6 animate-spin text-[#C9A227]" />
        <span className="ml-2 text-muted-foreground">Chargement des statistiques...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-red-200 bg-red-50 p-8 text-center">
        <AlertCircle className="h-10 w-10 text-red-500" />
        <div>
          <p className="font-semibold text-red-700">Connexion MySQL impossible</p>
          <p className="mt-1 text-sm text-red-600">{error}</p>
        </div>
        <Button onClick={load} className="bg-red-600 text-white hover:bg-red-700">
          <RefreshCw className="mr-2 h-4 w-4" />
          Réessayer
        </Button>
      </div>
    )
  }

  if (!stats) return null

  const topStats = [
    { label: "Total biens", value: stats.totaux.biens, icon: Building2, color: "bg-[#0B1F3A]" },
    { label: "Biens disponibles", value: stats.alertes.biensDisponibles, icon: TrendingUp, color: "bg-[#1DB954]" },
    { label: "Vues totales", value: stats.totaux.vues.toLocaleString(), icon: Eye, color: "bg-[#C9A227]" },
    { label: "Messages", value: stats.totaux.messages, icon: MessageSquare, color: "bg-[#0B1F3A]/80" },
    { label: "Réservations", value: stats.totaux.reservations, icon: Users, color: "bg-purple-600" },
    { label: "Avis approuvés", value: stats.totaux.avis, icon: Star, color: "bg-amber-500" },
    { label: "Promotions actives", value: stats.totaux.promotions, icon: Tag, color: "bg-red-500" },
    { label: "Utilisateurs", value: stats.totaux.users, icon: Users, color: "bg-teal-600" },
  ]

  const maxType = Math.max(...stats.parType.map((t) => t.count), 1)
  const maxStatut = Math.max(...stats.parStatut.map((s) => s.count), 1)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-foreground">Statistiques</h1>
          <p className="text-sm text-muted-foreground">Aperçu général de la plateforme depuis MySQL</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Actualiser
        </Button>
      </div>

      {/* Alertes */}
      {(stats.alertes.nouveauxMessages > 0 || stats.alertes.reservationsEnAttente > 0) && (
        <div className="flex flex-wrap gap-3">
          {stats.alertes.nouveauxMessages > 0 && (
            <div className="flex items-center gap-2 rounded-lg border border-[#C9A227]/30 bg-[#C9A227]/10 px-4 py-2 text-sm text-[#C9A227]">
              <MessageSquare className="h-4 w-4" />
              {stats.alertes.nouveauxMessages} nouveau(x) message(s) à traiter
            </div>
          )}
          {stats.alertes.reservationsEnAttente > 0 && (
            <div className="flex items-center gap-2 rounded-lg border border-purple-200 bg-purple-50 px-4 py-2 text-sm text-purple-700">
              <Users className="h-4 w-4" />
              {stats.alertes.reservationsEnAttente} réservation(s) en attente de confirmation
            </div>
          )}
        </div>
      )}

      {/* Top stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {topStats.map((stat, i) => (
          <div key={i} className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${stat.color}`}>
              <stat.icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Répartition par type */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="mb-4 font-heading text-base font-semibold text-foreground">Biens par type</h3>
          <div className="space-y-3">
            {stats.parType.map((t) => (
              <div key={t.type} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{typeLabels[t.type] || t.type}</span>
                  <span className="font-medium text-foreground">{t.count}</span>
                </div>
                <div className="h-2 rounded-full bg-secondary">
                  <div
                    className="h-2 rounded-full bg-[#C9A227] transition-all"
                    style={{ width: `${(t.count / maxType) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Répartition par statut */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="mb-4 font-heading text-base font-semibold text-foreground">Biens par statut</h3>
          <div className="space-y-3">
            {stats.parStatut.map((s) => (
              <div key={s.statut} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`h-2.5 w-2.5 rounded-full ${statutColors[s.statut] || "bg-gray-500"}`} />
                    <span className="text-foreground capitalize">{s.statut}</span>
                  </div>
                  <span className="font-medium text-foreground">{s.count}</span>
                </div>
                <div className="h-2 rounded-full bg-secondary">
                  <div
                    className={`h-2 rounded-full transition-all ${statutColors[s.statut] || "bg-gray-500"}`}
                    style={{ width: `${(s.count / maxStatut) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top villes */}
        {stats.topVilles.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-4 font-heading text-base font-semibold text-foreground">Top villes</h3>
            <div className="space-y-3">
              {stats.topVilles.map((city, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C9A227]/10 text-sm font-bold text-[#C9A227]">
                    {i + 1}
                  </div>
                  <div className="flex flex-1 items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{city.ville}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{city.count} biens</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Biens récents */}
        {stats.biensRecents.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-4 font-heading text-base font-semibold text-foreground">Derniers biens ajoutés</h3>
            <div className="space-y-3">
              {stats.biensRecents.map((b) => (
                <div key={b.id} className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{b.titre}</p>
                    <p className="text-xs text-muted-foreground">
                      {typeLabels[b.type] || b.type} — {new Date(b.date_creation).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <span
                    className={`ml-2 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      b.statut === "disponible" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {b.statut}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
