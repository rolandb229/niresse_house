import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { ContactStatus } from "@prisma/client"

const VALID_STATUTS: ContactStatus[] = ["nouveau", "en_traitement", "cloture"]

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

    await prisma.contactRequest.update({
      where: { id: Number(id) },
      data: { statut },
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[PUT /api/messages/[id]]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.contactRequest.delete({ where: { id: Number(id) } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[DELETE /api/messages/[id]]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
