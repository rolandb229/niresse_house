"use client"

import { useEffect, useState } from "react"
import {
  Building2,
  Users,
  MessageSquare,
  TrendingUp,
  Eye,
  Phone,
  ArrowUpRight,
  Hotel,
  Tag,
  CalendarCheck,
  MapPin,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"

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

interface Message {
  id: number
  nom: string
  telephone: string
  message: string
  statut: string
  date_creation: string
  property_titre?: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const [statsRes, msgRes] = await Promise.all([
        fetch("/api/statistiques"),
        fetch("/api/messages?statut=nouveau"),
      ])
      if (!statsRes.ok) throw new Error("Impossible de charger les statistiques")
      const statsData = await statsRes.json()
      const msgData = await msgRes.json()
      setStats(statsData)
      setMessages(msgData.messages || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <RefreshCw className="h-6 w-6 animate-spin text-[#C9A227]" />
        <span className="ml-2 text-muted-foreground">Chargement depuis la base de données...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-red-200 bg-red-50 p-8 text-center">
        <AlertCircle className="h-10 w-10 text-red-500" />
        <div>
          <p className="font-semibold text-red-700">Connexion MySQL impossible</p>
          <p className="mt-1 text-sm text-red-600">{error}</p>
          <p className="mt-2 text-xs text-red-500">
            Assurez-vous que XAMPP est démarré et que la base de données &ldquo;niressehouse&rdquo; existe.
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          <RefreshCw className="h-4 w-4" />
          Réessayer
        </button>
      </div>
    )
  }

  if (!stats) return null

  const statCards = [
    {
      label: "Total biens",
      value: stats.totaux.biens,
      icon: Building2,
      color: "bg-[#0B1F3A]",
      href: "/admin/biens",
    },
    {
      label: "Vues totales",
      value: stats.totaux.vues.toLocaleString(),
      icon: Eye,
      color: "bg-[#1DB954]",
      href: "/admin/statistiques",
    },
    {
      label: "Messages",
      value: stats.totaux.messages,
      badge: stats.alertes.nouveauxMessages > 0 ? stats.alertes.nouveauxMessages : undefined,
      icon: MessageSquare,
      color: "bg-[#C9A227]",
      href: "/admin/messages",
    },
    {
      label: "Réservations",
      value: stats.totaux.reservations,
      badge: stats.alertes.reservationsEnAttente > 0 ? stats.alertes.reservationsEnAttente : undefined,
      icon: CalendarCheck,
      color: "bg-purple-600",
      href: "/admin/reservations",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="rounded-xl bg-gradient-to-r from-[#0B1F3A] to-[#1a3a5c] p-6 text-white">
        <h1 className="font-heading text-xl font-bold md:text-2xl">Bienvenue sur NiresseHouse Admin</h1>
        <p className="mt-1 text-sm text-white/70">
          Gérez vos biens, réservations, messages et statistiques depuis ce tableau de bord.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/admin/biens"
            className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20 transition"
          >
            <Building2 className="h-4 w-4" />
            Ajouter un bien
          </Link>
          <Link
            href="/admin/promotions"
            className="inline-flex items-center gap-2 rounded-lg bg-[#C9A227] px-4 py-2 text-sm font-medium hover:bg-[#C9A227]/90 transition"
          >
            <Tag className="h-4 w-4" />
            Gérer les promotions
          </Link>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <Link
            key={i}
            href={stat.href}
            className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md"
          >
            <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${stat.color}`}>
              <stat.icon className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
                {stat.badge && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {stat.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 transition group-hover:text-[#C9A227]" />
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Messages récents */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-heading text-base font-semibold text-card-foreground">
              Nouveaux messages
            </h3>
            <Link href="/admin/messages" className="text-xs text-[#C9A227] hover:underline">
              Voir tout
            </Link>
          </div>
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun nouveau message.</p>
          ) : (
            <div className="space-y-3">
              {messages.slice(0, 4).map((msg) => (
                <div
                  key={msg.id}
                  className="flex items-start gap-3 rounded-lg border border-border bg-secondary/50 p-3"
                >
                  <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#1DB954]" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground">{msg.nom}</p>
                    <p className="text-xs text-muted-foreground truncate">{msg.message}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground/60">
                      <Phone className="h-3 w-3" />
                      {msg.telephone}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#1DB954]/10 px-2 py-0.5 text-[10px] font-medium text-[#1DB954]">
                    Nouveau
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Biens récents */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-heading text-base font-semibold text-card-foreground">
              Biens récents
            </h3>
            <Link href="/admin/biens" className="text-xs text-[#C9A227] hover:underline">
              Voir tout
            </Link>
          </div>
          <div className="space-y-3">
            {stats.biensRecents.map((b) => (
              <div key={b.id} className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{b.titre}</p>
                  <p className="text-xs text-muted-foreground">{b.type}</p>
                </div>
                <span
                  className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    b.statut === "disponible"
                      ? "bg-green-100 text-green-700"
                      : b.statut === "loue"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {b.statut}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chiffres rapides */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1DB954]/10">
              <TrendingUp className="h-5 w-5 text-[#1DB954]" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{stats.alertes.biensDisponibles}</p>
              <p className="text-xs text-muted-foreground">Biens disponibles</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0B1F3A]/10">
              <Users className="h-5 w-5 text-[#0B1F3A]" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{stats.totaux.users}</p>
              <p className="text-xs text-muted-foreground">Utilisateurs</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Hotel className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{stats.totaux.avis}</p>
              <p className="text-xs text-muted-foreground">Avis approuvés</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
              <Tag className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{stats.totaux.promotions}</p>
              <p className="text-xs text-muted-foreground">Promotions actives</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top villes */}
      {stats.topVilles.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="mb-4 font-heading text-base font-semibold text-card-foreground">
            Top villes (nombre de biens)
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {stats.topVilles.map((city, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
                <MapPin className="h-4 w-4 text-[#C9A227]" />
                <div>
                  <p className="text-sm font-medium text-foreground">{city.ville}</p>
                  <p className="text-xs text-muted-foreground">{city.count} biens</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
