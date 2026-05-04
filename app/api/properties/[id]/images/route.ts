import { NextResponse } from "next/server"
import { query, execute } from "@/lib/mysql"
import { unlink } from "fs/promises"
import path from "path"

// GET /api/properties/[id]/images — Récupérer les images d'un bien
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const images = await query<{ id: number; image_url: string; ordre: number }>(
      "SELECT id, image_url, ordre FROM property_images WHERE property_id = ? ORDER BY ordre ASC",
      [id]
    )

    return NextResponse.json({ images })
  } catch (err) {
    console.error("[GET /api/properties/[id]/images]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

// DELETE /api/properties/[id]/images?image_id=X — Supprimer une image individuelle
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const imageId = searchParams.get("image_id")

    if (!imageId) {
      return NextResponse.json({ error: "image_id est requis." }, { status: 400 })
    }

    // Récupérer l'URL avant suppression pour effacer le fichier physique
    const images = await query<{ image_url: string }>(
      "SELECT image_url FROM property_images WHERE id = ? AND property_id = ?",
      [imageId, id]
    )

    if (images.length === 0) {
      return NextResponse.json({ error: "Image introuvable." }, { status: 404 })
    }

    const imageUrl = images[0].image_url

    // Supprimer de la base de données
    await execute(
      "DELETE FROM property_images WHERE id = ? AND property_id = ?",
      [imageId, id]
    )

    // Supprimer le fichier physique uniquement pour les uploads locaux
    if (imageUrl.startsWith("/uploads/")) {
      try {
        const filePath = path.join(process.cwd(), "public", imageUrl)
        await unlink(filePath)
      } catch {
        // Fichier déjà absent, on ignore silencieusement
      }
    }

    return NextResponse.json({ success: true, message: "Image supprimée." })
  } catch (err) {
    console.error("[DELETE /api/properties/[id]/images]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
