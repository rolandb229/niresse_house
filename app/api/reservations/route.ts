import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const statut = searchParams.get("statut")
    const property_id = searchParams.get("property_id")

    const where: Prisma.ReservationWhereInput = {}
    if (statut) where.statut = statut as Prisma.EnumReservationStatusFilter["equals"]
    if (property_id) where.propertyId = Number(property_id)

    const rows = await prisma.reservation.findMany({
      where,
      include: { property: { select: { titre: true } } },
      orderBy: { dateCreation: "desc" },
    })

    const reservations = rows.map((r) => ({
      id: r.id,
      property_id: r.propertyId,
      nom_client: r.nomClient,
      telephone: r.telephone,
      email: r.email,
      date_debut: r.dateDebut.toISOString(),
      date_fin: r.dateFin.toISOString(),
      nombre_personnes: r.nombrePersonnes,
      statut: r.statut,
      montant_total: Number(r.montantTotal),
      date_creation: r.dateCreation.toISOString(),
      property_titre: r.property?.titre ?? null,
    }))

    return NextResponse.json({ reservations })
  } catch (err) {
    console.error("[GET /api/reservations]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      property_id, nom_client, telephone, email,
      date_debut, date_fin, nombre_personnes, montant_total,
    } = body

    if (!property_id || !nom_client || !telephone || !date_debut || !date_fin) {
      return NextResponse.json({ error: "Champs obligatoires manquants." }, { status: 400 })
    }

    const created = await prisma.reservation.create({
      data: {
        propertyId: Number(property_id),
        nomClient: nom_client,
        telephone,
        email: email ?? null,
        dateDebut: new Date(date_debut),
        dateFin: new Date(date_fin),
        nombrePersonnes: nombre_personnes ?? 1,
        montantTotal: montant_total ?? 0,
      },
    })

    return NextResponse.json({ success: true, id: created.id })
  } catch (err) {
    console.error("[POST /api/reservations]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
