import { NextResponse } from "next/server"
import { execute } from "@/lib/mysql"

// PUT /api/reservations/[id] — Changer le statut
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { statut } = await request.json()

    if (!["en_attente", "confirmee", "annulee", "terminee"].includes(statut)) {
      return NextResponse.json({ error: "Statut invalide." }, { status: 400 })
    }

    await execute("UPDATE reservations SET statut = ? WHERE id = ?", [statut, id])
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[PUT /api/reservations/[id]]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

// DELETE /api/reservations/[id]
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await execute("DELETE FROM reservations WHERE id = ?", [id])
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[DELETE /api/reservations/[id]]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
