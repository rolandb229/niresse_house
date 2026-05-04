import { NextResponse } from "next/server"
import { query, execute } from "@/lib/mysql"
import type { Promotion } from "@/lib/types"

// GET /api/promotions
export async function GET() {
  try {
    const rows = await query<Promotion & { property_titre: string; property_ville: string }>(
      `SELECT pr.*, p.titre AS property_titre, v.nom AS property_ville
       FROM promotions pr
       JOIN properties p ON pr.property_id = p.id
       LEFT JOIN quartiers q ON p.quartier_id = q.id
       LEFT JOIN villes v ON q.ville_id = v.id
       ORDER BY pr.date_creation DESC`
    )
    return NextResponse.json({ promotions: rows })
  } catch (err) {
    console.error("[GET /api/promotions]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

// POST /api/promotions — Créer une promotion
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { property_id, reduction, date_debut, date_fin } = body

    if (!property_id || !reduction || !date_debut || !date_fin) {
      return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 })
    }

    if (reduction < 1 || reduction > 50) {
      return NextResponse.json({ error: "La réduction doit être entre 1% et 50%." }, { status: 400 })
    }

    const result = await execute(
      "INSERT INTO promotions (property_id, reduction, date_debut, date_fin, active) VALUES (?, ?, ?, ?, TRUE)",
      [property_id, reduction, date_debut, date_fin]
    )

    // Marquer le bien comme en promotion
    await execute(
      "UPDATE properties SET en_promotion = TRUE, reduction = ? WHERE id = ?",
      [reduction, property_id]
    )

    return NextResponse.json({ success: true, id: result.insertId })
  } catch (err) {
    console.error("[POST /api/promotions]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
