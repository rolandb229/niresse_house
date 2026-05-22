import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const rows = await prisma.promotion.findMany({
      include: {
        property: {
          select: {
            titre: true,
            quartier: { include: { ville: true } },
          },
        },
      },
      orderBy: { dateCreation: "desc" },
    })

    const promotions = rows.map((pr) => ({
      id: pr.id,
      property_id: pr.propertyId,
      reduction: pr.reduction,
      date_debut: pr.dateDebut.toISOString(),
      date_fin: pr.dateFin.toISOString(),
      active: pr.active,
      date_creation: pr.dateCreation.toISOString(),
      property_titre: pr.property.titre,
      property_ville: pr.property.quartier?.ville?.nom ?? null,
    }))

    return NextResponse.json({ promotions })
  } catch (err) {
    console.error("[GET /api/promotions]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { property_id, reduction, date_debut, date_fin } = await request.json()

    if (!property_id || !reduction || !date_debut || !date_fin) {
      return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 })
    }

    if (reduction < 1 || reduction > 50) {
      return NextResponse.json({ error: "La réduction doit être entre 1% et 50%." }, { status: 400 })
    }

    const created = await prisma.$transaction(async (tx) => {
      const promo = await tx.promotion.create({
        data: {
          propertyId: Number(property_id),
          reduction: Number(reduction),
          dateDebut: new Date(date_debut),
          dateFin: new Date(date_fin),
          active: true,
        },
      })

      await tx.property.update({
        where: { id: Number(property_id) },
        data: { enPromotion: true, reduction: Number(reduction) },
      })

      return promo
    })

    return NextResponse.json({ success: true, id: created.id })
  } catch (err) {
    console.error("[POST /api/promotions]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
