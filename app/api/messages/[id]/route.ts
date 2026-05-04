import { NextResponse } from "next/server"
import { execute } from "@/lib/mysql"

// PUT /api/messages/[id] — Changer le statut d'un message
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { statut } = await request.json()

    if (!["nouveau", "en_traitement", "cloture"].includes(statut)) {
      return NextResponse.json({ error: "Statut invalide." }, { status: 400 })
    }

    await execute("UPDATE contact_requests SET statut = ? WHERE id = ?", [statut, id])
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[PUT /api/messages/[id]]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

// DELETE /api/messages/[id]
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await execute("DELETE FROM contact_requests WHERE id = ?", [id])
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[DELETE /api/messages/[id]]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
