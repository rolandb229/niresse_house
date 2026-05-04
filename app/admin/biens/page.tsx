"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import {
  Plus, Search, Eye, Pencil, Trash2, Star, BadgeCheck,
  RefreshCw, AlertCircle, X, Save, ChevronLeft, Upload, ImagePlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface PropertyImage {
  id: number
  image_url: string
  ordre: number
}

interface Property {
  id: number
  titre: string
  description: string
  type: string
  prix: number
  nombre_chambres: number
  nombre_douches: number
  surface: number
  statut: string
  code_unique: string
  verifie: boolean
  premium: boolean
  en_promotion: boolean
  reduction: number
  vues: number
  quartier: string
  ville: string
  departement: string
  images: string[]
  equipements?: string[]
  quartier_id?: number
  note_moyenne?: number
  nombre_avis?: number
}

interface Localite {
  id: number
  nom: string
  ville_id?: number
}

const TYPES = [
  { value: "location", label: "Location" },
  { value: "vente", label: "Vente" },
  { value: "court_sejour", label: "Court séjour" },
  { value: "auberge", label: "Auberge" },
  { value: "hotel", label: "Hôtel" },
  { value: "chambre_meublee", label: "Chambre meublée" },
  { value: "appartement_meuble", label: "Appartement meublé" },
]

const STATUTS = [
  { value: "disponible", label: "Disponible" },
  { value: "loue", label: "Loué" },
  { value: "vendu", label: "Vendu" },
  { value: "suspendu", label: "Suspendu" },
  { value: "reserve", label: "Réservé" },
]

const statutColors: Record<string, string> = {
  disponible: "bg-green-100 text-green-700",
  loue: "bg-blue-100 text-blue-700",
  vendu: "bg-gray-100 text-gray-700",
  suspendu: "bg-red-100 text-red-700",
  reserve: "bg-yellow-100 text-yellow-700",
}

function formatPrice(n: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF", maximumFractionDigits: 0 }).format(n)
}

const emptyForm = {
  titre: "",
  description: "",
  type: "location",
  prix: "",
  nombre_chambres: "1",
  nombre_douches: "1",
  surface: "",
  statut: "disponible",
  quartier_id: "",
  verifie: false,
  premium: false,
  en_promotion: false,
  reduction: "0",
  equipements: "",
}

