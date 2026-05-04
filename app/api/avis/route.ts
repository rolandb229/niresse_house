import { NextResponse } from "next/server"
import { query, execute } from "@/lib/mysql"
import type { Review } from "@/lib/types"

// GET /api/avis
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const property_id = searchParams.get("property_id")
    const approuve = searchParams.get("approuve")

    let sql = `
      SELECT r.*, p.titre AS property_titre
      FROM reviews r
      LEFT JOIN properties p ON r.property_id = p.id
      WHERE 1=1
    `
    const params: unknown[] = []

    if (property_id) { sql += " AND r.property_id = ?"; params.push(property_id) }
    if (approuve === "true") { sql += " AND r.approuve = TRUE" }
    if (approuve === "false") { sql += " AND r.approuve = FALSE" }

    sql += " ORDER BY r.date_creation DESC"

    const rows = await query<Review & { property_titre: string }>(sql, params)
    return NextResponse.json({ avis: rows })
  } catch (err) {
    console.error("[GET /api/avis]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

// POST /api/avis — Laisser un avis
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { property_id, user_name, user_email, note, commentaire } = body

    if (!property_id || !user_name || !note || !commentaire) {
      return NextResponse.json({ error: "Champs obligatoires manquants." }, { status: 400 })
    }

    if (note < 1 || note > 5) {
      return NextResponse.json({ error: "La note doit être entre 1 et 5." }, { status: 400 })
    }

    const result = await execute(
      "INSERT INTO reviews (property_id, user_name, user_email, note, commentaire, approuve) VALUES (?, ?, ?, ?, ?, FALSE)",
      [property_id, user_name, user_email || null, note, commentaire]
    )

    return NextResponse.json({ success: true, id: result.insertId })
  } catch (err) {
    console.error("[POST /api/avis]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
