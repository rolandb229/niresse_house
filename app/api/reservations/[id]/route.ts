import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { ReservationStatus } from "@prisma/client"

const VALID_STATUTS: ReservationStatus[] = ["en_attente", "confirmee", "annulee", "terminee"]

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { statut } = await request.json()

    if (!VALID_STATUTS.includes(statut)) {
      return NextResponse.json({ error: "Statut invalide." }, { status: 400 })
    }

    await prisma.reservation.update({
      where: { id: Number(id) },
      data: { statut },
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[PUT /api/reservations/[id]]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.reservation.delete({ where: { id: Number(id) } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[DELETE /api/reservations/[id]]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