// ============================================================
// Composant : Section upload d'images (max 4)
// ============================================================
function ImageUploadSection({
  propertyId,
  onImagesChanged,
}: {
  propertyId: number
  onImagesChanged?: () => void
}) {
  const [images, setImages] = useState<PropertyImage[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadImages = useCallback(async () => {
    try {
      const res = await fetch(`/api/properties/${propertyId}/images`)
      if (!res.ok) return
      const data = await res.json()
      setImages(data.images || [])
    } catch {
      // silencieux
    }
  }, [propertyId])

  useEffect(() => {
    loadImages()
  }, [loadImages])

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    const remaining = 4 - images.length
    if (remaining <= 0) {
      setUploadError("Maximum 4 images atteint. Supprimez une image pour en ajouter.")
      return
    }

    setUploading(true)
    setUploadError(null)

    const form = new FormData()
    form.append("property_id", String(propertyId))
    for (let i = 0; i < Math.min(files.length, remaining); i++) {
      form.append("images", files[i])
    }

    try {
      const res = await fetch("/api/upload", { method: "POST", body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erreur upload")
      await loadImages()
      onImagesChanged?.()
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Erreur lors de l'upload")
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  async function handleDelete(imageId: number) {
    if (!confirm("Supprimer cette image ?")) return
    try {
      const res = await fetch(`/api/upload?image_id=${imageId}&property_id=${propertyId}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Erreur suppression")
      }
      await loadImages()
      onImagesChanged?.()
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Erreur suppression")
    }
  }

  const canAdd = images.length < 4

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          Photos du bien <span className="text-muted-foreground font-normal">({images.length}/4 maximum)</span>
        </label>
        {canAdd && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 rounded-lg bg-[#0B1F3A] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#0B1F3A]/90 disabled:opacity-60 transition"
          >
            {uploading ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ImagePlus className="h-3.5 w-3.5" />
            )}
            {uploading ? "Upload..." : "Ajouter"}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {uploadError && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {uploadError}
        </div>
      )}

      {images.length === 0 ? (
        <button
          type="button"
          onClick={() => canAdd && fileInputRef.current?.click()}
          disabled={!canAdd || uploading}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-secondary/30 py-8 text-sm text-muted-foreground transition hover:border-[#C9A227]/50 hover:bg-secondary/60 disabled:opacity-50"
        >
          <Upload className="h-8 w-8 text-muted-foreground/50" />
          <span>Cliquez pour ajouter jusqu&apos;à 4 photos</span>
          <span className="text-xs">JPG, PNG, WEBP — max 5 MB par image</span>
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((img, i) => (
            <div key={img.id} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-secondary shadow-sm">
              <Image
                src={img.image_url}
                alt={`Photo ${i + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/40 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => handleDelete(img.id)}
                  className="scale-0 rounded-full bg-red-500 p-1.5 text-white transition group-hover:scale-100"
                  title="Supprimer cette image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {i === 0 && (
                <span className="absolute left-2 top-2 rounded bg-[#C9A227] px-1.5 py-0.5 text-[10px] font-bold text-white">
                  Principale
                </span>
              )}
            </div>
          ))}

          {/* Zone d'ajout si < 4 images */}
          {canAdd && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex aspect-[4/3] flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border bg-secondary/30 text-muted-foreground transition hover:border-[#C9A227]/50 hover:bg-secondary/60 disabled:opacity-50"
            >
              {uploading ? (
                <RefreshCw className="h-6 w-6 animate-spin" />
              ) : (
                <ImagePlus className="h-6 w-6" />
              )}
              <span className="text-xs">{uploading ? "Upload..." : "Ajouter"}</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================================
// Page principale
// ============================================================
export default function AdminBiensPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [quartiers, setQuartiers] = useState<Localite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState("")
  const [filterStatut, setFilterStatut] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  // Après création/édition, on garde l'id pour l'upload d'images
  const [savedPropertyId, setSavedPropertyId] = useState<number | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [propRes, locRes] = await Promise.all([
        fetch("/api/properties"),
        fetch("/api/localites?type=quartiers"),
      ])
      if (!propRes.ok) throw new Error("Erreur de chargement des biens")
      const propData = await propRes.json()
      const locData = await locRes.json()
      setProperties(propData.properties || [])
      setQuartiers(locData.quartiers || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  function openAdd() {
    setForm({ ...emptyForm })
    setEditingId(null)
    setSavedPropertyId(null)
    setFormError(null)
    setShowForm(true)
  }

  function openEdit(p: Property) {
    setForm({
      titre: p.titre,
      description: p.description || "",
      type: p.type,
      prix: String(p.prix),
      nombre_chambres: String(p.nombre_chambres),
      nombre_douches: String(p.nombre_douches),
      surface: String(p.surface || ""),
      statut: p.statut,
      quartier_id: String(p.quartier_id || ""),
      verifie: p.verifie,
      premium: p.premium,
      en_promotion: p.en_promotion,
      reduction: String(p.reduction || 0),
      equipements: Array.isArray(p.equipements) ? (p.equipements as string[]).join(", ") : "",
    })
    setEditingId(p.id)
    setSavedPropertyId(p.id)
    setFormError(null)
    setShowForm(true)
  }

  async function submitForm() {
    setFormError(null)
    if (!form.titre || !form.prix || !form.type) {
      setFormError("Titre, type et prix sont obligatoires.")
      return
    }
    setSubmitting(true)
    try {
      const payload = {
        titre: form.titre,
        description: form.description,
        type: form.type,
        prix: Number(form.prix),
        nombre_chambres: Number(form.nombre_chambres),
        nombre_douches: Number(form.nombre_douches),
        surface: form.surface ? Number(form.surface) : null,
        statut: form.statut,
        quartier_id: form.quartier_id ? Number(form.quartier_id) : null,
        verifie: form.verifie,
        premium: form.premium,
        en_promotion: form.en_promotion,
        reduction: Number(form.reduction),
        equipements: form.equipements
          ? form.equipements.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      }

      const url = editingId ? `/api/properties/${editingId}` : "/api/properties"
      const method = editingId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erreur")

      // Après création, on reste sur la page pour uploader les images
      if (!editingId && data.id) {
        setSavedPropertyId(data.id)
        setEditingId(data.id)
      } else {
        await load()
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Erreur")
    } finally {
      setSubmitting(false)
    }
  }

  async function deleteProp(id: number) {
    if (!confirm("Supprimer ce bien définitivement ?")) return
    await fetch(`/api/properties/${id}`, { method: "DELETE" })
    setProperties((prev) => prev.filter((p) => p.id !== id))
  }

  function closeForm() {
    setShowForm(false)
    setSavedPropertyId(null)
    setEditingId(null)
    load()
  }

  const filtered = properties.filter((p) => {
    const matchSearch =
      !search ||
      p.titre.toLowerCase().includes(search.toLowerCase()) ||
      p.code_unique.toLowerCase().includes(search.toLowerCase()) ||
      (p.ville || "").toLowerCase().includes(search.toLowerCase())
    const matchType = !filterType || p.type === filterType
    const matchStatut = !filterStatut || p.statut === filterStatut
    return matchSearch && matchType && matchStatut
  })

  // ---- FORMULAIRE ----
  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={closeForm}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Retour à la liste
          </button>
          <h1 className="font-heading text-xl font-bold text-foreground">
            {editingId ? "Modifier le bien" : "Ajouter un bien"}
          </h1>
        </div>

        {formError && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {formError}
          </div>
        )}

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-5">
          {/* Informations du bien */}
          <div>
            <h2 className="mb-4 text-sm font-semibold text-foreground border-b border-border pb-2">
              Informations générales
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-foreground">Titre *</label>
                <input
                  type="text"
                  value={form.titre}
                  onChange={(e) => setForm((f) => ({ ...f, titre: e.target.value }))}
                  placeholder="Ex: Villa moderne 4 chambres - Haie Vive"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                  disabled={!!savedPropertyId && !editingId}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Type *</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                >
                  {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Statut</label>
                <select
                  value={form.statut}
                  onChange={(e) => setForm((f) => ({ ...f, statut: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                >
                  {STATUTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Prix (FCFA) *</label>
                <input
                  type="number"
                  value={form.prix}
                  onChange={(e) => setForm((f) => ({ ...f, prix: e.target.value }))}
                  placeholder="Ex: 150000"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Surface (m²)</label>
                <input
                  type="number"
                  value={form.surface}
                  onChange={(e) => setForm((f) => ({ ...f, surface: e.target.value }))}
                  placeholder="Ex: 120"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Chambres</label>
                <input
                  type="number"
                  min="1"
                  value={form.nombre_chambres}
                  onChange={(e) => setForm((f) => ({ ...f, nombre_chambres: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Douches</label>
                <input
                  type="number"
                  min="1"
                  value={form.nombre_douches}
                  onChange={(e) => setForm((f) => ({ ...f, nombre_douches: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-foreground">Quartier / Localité</label>
                <select
                  value={form.quartier_id}
                  onChange={(e) => setForm((f) => ({ ...f, quartier_id: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                >
                  <option value="">Sélectionner un quartier...</option>
                  {quartiers.map((q) => (
                    <option key={q.id} value={q.id}>{q.nom}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-foreground">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={4}
                  placeholder="Description détaillée du bien..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Équipements <span className="text-muted-foreground font-normal">(séparés par des virgules)</span>
                </label>
                <input
                  type="text"
                  value={form.equipements}
                  onChange={(e) => setForm((f) => ({ ...f, equipements: e.target.value }))}
                  placeholder="WiFi, Climatisation, Piscine, Garage, Sécurité 24h"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                />
              </div>

              {/* Toggles */}
              <div className="sm:col-span-2 flex flex-wrap gap-4">
                {[
                  { key: "verifie", label: "Bien vérifié" },
                  { key: "premium", label: "Premium" },
                  { key: "en_promotion", label: "En promotion" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form[key as keyof typeof form] as boolean}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.checked }))}
                      className="h-4 w-4 rounded border-border accent-[#C9A227]"
                    />
                    <span className="text-sm text-foreground">{label}</span>
                  </label>
                ))}
                {form.en_promotion && (
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-foreground">Réduction (%)</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={form.reduction}
                      onChange={(e) => setForm((f) => ({ ...f, reduction: e.target.value }))}
                      className="w-20 rounded-lg border border-border bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bouton Sauvegarder le bien */}
          {!savedPropertyId && (
            <div className="flex justify-end gap-3 pt-2 border-t border-border">
              <Button variant="outline" onClick={closeForm}>Annuler</Button>
              <Button
                className="bg-[#C9A227] text-white hover:bg-[#C9A227]/90"
                onClick={submitForm}
                disabled={submitting}
              >
                <Save className="mr-2 h-4 w-4" />
                {submitting ? "Enregistrement..." : "Enregistrer le bien"}
              </Button>
            </div>
          )}

          {/* Section upload images — visible après sauvegarde ou en modification */}
          {savedPropertyId && (
            <div className="border-t border-border pt-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">
                  Photos du bien
                </h2>
                <span className="text-xs text-muted-foreground bg-secondary rounded-full px-2.5 py-0.5">
                  Maximum 4 photos
                </span>
              </div>

              <ImageUploadSection
                propertyId={savedPropertyId}
                onImagesChanged={load}
              />

              {/* Boutons de modification */}
              {editingId && (
                <div className="flex justify-end gap-3 pt-2 border-t border-border">
                  <Button variant="outline" onClick={closeForm}>Fermer</Button>
                  <Button
                    className="bg-[#C9A227] text-white hover:bg-[#C9A227]/90"
                    onClick={submitForm}
                    disabled={submitting}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {submitting ? "Enregistrement..." : "Sauvegarder les modifications"}
                  </Button>
                </div>
              )}

              {/* Après création */}
              {!editingId && savedPropertyId && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                  <p className="text-sm text-green-700 font-medium">
                    Bien créé avec succès. Ajoutez jusqu&apos;à 4 photos ci-dessus, puis cliquez sur Terminer.
                  </p>
                  <div className="mt-3 flex justify-end">
                    <Button
                      className="bg-[#0B1F3A] text-white hover:bg-[#0B1F3A]/90"
                      onClick={closeForm}
                    >
                      Terminer
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ---- LISTE DES BIENS ----
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-foreground">Gestion des biens</h1>
          <p className="text-sm text-muted-foreground">{properties.length} biens au total</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button className="bg-[#C9A227] text-white hover:bg-[#C9A227]/90" onClick={openAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un bien
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error} — Vérifiez que XAMPP/MySQL est démarré et que la base &ldquo;niressehouse&rdquo; existe.
        </div>
      )}

      {/* Filtres */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par titre, code ou ville..."
            className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
        >
          <option value="">Tous les types</option>
          {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <select
          value={filterStatut}
          onChange={(e) => setFilterStatut(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
        >
          <option value="">Tous les statuts</option>
          {STATUTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <RefreshCw className="h-5 w-5 animate-spin text-[#C9A227]" />
          <span className="ml-2 text-sm text-muted-foreground">Chargement depuis MySQL...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <Upload className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            {properties.length === 0
              ? "Aucun bien dans la base de données. Ajoutez votre premier bien !"
              : "Aucun bien ne correspond à votre recherche."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Bien</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Prix</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Statut</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Badges</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-secondary/30 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-3">
                      {p.images && p.images[0] ? (
                        <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded">
                          <Image
                            src={p.images[0]}
                            alt={p.titre}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-14 shrink-0 rounded bg-secondary flex items-center justify-center text-muted-foreground text-xs">
                          N/A
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-foreground line-clamp-1">{p.titre}</p>
                        <p className="text-xs text-muted-foreground">
                          {p.quartier ? `${p.quartier}, ` : ""}{p.ville}
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 font-mono">{p.code_unique}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-muted-foreground">
                      {TYPES.find((t) => t.value === p.type)?.label || p.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-foreground">{formatPrice(p.prix)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statutColors[p.statut] || "bg-gray-100 text-gray-700"}`}>
                      {STATUTS.find((s) => s.value === p.statut)?.label || p.statut}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.verifie && (
                        <Badge variant="outline" className="gap-1 text-[10px] text-[#1DB954] border-[#1DB954]/30">
                          <BadgeCheck className="h-3 w-3" />
                          Vérifié
                        </Badge>
                      )}
                      {p.premium && (
                        <Badge variant="outline" className="gap-1 text-[10px] text-[#C9A227] border-[#C9A227]/30">
                          <Star className="h-3 w-3" />
                          Premium
                        </Badge>
                      )}
                      {p.en_promotion && (
                        <Badge variant="outline" className="text-[10px] text-red-500 border-red-200">
                          -{p.reduction}%
                        </Badge>
                      )}
                      <span className="text-[10px] text-muted-foreground">{p.vues} vues</span>
                      {p.images && p.images.length > 0 && (
                        <span className="text-[10px] text-[#0B1F3A] font-medium">
                          {p.images.length} photo{p.images.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={`/bien/${p.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-7 w-7 items-center justify-center rounded hover:bg-secondary"
                        title="Voir"
                      >
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </a>
                      <button
                        onClick={() => openEdit(p)}
                        className="flex h-7 w-7 items-center justify-center rounded hover:bg-secondary"
                        title="Modifier / Gérer les photos"
                      >
                        <Pencil className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => deleteProp(p.id)}
                        className="flex h-7 w-7 items-center justify-center rounded hover:bg-red-50"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
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
