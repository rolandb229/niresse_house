"use client"

import { useEffect, useState, useCallback } from "react"
import { Plus, MapPin, Building2, RefreshCw, AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Departement { id: number; nom: string; code: string }
interface Ville { id: number; nom: string; departement_id: number; departement?: string }
interface Quartier { id: number; nom: string; ville_id: number; ville?: string }

export default function AdminLocalitesPage() {
  const [departements, setDepartements] = useState<Departement[]>([])
  const [villes, setVilles] = useState<Ville[]>([])
  const [quartiers, setQuartiers] = useState<Quartier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"villes" | "quartiers">("quartiers")

  // Formulaire ajout quartier
  const [showAdd, setShowAdd] = useState(false)
  const [addType, setAddType] = useState<"ville" | "quartier">("quartier")
  const [formVilleId, setFormVilleId] = useState("")
  const [formDeptId, setFormDeptId] = useState("")
  const [formNom, setFormNom] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/localites")
      if (!res.ok) throw new Error("Erreur de chargement")
      const data = await res.json()
      setDepartements(data.departements || [])
      setVilles(data.villes || [])
      setQuartiers(data.quartiers || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!formNom) return
    setSubmitting(true)
    try {
      const payload =
        addType === "ville"
          ? { type: "ville", nom: formNom, departement_id: Number(formDeptId) }
          : { type: "quartier", nom: formNom, ville_id: Number(formVilleId) }

      const res = await fetch("/api/localites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Erreur")
      setShowAdd(false)
      setFormNom("")
      setFormVilleId("")
      setFormDeptId("")
      await load()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur")
    } finally {
      setSubmitting(false)
    }
  }

  // Grouper quartiers par ville
  const quartiersByVille = quartiers.reduce((acc, q) => {
    const ville = villes.find((v) => v.id === q.ville_id)
    const key = ville?.nom || "Inconnue"
    if (!acc[key]) acc[key] = []
    acc[key].push(q)
    return acc
  }, {} as Record<string, Quartier[]>)

  // Grouper villes par département
  const villesByDept = villes.reduce((acc, v) => {
    const dept = departements.find((d) => d.id === v.departement_id)
    const key = dept?.nom || "Inconnu"
    if (!acc[key]) acc[key] = []
    acc[key].push(v)
    return acc
  }, {} as Record<string, Ville[]>)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-foreground">Gestion des localités</h1>
          <p className="text-sm text-muted-foreground">
            {quartiers.length} quartiers dans {villes.length} villes et {departements.length} départements
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={() => setShowAdd(!showAdd)} className="bg-[#C9A227] text-white hover:bg-[#C9A227]/90">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error} — Vérifiez que XAMPP/MySQL est démarré.
        </div>
      )}

      {/* Formulaire d'ajout */}
      {showAdd && (
        <form onSubmit={handleAdd} className="rounded-xl border border-[#C9A227] bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-heading text-base font-semibold text-foreground">Nouvelle localité</h3>
            <button type="button" onClick={() => setShowAdd(false)}>
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-foreground">Type</label>
              <div className="flex gap-3">
                {["ville", "quartier"].map((t) => (
                  <label key={t} className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="type"
                      value={t}
                      checked={addType === t}
                      onChange={() => setAddType(t as "ville" | "quartier")}
                      className="accent-[#C9A227]"
                    />
                    <span className="text-sm capitalize text-foreground">{t}</span>
                  </label>
                ))}
              </div>
            </div>

            {addType === "ville" && (
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Département</label>
                <select
                  required
                  value={formDeptId}
                  onChange={(e) => setFormDeptId(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                >
                  <option value="">Sélectionner...</option>
                  {departements.map((d) => (
                    <option key={d.id} value={d.id}>{d.nom}</option>
                  ))}
                </select>
              </div>
            )}

            {addType === "quartier" && (
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Ville</label>
                <select
                  required
                  value={formVilleId}
                  onChange={(e) => setFormVilleId(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                >
                  <option value="">Sélectionner...</option>
                  {villes.map((v) => (
                    <option key={v.id} value={v.id}>{v.nom}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Nom</label>
              <input
                type="text"
                required
                value={formNom}
                onChange={(e) => setFormNom(e.target.value)}
                placeholder={addType === "ville" ? "Ex: Parakou" : "Ex: Akpakpa"}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>Annuler</Button>
            <Button type="submit" className="bg-[#C9A227] text-white hover:bg-[#C9A227]/90" disabled={submitting}>
              {submitting ? "Ajout..." : "Ajouter"}
            </Button>
          </div>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {[
          { key: "quartiers", label: `Quartiers (${quartiers.length})` },
          { key: "villes", label: `Villes & Départements (${villes.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as "villes" | "quartiers")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              activeTab === tab.key
                ? "border-[#C9A227] text-[#C9A227]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <RefreshCw className="h-5 w-5 animate-spin text-[#C9A227]" />
          <span className="ml-2 text-sm text-muted-foreground">Chargement...</span>
        </div>
      ) : activeTab === "quartiers" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(quartiersByVille).map(([ville, qs]) => (
            <div key={ville} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#C9A227]" />
                <h3 className="font-semibold text-foreground">{ville}</h3>
                <span className="ml-auto text-xs text-muted-foreground">{qs.length} quartiers</span>
              </div>
              <div className="space-y-1">
                {qs.map((q) => (
                  <div key={q.id} className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-secondary/50">
                    <MapPin className="h-3 w-3 text-muted-foreground/60" />
                    <span className="text-sm text-foreground">{q.nom}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(villesByDept).map(([dept, vs]) => (
            <div key={dept} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#0B1F3A]" />
                <h3 className="font-semibold text-foreground">{dept}</h3>
                <span className="ml-auto text-xs text-muted-foreground">{vs.length} villes</span>
              </div>
              <div className="space-y-1">
                {vs.map((v) => (
                  <div key={v.id} className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-secondary/50">
                    <Building2 className="h-3 w-3 text-muted-foreground/60" />
                    <span className="text-sm text-foreground">{v.nom}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
