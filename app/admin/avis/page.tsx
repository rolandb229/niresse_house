"use client"

import { useEffect, useState, useCallback } from "react"
import { Star, Check, X, Search, MessageSquare, RefreshCw, AlertCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Avis {
  id: number
  property_id: number
  user_name: string
  user_email?: string
  note: number
  commentaire: string
  approuve: boolean
  date_creation: string
  property_titre?: string
}

export default function AdminAvisPage() {
  const [avis, setAvis] = useState<Avis[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [updating, setUpdating] = useState<number | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/avis")
      if (!res.ok) throw new Error("Erreur de chargement")
      const data = await res.json()
      setAvis(data.avis || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function toggleApprove(id: number, approuve: boolean) {
    setUpdating(id)
    try {
      await fetch(`/api/avis/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approuve }),
      })
      setAvis((prev) => prev.map((a) => (a.id === id ? { ...a, approuve } : a)))
    } finally {
      setUpdating(null)
    }
  }

  async function deleteAvis(id: number) {
    if (!confirm("Supprimer cet avis ?")) return
    await fetch(`/api/avis/${id}`, { method: "DELETE" })
    setAvis((prev) => prev.filter((a) => a.id !== id))
  }

  const filtered = avis.filter((a) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "approuve" && a.approuve) ||
      (filter === "en_attente" && !a.approuve)
    const matchesSearch =
      search === "" ||
      a.user_name.toLowerCase().includes(search.toLowerCase()) ||
      a.commentaire.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-foreground">Avis clients</h1>
          <p className="text-sm text-muted-foreground">Gérez et modérez les avis laissés par vos clients</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-green-100 px-3 py-1.5 text-sm">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-green-700">{avis.filter((a) => a.approuve).length} approuvés</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-yellow-100 px-3 py-1.5 text-sm">
            <div className="h-2 w-2 rounded-full bg-yellow-500" />
            <span className="text-yellow-700">{avis.filter((a) => !a.approuve).length} en attente</span>
          </div>
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
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
            placeholder="Rechercher par nom ou commentaire..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
          />
        </div>
        <div className="flex gap-2">
          {[
            { key: "all", label: "Tous" },
            { key: "en_attente", label: "En attente" },
            { key: "approuve", label: "Approuvés" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                filter === f.key
                  ? "bg-[#0B1F3A] text-white"
                  : "border border-border bg-card text-foreground hover:bg-secondary/50"
              }`}
            >
              {f.label}
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
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <MessageSquare className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Aucun avis trouvé.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <div
              key={a.id}
              className={`rounded-xl border p-4 shadow-sm ${
                !a.approuve ? "border-yellow-200 bg-yellow-50/50" : "border-border bg-card"
              }`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        a.approuve
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {a.approuve ? "Approuvé" : "En attente"}
                    </span>
                    {a.property_titre && (
                      <span className="text-xs text-muted-foreground">{a.property_titre}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{a.user_name}</p>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-3.5 w-3.5 ${s <= a.note ? "fill-[#C9A227] text-[#C9A227]" : "text-muted-foreground/30"}`}
                        />
                      ))}
                    </div>
                  </div>
                  {a.user_email && (
                    <p className="text-xs text-muted-foreground">{a.user_email}</p>
                  )}
                  <p className="text-sm text-foreground">{a.commentaire}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(a.date_creation).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!a.approuve ? (
                    <Button
                      size="sm"
                      className="bg-[#1DB954] text-white hover:bg-[#1DB954]/90"
                      onClick={() => toggleApprove(a.id, true)}
                      disabled={updating === a.id}
                    >
                      <Check className="mr-1.5 h-3.5 w-3.5" />
                      Approuver
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleApprove(a.id, false)}
                      disabled={updating === a.id}
                    >
                      <X className="mr-1.5 h-3.5 w-3.5" />
                      Désapprouver
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteAvis(a.id)}
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
