"use client"

import { useEffect, useState, useCallback } from "react"
import { Tag, Plus, Search, Percent, Calendar, Building2, X, RefreshCw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Promotion {
  id: number
  property_id: number
  reduction: number
  date_debut: string
  date_fin: string
  active: boolean
  property_titre: string
  property_ville?: string
}

interface Property {
  id: number
  titre: string
  type: string
  ville?: string
  en_promotion: boolean
  statut: string
}

function formatPrice(n: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF", maximumFractionDigits: 0 }).format(n)
}

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    property_id: "",
    reduction: "10",
    date_debut: new Date().toISOString().split("T")[0],
    date_fin: "",
  })

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [promoRes, propRes] = await Promise.all([
        fetch("/api/promotions"),
        fetch("/api/properties?statut=disponible"),
      ])
      if (!promoRes.ok) throw new Error("Erreur de chargement")
      const promoData = await promoRes.json()
      const propData = await propRes.json()
      setPromotions(promoData.promotions || [])
      setProperties((propData.properties || []).filter((p: Property) => !p.en_promotion))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function addPromotion() {
    if (!form.property_id || !form.reduction || !form.date_debut || !form.date_fin) {
      alert("Veuillez remplir tous les champs.")
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          property_id: Number(form.property_id),
          reduction: Number(form.reduction),
          date_debut: form.date_debut,
          date_fin: form.date_fin,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Erreur")
      }
      setShowAddForm(false)
      setForm({ property_id: "", reduction: "10", date_debut: new Date().toISOString().split("T")[0], date_fin: "" })
      await load()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur")
    } finally {
      setSubmitting(false)
    }
  }

  async function deletePromotion(id: number) {
    if (!confirm("Supprimer cette promotion ?")) return
    await fetch(`/api/promotions/${id}`, { method: "DELETE" })
    setPromotions((prev) => prev.filter((p) => p.id !== id))
  }

  async function toggleActive(id: number, active: boolean) {
    await fetch(`/api/promotions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    })
    setPromotions((prev) => prev.map((p) => (p.id === id ? { ...p, active } : p)))
  }

  const filtered = promotions.filter(
    (p) => search === "" || p.property_titre.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-foreground">Promotions</h1>
          <p className="text-sm text-muted-foreground">Gérez les promotions et réductions sur vos biens</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-[#C9A227] text-white hover:bg-[#C9A227]/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une promotion
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error} — Vérifiez que XAMPP/MySQL est démarré.
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
              <Tag className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{promotions.filter((p) => p.active).length}</p>
              <p className="text-xs text-muted-foreground">Promotions actives</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#C9A227]/10">
              <Percent className="h-5 w-5 text-[#C9A227]" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">
                {promotions.length > 0
                  ? Math.round(promotions.reduce((s, p) => s + p.reduction, 0) / promotions.length)
                  : 0}%
              </p>
              <p className="text-xs text-muted-foreground">Réduction moyenne</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0B1F3A]/10">
              <Building2 className="h-5 w-5 text-[#0B1F3A]" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{properties.length}</p>
              <p className="text-xs text-muted-foreground">Biens disponibles</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire ajout */}
      {showAddForm && (
        <div className="rounded-xl border border-[#C9A227] bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-heading font-semibold text-foreground">Nouvelle promotion</h3>
            <button onClick={() => setShowAddForm(false)}>
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-foreground">Bien à promouvoir</label>
              <select
                value={form.property_id}
                onChange={(e) => setForm((f) => ({ ...f, property_id: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
              >
                <option value="">Sélectionner un bien...</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.titre} {p.ville ? `— ${p.ville}` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Réduction (%)</label>
              <input
                type="number"
                min="1"
                max="50"
                value={form.reduction}
                onChange={(e) => setForm((f) => ({ ...f, reduction: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Date de début</label>
              <input
                type="date"
                value={form.date_debut}
                onChange={(e) => setForm((f) => ({ ...f, date_debut: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Date de fin</label>
              <input
                type="date"
                value={form.date_fin}
                onChange={(e) => setForm((f) => ({ ...f, date_fin: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAddForm(false)}>Annuler</Button>
            <Button
              className="bg-[#C9A227] text-white hover:bg-[#C9A227]/90"
              onClick={addPromotion}
              disabled={submitting}
            >
              {submitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </div>
      )}

      {/* Recherche */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Rechercher une promotion..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
        />
      </div>

      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <RefreshCw className="h-5 w-5 animate-spin text-[#C9A227]" />
          <span className="ml-2 text-sm text-muted-foreground">Chargement...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Aucune promotion. Cliquez sur &ldquo;Ajouter une promotion&rdquo; pour commencer.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Bien</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Réduction</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Période</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Statut</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((promo) => (
                <tr key={promo.id} className="hover:bg-secondary/30 transition">
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{promo.property_titre}</p>
                    {promo.property_ville && (
                      <p className="text-xs text-muted-foreground">{promo.property_ville}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-[#C9A227]">{promo.reduction}%</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(promo.date_debut).toLocaleDateString("fr-FR")} →{" "}
                      {new Date(promo.date_fin).toLocaleDateString("fr-FR")}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(promo.id, !promo.active)}
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition ${
                        promo.active
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {promo.active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deletePromotion(promo.id)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
