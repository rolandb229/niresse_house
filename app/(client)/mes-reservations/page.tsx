"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Calendar, MapPin, Users, X, Eye } from "lucide-react"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface Reservation {
  id: number
  property_id: number
  property_titre: string | null
  date_debut: string
  date_fin: string
  nombre_personnes: number
  statut: "en_attente" | "confirmee" | "annulee" | "terminee"
  montant_total: number
}

const statutLabels: Record<Reservation["statut"], string> = {
  en_attente: "En attente",
  confirmee: "Confirmée",
  annulee: "Annulée",
  terminee: "Terminée",
}

const statutColors: Record<Reservation["statut"], string> = {
  en_attente: "bg-amber-100 text-amber-700",
  confirmee: "bg-emerald-100 text-emerald-700",
  annulee: "bg-rose-100 text-rose-700",
  terminee: "bg-slate-100 text-slate-700",
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export default function MesReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: ajouter un filtre ?user_id=X (ou ?email=X) sur GET /api/reservations
    // pour ne récupérer que les réservations de l'utilisateur courant.
    // Actuellement la route retourne TOUTES les réservations — non utilisable
    // en l'état pour un espace client.
    fetch("/api/reservations")
      .then((r) => r.json())
      .then((data) => setReservations(data.reservations || []))
      .catch(() => setReservations([]))
      .finally(() => setLoading(false))
  }, [])

  async function handleCancel(id: number) {
    if (!confirm("Confirmer l'annulation de cette réservation ?")) return
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: "annulee" }),
      })
      if (!res.ok) {
        toast.error("Impossible d'annuler la réservation.")
        return
      }
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, statut: "annulee" } : r))
      )
      toast.success("Réservation annulée.")
    } catch {
      toast.error("Erreur réseau.")
    }
  }

  const aVenir = reservations.filter((r) => r.statut === "en_attente")
  const confirmees = reservations.filter((r) => r.statut === "confirmee")
  const passees = reservations.filter((r) => r.statut === "terminee")
  const annulees = reservations.filter((r) => r.statut === "annulee")

  return (
    <div className="mx-auto max-w-4xl">
      <Tabs defaultValue="a-venir" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="a-venir">À venir ({aVenir.length})</TabsTrigger>
          <TabsTrigger value="confirmees">Confirmées ({confirmees.length})</TabsTrigger>
          <TabsTrigger value="passees">Passées ({passees.length})</TabsTrigger>
          <TabsTrigger value="annulees">Annulées ({annulees.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="a-venir" className="mt-4">
          <ReservationList
            loading={loading}
            items={aVenir}
            allowCancel
            onCancel={handleCancel}
          />
        </TabsContent>
        <TabsContent value="confirmees" className="mt-4">
          <ReservationList
            loading={loading}
            items={confirmees}
            allowCancel
            onCancel={handleCancel}
          />
        </TabsContent>
        <TabsContent value="passees" className="mt-4">
          <ReservationList loading={loading} items={passees} />
        </TabsContent>
        <TabsContent value="annulees" className="mt-4">
          <ReservationList loading={loading} items={annulees} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ReservationList({
  loading,
  items,
  allowCancel,
  onCancel,
}: {
  loading: boolean
  items: Reservation[]
  allowCancel?: boolean
  onCancel?: (id: number) => void
}) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
        <Calendar className="mx-auto h-10 w-10 text-muted-foreground" />
        <p className="mt-3 text-sm text-muted-foreground">Aucune réservation dans cet onglet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((r) => (
        <article key={r.id} className="rounded-xl border border-border bg-card p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="font-heading text-base font-semibold text-foreground">
                {r.property_titre || `Bien #${r.property_id}`}
              </h3>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(r.date_debut)} → {formatDate(r.date_fin)}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {r.nombre_personnes} {r.nombre_personnes > 1 ? "personnes" : "personne"}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  Bien #{r.property_id}
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {r.montant_total.toLocaleString("fr-FR")} FCFA
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span
                className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${statutColors[r.statut]}`}
              >
                {statutLabels[r.statut]}
              </span>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/bien/${r.property_id}`}>
                    <Eye className="mr-1 h-3.5 w-3.5" />
                    Voir
                  </Link>
                </Button>
                {allowCancel && onCancel && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCancel(r.id)}
                    className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                  >
                    <X className="mr-1 h-3.5 w-3.5" />
                    Annuler
                  </Button>
                )}
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
