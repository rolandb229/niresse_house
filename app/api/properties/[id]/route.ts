import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { propertyIncludeAll, serializeProperty } from "@/lib/serializers"
import { unlink } from "fs/promises"
import path from "path"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const propertyId = Number(id)

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: propertyIncludeAll,
    })

    if (!property) {
      return NextResponse.json({ error: "Bien non trouvé." }, { status: 404 })
    }

    await prisma.property.update({
      where: { id: propertyId },
      data: { vues: { increment: 1 } },
    })

    return NextResponse.json({ property: serializeProperty(property) })
  } catch (err) {
    console.error("[GET /api/properties/[id]]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const propertyId = Number(id)
    const body = await request.json()
    const {
      titre, description, type, prix, nombre_chambres, nombre_douches,
      surface, statut, quartier_id, proprietaire_id, verifie, premium,
      en_promotion, reduction, equipements, images,
    } = body

    await prisma.property.update({
      where: { id: propertyId },
      data: {
        titre,
        description: description ?? null,
        type,
        prix,
        nombreChambres: nombre_chambres ?? 1,
        nombreDouches: nombre_douches ?? 1,
        surface: surface ?? null,
        statut: statut ?? "disponible",
        quartierId: quartier_id,
        proprietaireId: proprietaire_id,
        verifie: !!verifie,
        premium: !!premium,
        enPromotion: !!en_promotion,
        reduction: reduction ?? 0,
        equipements: equipements ?? null,
      },
    })

    if (images && images.length > 0) {
      await prisma.propertyImage.deleteMany({ where: { propertyId } })
      await prisma.propertyImage.createMany({
        data: images.map((url: string, i: number) => ({
          propertyId,
          imageUrl: url,
          type: "photo" as const,
          ordre: i,
        })),
      })
    }

    return NextResponse.json({ success: true, message: "Bien modifié avec succès." })
  } catch (err) {
    console.error("[PUT /api/properties/[id]]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const propertyId = Number(id)

    const images = await prisma.propertyImage.findMany({
      where: { propertyId },
      select: { imageUrl: true },
    })

    await prisma.property.delete({ where: { id: propertyId } })

    for (const img of images) {
      if (img.imageUrl.startsWith("/uploads/")) {
        try {
          await unlink(path.join(process.cwd(), "public", img.imageUrl))
        } catch {
          // Fichier déjà absent
        }
      }
    }

    return NextResponse.json({ success: true, message: "Bien supprimé avec succès." })
  } catch (err) {
    console.error("[DELETE /api/properties/[id]]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
