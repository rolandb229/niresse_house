import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const statut = searchParams.get("statut")
    const property_id = searchParams.get("property_id")

    const where: Prisma.ContactRequestWhereInput = {}
    if (statut) where.statut = statut as Prisma.EnumContactStatusFilter["equals"]
    if (property_id) where.propertyId = Number(property_id)

    const rows = await prisma.contactRequest.findMany({
      where,
      include: { property: { select: { titre: true } } },
      orderBy: { dateCreation: "desc" },
    })

    const messages = rows.map((m) => ({
      id: m.id,
      property_id: m.propertyId,
      nom: m.nom,
      telephone: m.telephone,
      email: m.email,
      message: m.message,
      statut: m.statut,
      date_creation: m.dateCreation.toISOString(),
      property_titre: m.property?.titre ?? null,
    }))

    return NextResponse.json({ messages })
  } catch (err) {
    console.error("[GET /api/messages]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
