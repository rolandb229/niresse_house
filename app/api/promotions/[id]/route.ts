import { NextResponse } from "next/server"
import { query, execute } from "@/lib/mysql"

// DELETE /api/promotions/[id]
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Récupérer le property_id avant suppression
    const rows = await query<{ property_id: number }>(
      "SELECT property_id FROM promotions WHERE id = ?",
      [id]
    )

    if (rows.length) {
      const propertyId = rows[0].property_id
      await execute("DELETE FROM promotions WHERE id = ?", [id])
      // Retirer la promotion du bien
      await execute(
        "UPDATE properties SET en_promotion = FALSE, reduction = 0 WHERE id = ?",
        [propertyId]
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[DELETE /api/promotions/[id]]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

// PUT /api/promotions/[id] — Activer/désactiver
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { active } = await request.json()

    await execute("UPDATE promotions SET active = ? WHERE id = ?", [active ? 1 : 0, id])
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[PUT /api/promotions/[id]]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
