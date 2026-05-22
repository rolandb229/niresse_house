import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { propertyIncludeAll, serializeProperty } from "@/lib/serializers"
import type { Prisma } from "@prisma/client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const ville = searchParams.get("ville")
    const departement = searchParams.get("departement")
    const prix_min = searchParams.get("prix_min")
    const prix_max = searchParams.get("prix_max")
    const chambres_min = searchParams.get("chambres_min")
    const keyword = searchParams.get("keyword")
    const en_promotion = searchParams.get("en_promotion")
    const statut = searchParams.get("statut")
    const limit = parseInt(searchParams.get("limit") || "100")
    const offset = parseInt(searchParams.get("offset") || "0")

    const where: Prisma.PropertyWhereInput = {}

    if (type) where.type = type as Prisma.EnumPropertyTypeFilter["equals"]
    if (statut) where.statut = statut as Prisma.EnumPropertyStatusFilter["equals"]
    if (en_promotion === "true") where.enPromotion = true
    if (chambres_min) where.nombreChambres = { gte: Number(chambres_min) }

    if (prix_min || prix_max) {
      where.prix = {}
      if (prix_min) (where.prix as { gte?: number }).gte = Number(prix_min)
      if (prix_max) (where.prix as { lte?: number }).lte = Number(prix_max)
    }

    if (ville || departement) {
      where.quartier = {
        ville: {
          ...(ville && { nom: { contains: ville, mode: "insensitive" } }),
          ...(departement && {
            departement: { nom: { contains: departement, mode: "insensitive" } },
          }),
        },
      }
    }

    if (keyword) {
      where.OR = [
        { titre: { contains: keyword, mode: "insensitive" } },
        { description: { contains: keyword, mode: "insensitive" } },
        { quartier: { ville: { nom: { contains: keyword, mode: "insensitive" } } } },
      ]
    }

    const rows = await prisma.property.findMany({
      where,
      include: propertyIncludeAll,
      orderBy: [{ premium: "desc" }, { dateCreation: "desc" }],
      take: limit,
      skip: offset,
    })

    const properties = rows.map(serializeProperty)

    return NextResponse.json({ properties, total: properties.length })
  } catch (err) {
    console.error("[GET /api/properties]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      titre, description, type, prix, nombre_chambres, nombre_douches,
      surface, statut, quartier_id, proprietaire_id, verifie, premium,
      en_promotion, reduction, equipements, images,
    } = body

    if (!titre || !type || !prix) {
      return NextResponse.json(
        { error: "Titre, type et prix sont requis." },
        { status: 400 }
      )
    }

    const prefix = type === "vente" ? "VNT" : type === "location" ? "LOC" : "BIE"
    const code_unique = `${prefix}-${Date.now().toString(36).toUpperCase()}`

    const created = await prisma.property.create({
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
        codeUnique: code_unique,
        verifie: !!verifie,
        premium: !!premium,
        enPromotion: !!en_promotion,
        reduction: reduction ?? 0,
        equipements: equipements ?? null,
        images: images?.length
          ? {
              create: images.map((url: string, i: number) => ({
                imageUrl: url,
                type: "photo" as const,
                ordre: i,
              })),
            }
          : undefined,
      },
    })

    return NextResponse.json({
      success: true,
      id: created.id,
      code_unique,
      message: "Bien créé avec succès.",
    })
  } catch (err) {
    console.error("[POST /api/properties]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
