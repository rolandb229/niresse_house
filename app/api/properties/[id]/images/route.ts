import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { unlink } from "fs/promises"
import path from "path"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const propertyId = Number(id)

    const rows = await prisma.propertyImage.findMany({
      where: { propertyId },
      orderBy: { ordre: "asc" },
      select: { id: true, imageUrl: true, ordre: true },
    })

    const images = rows.map((r) => ({ id: r.id, image_url: r.imageUrl, ordre: r.ordre }))
    return NextResponse.json({ images })
  } catch (err) {
    console.error("[GET /api/properties/[id]/images]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const propertyId = Number(id)
    const { searchParams } = new URL(request.url)
    const imageIdParam = searchParams.get("image_id")

    if (!imageIdParam) {
      return NextResponse.json({ error: "image_id est requis." }, { status: 400 })
    }

    const imageId = Number(imageIdParam)
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
    console.error("[DELETE /api/properties/[id]/images]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
