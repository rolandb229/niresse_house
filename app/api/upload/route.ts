import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { execute, query } from "@/lib/mysql"

// POST /api/upload — Upload d'images pour un bien (max 4)
export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const propertyId = formData.get("property_id")
    const files = formData.getAll("images") as File[]

    if (!propertyId) {
      return NextResponse.json({ error: "property_id est requis." }, { status: 400 })
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "Aucun fichier fourni." }, { status: 400 })
    }

    // Vérifier le nombre d'images existantes
    const existing = await query<{ total: number }>(
      "SELECT COUNT(*) AS total FROM property_images WHERE property_id = ?",
      [propertyId]
    )
    const currentCount = existing[0]?.total ?? 0

    if (currentCount >= 4) {
      return NextResponse.json(
        { error: "Ce bien a déjà 4 images (maximum). Supprimez une image avant d'en ajouter." },
        { status: 400 }
      )
    }

    const remaining = 4 - currentCount
    const toUpload = files.slice(0, remaining)

    // Créer le dossier uploads si nécessaire
    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    await mkdir(uploadsDir, { recursive: true })

    const uploadedUrls: string[] = []

    for (let i = 0; i < toUpload.length; i++) {
      const file = toUpload[i]

      // Valider le type de fichier
      if (!file.type.startsWith("image/")) {
        continue
      }

      // Limiter la taille à 5 MB
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: `L'image "${file.name}" dépasse 5 MB.` },
          { status: 400 }
        )
      }

      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
      const filename = `property_${propertyId}_${Date.now()}_${i}.${ext}`
      const filepath = path.join(uploadsDir, filename)
      const url = `/uploads/${filename}`

      const buffer = Buffer.from(await file.arrayBuffer())
      await writeFile(filepath, buffer)

      // Récupérer le prochain ordre
      const orderResult = await query<{ max_ordre: number }>(
        "SELECT COALESCE(MAX(ordre), -1) AS max_ordre FROM property_images WHERE property_id = ?",
        [propertyId]
      )
      const nextOrder = (orderResult[0]?.max_ordre ?? -1) + 1

      await execute(
        "INSERT INTO property_images (property_id, image_url, type, ordre) VALUES (?, ?, 'photo', ?)",
        [propertyId, url, nextOrder]
      )

      uploadedUrls.push(url)
    }

    return NextResponse.json({
      success: true,
      uploaded: uploadedUrls.length,
      urls: uploadedUrls,
      message: `${uploadedUrls.length} image(s) ajoutée(s) avec succès.`,
    })
  } catch (err) {
    console.error("[POST /api/upload]", err)
    return NextResponse.json(
      { error: "Erreur lors de l'upload. Vérifiez que XAMPP est démarré." },
      { status: 500 }
    )
  }
}

// DELETE /api/upload — Supprimer une image d'un bien
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const imageId = searchParams.get("image_id")
    const propertyId = searchParams.get("property_id")

    if (!imageId || !propertyId) {
      return NextResponse.json({ error: "image_id et property_id sont requis." }, { status: 400 })
    }

    // Récupérer l'URL avant suppression pour effacer le fichier
    const images = await query<{ image_url: string }>(
      "SELECT image_url FROM property_images WHERE id = ? AND property_id = ?",
      [imageId, propertyId]
    )

    if (images.length === 0) {
      return NextResponse.json({ error: "Image introuvable." }, { status: 404 })
    }

    const imageUrl = images[0].image_url

    // Supprimer de la base de données
    await execute(
      "DELETE FROM property_images WHERE id = ? AND property_id = ?",
      [imageId, propertyId]
    )

    // Supprimer le fichier physique si c'est un upload local
    if (imageUrl.startsWith("/uploads/")) {
      try {
        const { unlink } = await import("fs/promises")
        const filepath = path.join(process.cwd(), "public", imageUrl)
        await unlink(filepath)
      } catch {
        // Fichier déjà supprimé ou introuvable, on ignore
      }
    }

    return NextResponse.json({ success: true, message: "Image supprimée." })
  } catch (err) {
    console.error("[DELETE /api/upload]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
