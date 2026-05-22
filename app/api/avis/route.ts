import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const property_id = searchParams.get("property_id")
    const approuve = searchParams.get("approuve")

    const where: Prisma.ReviewWhereInput = {}
    if (property_id) where.propertyId = Number(property_id)
    if (approuve === "true") where.approuve = true
    if (approuve === "false") where.approuve = false

    const rows = await prisma.review.findMany({
      where,
      include: { property: { select: { titre: true } } },
      orderBy: { dateCreation: "desc" },
    })

    const avis = rows.map((r) => ({
      id: r.id,
      property_id: r.propertyId,
      user_name: r.userName,
      user_email: r.userEmail,
      note: r.note,
      commentaire: r.commentaire,
      approuve: r.approuve,
      date_creation: r.dateCreation.toISOString(),
      property_titre: r.property?.titre ?? null,
    }))

    return NextResponse.json({ avis })
  } catch (err) {
    console.error("[GET /api/avis]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { property_id, user_name, user_email, note, commentaire } = await request.json()

    if (!property_id || !user_name || !note || !commentaire) {
      return NextResponse.json({ error: "Champs obligatoires manquants." }, { status: 400 })
    }

    if (note < 1 || note > 5) {
      return NextResponse.json({ error: "La note doit être entre 1 et 5." }, { status: 400 })
    }

    const created = await prisma.review.create({
      data: {
        propertyId: Number(property_id),
        userName: user_name,
        userEmail: user_email ?? null,
        note: Number(note),
        commentaire,
      },
    })

    return NextResponse.json({ success: true, id: created.id })
  } catch (err) {
    console.error("[POST /api/avis]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
