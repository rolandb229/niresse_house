import { NextResponse } from "next/server"
import { query, execute } from "@/lib/mysql"
import type { Reservation } from "@/lib/types"

// GET /api/reservations
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const statut = searchParams.get("statut")
    const property_id = searchParams.get("property_id")

    let sql = `
      SELECT 
        r.id, r.property_id, r.nom_client, r.telephone, r.email,
        r.date_debut, r.date_fin, r.nombre_personnes, r.statut,
        r.montant_total, r.notes, r.date_creation,
        p.titre AS property_titre
      FROM reservations r
      LEFT JOIN properties p ON r.property_id = p.id
      WHERE 1=1
    `
    const params: unknown[] = []

    if (statut) { sql += " AND r.statut = ?"; params.push(statut) }
    if (property_id) { sql += " AND r.property_id = ?"; params.push(property_id) }

    sql += " ORDER BY r.date_creation DESC"

    const rows = await query<Reservation & { property_titre: string }>(sql, params)
    return NextResponse.json({ reservations: rows })
  } catch (err) {
    console.error("[GET /api/reservations]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

// POST /api/reservations — Nouvelle réservation
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      property_id, nom_client, telephone, email,
      date_debut, date_fin, nombre_personnes, montant_total, notes,
    } = body

    if (!property_id || !nom_client || !telephone || !date_debut || !date_fin) {
      return NextResponse.json({ error: "Champs obligatoires manquants." }, { status: 400 })
    }

    const result = await execute(
      `INSERT INTO reservations 
        (property_id, nom_client, telephone, email, date_debut, date_fin, nombre_personnes, montant_total, notes, statut)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'en_attente')`,
      [
        property_id, nom_client, telephone, email || null,
        date_debut, date_fin, nombre_personnes || 1,
        montant_total || null, notes || null,
      ]
    )

    return NextResponse.json({ success: true, id: result.insertId })
  } catch (err) {
    console.error("[POST /api/reservations]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
