"use client"

import { useEffect, useState, useCallback } from "react"
import { Plus, Trash2, Shield, ShieldCheck, Users, Briefcase, RefreshCw, AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface User {
  id: number
  nom: string
  email: string
  telephone: string
  role: "super_admin" | "admin" | "commercial" | "client"
  date_creation: string
}

const roleIcons: Record<string, typeof Shield> = {
  super_admin: ShieldCheck,
  admin: Shield,
  commercial: Briefcase,
  client: Users,
}

const roleLabels: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  commercial: "Commercial",
  client: "Client",
}

const roleColors: Record<string, string> = {
  super_admin: "bg-[#C9A227] text-white",
  admin: "bg-[#0B1F3A] text-white",
  commercial: "bg-[#1DB954] text-white",
  client: "bg-secondary text-secondary-foreground",
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [form, setForm] = useState({
    nom: "", email: "", telephone: "", role: "commercial", mot_de_passe: "",
  })

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/utilisateurs")
      if (!res.ok) throw new Error("Erreur de chargement")
      const data = await res.json()
      setUsers(data.utilisateurs || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    if (!form.nom || !form.email || !form.telephone || !form.mot_de_passe) {
      setFormError("Tous les champs sont obligatoires.")
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/utilisateurs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erreur")
      setShowAdd(false)
      setForm({ nom: "", email: "", telephone: "", role: "commercial", mot_de_passe: "" })
      await load()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Erreur")
    } finally {
      setSubmitting(false)
    }
  }

  async function deleteUser(id: number) {
    if (!confirm("Supprimer cet utilisateur ?")) return
    await fetch(`/api/utilisateurs/${id}`, { method: "DELETE" })
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-foreground">Gestion des utilisateurs</h1>
          <p className="text-sm text-muted-foreground">{users.length} utilisateurs</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={() => setShowAdd(!showAdd)} className="bg-[#C9A227] text-white hover:bg-[#C9A227]/90">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un utilisateur
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
            <h3 className="font-heading text-base font-semibold text-foreground">Nouvel utilisateur</h3>
            <button type="button" onClick={() => setShowAdd(false)}>
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
          {formError && (
            <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{formError}</div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Nom complet</label>
              <input
                type="text"
                required
                value={form.nom}
                onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Téléphone</label>
              <input
                type="tel"
                required
                value={form.telephone}
                onChange={(e) => setForm((f) => ({ ...f, telephone: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Rôle</label>
              <select
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
              >
                <option value="super_admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="commercial">Commercial</option>
                <option value="client">Client</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-foreground">Mot de passe</label>
              <input
                type="password"
                required
                value={form.mot_de_passe}
                onChange={(e) => setForm((f) => ({ ...f, mot_de_passe: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>Annuler</Button>
            <Button type="submit" className="bg-[#C9A227] text-white hover:bg-[#C9A227]/90" disabled={submitting}>
              {submitting ? "Enregistrement..." : "Ajouter"}
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <RefreshCw className="h-5 w-5 animate-spin text-[#C9A227]" />
          <span className="ml-2 text-sm text-muted-foreground">Chargement...</span>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Utilisateur</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Rôle</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Téléphone</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Inscription</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    Aucun utilisateur.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const RoleIcon = roleIcons[u.role] || Users
                  return (
                    <tr key={u.id} className="hover:bg-secondary/30 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0B1F3A]/10">
                            <RoleIcon className="h-4 w-4 text-[#0B1F3A]" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{u.nom}</p>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${roleColors[u.role]}`}>
                          {roleLabels[u.role]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{u.telephone}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {new Date(u.date_creation).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteUser(u.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
