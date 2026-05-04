import { NextResponse } from "next/server"
import { execute } from "@/lib/mysql"

// PUT /api/avis/[id] — Approuver/Refuser un avis
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { approuve } = await request.json()

    await execute("UPDATE reviews SET approuve = ? WHERE id = ?", [approuve ? 1 : 0, id])
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[PUT /api/avis/[id]]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

// DELETE /api/avis/[id]
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await execute("DELETE FROM reviews WHERE id = ?", [id])
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[DELETE /api/avis/[id]]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
