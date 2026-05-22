import { NextResponse } from "next/server"
import { writeFile, mkdir, unlink } from "fs/promises"
import path from "path"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const propertyIdRaw = formData.get("property_id")
    const files = formData.getAll("images") as File[]

    if (!propertyIdRaw) {
      return NextResponse.json({ error: "property_id est requis." }, { status: 400 })
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "Aucun fichier fourni." }, { status: 400 })
    }

    const propertyId = Number(propertyIdRaw)

    const currentCount = await prisma.propertyImage.count({ where: { propertyId } })

    if (currentCount >= 4) {
      return NextResponse.json(
        { error: "Ce bien a déjà 4 images (maximum). Supprimez une image avant d'en ajouter." },
        { status: 400 }
      )
    }

    const remaining = 4 - currentCount
    const toUpload = files.slice(0, remaining)

    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    await mkdir(uploadsDir, { recursive: true })

    const maxOrdreResult = await prisma.propertyImage.aggregate({
      where: { propertyId },
      _max: { ordre: true },
    })
    let nextOrder = (maxOrdreResult._max.ordre ?? -1) + 1

    const uploadedUrls: string[] = []

    for (let i = 0; i < toUpload.length; i++) {
      const file = toUpload[i]

      if (!file.type.startsWith("image/")) continue

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

      await prisma.propertyImage.create({
        data: {
          propertyId,
          imageUrl: url,
          type: "photo",
          ordre: nextOrder++,
        },
      })

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
    return NextResponse.json({ error: "Erreur lors de l'upload." }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const imageIdParam = searchParams.get("image_id")
    const propertyIdParam = searchParams.get("property_id")

    if (!imageIdParam || !propertyIdParam) {
      return NextResponse.json({ error: "image_id et property_id sont requis." }, { status: 400 })
    }

    const imageId = Number(imageIdParam)
    const propertyId = Number(propertyIdParam)

    const image = await prisma.propertyImage.findFirst({
      where: { id: imageId, propertyId },
      select: { imageUrl: true },
    })

    if (!image) {
      return NextResponse.json({ error: "Image introuvable." }, { status: 404 })
    }

    await prisma.propertyImage.delete({ where: { id: imageId } })

    if (image.imageUrl.startsWith("/uploads/")) {
      try {
        await unlink(path.join(process.cwd(), "public", image.imageUrl))
      } catch {
        // Fichier déjà absent
      }
    }

    return NextResponse.json({ success: true, message: "Image supprimée." })
  } catch (err) {
    console.error("[DELETE /api/upload]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
