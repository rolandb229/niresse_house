"use client"

import { useEffect, useState } from "react"
import { CalendarCheck, Heart, MessageSquare, Star, Save } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SessionUser {
  id: number
  nom: string
  email: string
  role: string
}

interface Stats {
  reservations: number
  favoris: number
  demandes: number
  avis: number
}

export default function MonComptePage() {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [stats, setStats] = useState<Stats>({ reservations: 0, favoris: 0, demandes: 0, avis: 0 })
  const [form, setForm] = useState({ nom: "", email: "", telephone: "" })
  const [password, setPassword] = useState({ current: "", next: "" })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user)
          setForm({ nom: data.user.nom, email: data.user.email, telephone: "" })
        }
      })

    const favoris = JSON.parse(localStorage.getItem("niresse_favoris") || "[]") as number[]
    setStats((s) => ({ ...s, favoris: favoris.length }))

    // TODO: GET /api/reservations?user_id=X (filtre user_id à ajouter côté API)
    // TODO: GET /api/messages?user_email=X (filtrer les demandes de visite par email)
    // TODO: GET /api/avis?user_email=X (filtrer les avis postés par l'utilisateur)
  }, [])

  async function handleSaveInfos(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    try {
      const res = await fetch(`/api/utilisateurs/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: form.nom,
          email: form.email,
          telephone: form.telephone,
          role: user.role,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || "Erreur lors de la sauvegarde.")
        return
      }
      toast.success("Informations mises à jour.")
    } catch {
      toast.error("Impossible de joindre le serveur.")
    } finally {
      setSaving(false)
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    if (password.next.length < 8) {
      toast.error("Le nouveau mot de passe doit faire au moins 8 caractères.")
      return
    }
    setSaving(true)
    try {
      // TODO: idéalement créer une route dédiée /api/auth/change-password qui
      // vérifie le mot de passe actuel avant de le changer.
      const res = await fetch(`/api/utilisateurs/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: user.nom,
          email: user.email,
          telephone: form.telephone,
          role: user.role,
          mot_de_passe: password.next,
        }),
      })
      if (!res.ok) {
        toast.error("Erreur lors du changement.")
        return
      }
      toast.success("Mot de passe modifié.")
      setPassword({ current: "", next: "" })
    } finally {
      setSaving(false)
    }
  }

  const cards = [
    { label: "Réservations", value: stats.reservations, icon: CalendarCheck, color: "text-blue-600" },
    { label: "Favoris", value: stats.favoris, icon: Heart, color: "text-rose-500" },
    { label: "Demandes de visite", value: stats.demandes, icon: MessageSquare, color: "text-amber-600" },
    { label: "Avis postés", value: stats.avis, icon: Star, color: "text-[#C9A227]" },
  ]

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section>
        <h1 className="font-heading text-xl font-bold text-foreground">
          Bonjour {user?.nom?.split(" ")[0] ?? ""}
        </h1>
        <p className="text-sm text-muted-foreground">Voici un aperçu de votre compte.</p>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-border bg-card p-4">
            <div className="mb-2 flex items-center justify-between">
              <c.icon className={`h-5 w-5 ${c.color}`} />
              <span className="text-2xl font-bold text-foreground">{c.value}</span>
            </div>
            <p className="text-xs text-muted-foreground">{c.label}</p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 font-heading text-base font-semibold text-foreground">
          Mes informations
        </h2>
        <form onSubmit={handleSaveInfos} className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="nom" className="mb-1.5 text-xs">Nom complet</Label>
            <Input
              id="nom"
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="email" className="mb-1.5 text-xs">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="telephone" className="mb-1.5 text-xs">Téléphone</Label>
            <Input
              id="telephone"
              type="tel"
              value={form.telephone}
              onChange={(e) => setForm({ ...form, telephone: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <Button
              type="submit"
              disabled={saving}
              className="bg-[#0B1F3A] text-white hover:bg-[#0B1F3A]/90"
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 font-heading text-base font-semibold text-foreground">
          Changer le mot de passe
        </h2>
        <form onSubmit={handleChangePassword} className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="current" className="mb-1.5 text-xs">Mot de passe actuel</Label>
            <Input
              id="current"
              type="password"
              value={password.current}
              onChange={(e) => setPassword({ ...password, current: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="next" className="mb-1.5 text-xs">Nouveau mot de passe (8 car. min.)</Label>
            <Input
              id="next"
              type="password"
              minLength={8}
              value={password.next}
              onChange={(e) => setPassword({ ...password, next: e.target.value })}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <Button
              type="submit"
              disabled={saving}
              variant="outline"
            >
              Modifier le mot de passe
            </Button>
          </div>
        </form>
      </section>
    </div>
  )
}
