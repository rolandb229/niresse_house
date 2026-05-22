import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const promoId = Number(id)

    const promo = await prisma.promotion.findUnique({
      where: { id: promoId },
      select: { propertyId: true },
    })

    if (!promo) {
      return NextResponse.json({ error: "Promotion introuvable." }, { status: 404 })
    }

    await prisma.$transaction([
      prisma.promotion.delete({ where: { id: promoId } }),
      prisma.property.update({
        where: { id: promo.propertyId },
        data: { enPromotion: false, reduction: 0 },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[DELETE /api/promotions/[id]]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { active } = await request.json()

    await prisma.promotion.update({
      where: { id: Number(id) },
      data: { active: !!active },
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[PUT /api/promotions/[id]]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
