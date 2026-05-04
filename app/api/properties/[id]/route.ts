import { NextResponse } from "next/server"
import { query, execute } from "@/lib/mysql"
import type { Property } from "@/lib/types"

// GET /api/properties/[id]
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const rows = await query<Record<string, unknown>>(
      `SELECT 
        p.id, p.titre, p.description, p.type, p.prix,
        p.nombre_chambres, p.nombre_douches, p.surface,
        p.statut, p.code_unique, p.verifie, p.premium,
        p.en_promotion, p.reduction, p.equipements, p.vues,
        p.date_creation, p.quartier_id, p.proprietaire_id,
        q.nom AS quartier, v.nom AS ville, d.nom AS departement,
        COALESCE(AVG(r.note), 0) AS note_moyenne,
        COUNT(DISTINCT r.id) AS nombre_avis
      FROM properties p
      LEFT JOIN quartiers q ON p.quartier_id = q.id
      LEFT JOIN villes v ON q.ville_id = v.id
      LEFT JOIN departements d ON v.departement_id = d.id
      LEFT JOIN reviews r ON r.property_id = p.id AND r.approuve = TRUE
      WHERE p.id = ?
      GROUP BY p.id`,
      [id]
    )

    if (!rows.length) {
      return NextResponse.json({ error: "Bien non trouvé." }, { status: 404 })
    }

    // Incrémenter les vues
    await execute("UPDATE properties SET vues = vues + 1 WHERE id = ?", [id])

    // Récupérer les images
    const images = await query<{ image_url: string }>(
      "SELECT image_url FROM property_images WHERE property_id = ? AND type = 'photo' ORDER BY ordre",
      [id]
    )

    const row = rows[0]
    const property: Property = {
      id: row.id as number,
      titre: row.titre as string,
      description: row.description as string,
      type: row.type as Property["type"],
      prix: Number(row.prix),
      nombre_chambres: row.nombre_chambres as number,
      nombre_douches: row.nombre_douches as number,
      surface: Number(row.surface),
      statut: row.statut as Property["statut"],
      code_unique: row.code_unique as string,
      verifie: Boolean(row.verifie),
      premium: Boolean(row.premium),
      en_promotion: Boolean(row.en_promotion),
      reduction: row.reduction as number,
      equipements: row.equipements
        ? (typeof row.equipements === "string" ? JSON.parse(row.equipements) : row.equipements) as string[]
        : [],
      vues: row.vues as number,
      date_creation: String(row.date_creation),
      ville_id: row.quartier_id as number,
      proprietaire_id: row.proprietaire_id as number,
      quartier: row.quartier as string,
      ville: row.ville as string,
      departement: row.departement as string,
      note_moyenne: Number(row.note_moyenne) || 0,
      nombre_avis: Number(row.nombre_avis) || 0,
      images: images.map((img) => img.image_url),
    }

    return NextResponse.json({ property })
  } catch (err) {
    console.error("[GET /api/properties/[id]]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

// PUT /api/properties/[id] — Modifier un bien
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const {
      titre, description, type, prix, nombre_chambres, nombre_douches,
      surface, statut, quartier_id, proprietaire_id, verifie, premium,
      en_promotion, reduction, equipements, images,
    } = body

    await execute(
      `UPDATE properties SET
        titre = ?, description = ?, type = ?, prix = ?,
        nombre_chambres = ?, nombre_douches = ?, surface = ?,
        statut = ?, quartier_id = ?, proprietaire_id = ?,
        verifie = ?, premium = ?, en_promotion = ?, reduction = ?,
        equipements = ?
      WHERE id = ?`,
      [
        titre, description || null, type, prix,
        nombre_chambres || 1, nombre_douches || 1, surface || null,
        statut || "disponible", quartier_id || null, proprietaire_id || null,
        verifie ? 1 : 0, premium ? 1 : 0,
        en_promotion ? 1 : 0, reduction || 0,
        equipements ? JSON.stringify(equipements) : null,
        id,
      ]
    )

    // Mettre à jour les images si fournies
    if (images && images.length > 0) {
      await execute("DELETE FROM property_images WHERE property_id = ?", [id])
      for (let i = 0; i < images.length; i++) {
        await execute(
          "INSERT INTO property_images (property_id, image_url, type, ordre) VALUES (?, ?, 'photo', ?)",
          [id, images[i], i]
        )
      }
    }

    return NextResponse.json({ success: true, message: "Bien modifié avec succès." })
  } catch (err) {
    console.error("[PUT /api/properties/[id]]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

// DELETE /api/properties/[id] — Supprimer un bien et toutes ses images
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Récupérer les images uploadées pour supprimer les fichiers physiques
    const images = await query<{ image_url: string }>(
      "SELECT image_url FROM property_images WHERE property_id = ?",
      [id]
    )

    // Supprimer les images de la base d'abord (contrainte FK)
    await execute("DELETE FROM property_images WHERE property_id = ?", [id])

    // Supprimer le bien
    await execute("DELETE FROM properties WHERE id = ?", [id])

    // Supprimer les fichiers physiques uploadés localement
    const { unlink } = await import("fs/promises")
    const path = await import("path")
    for (const img of images) {
      if (img.image_url.startsWith("/uploads/")) {
        try {
          await unlink(path.join(process.cwd(), "public", img.image_url))
        } catch {
          // Fichier déjà absent, on ignore
        }
      }
    }

    return NextResponse.json({ success: true, message: "Bien supprimé avec succès." })
  } catch (err) {
    console.error("[DELETE /api/properties/[id]]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
