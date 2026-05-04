import { NextResponse } from "next/server"
import { query } from "@/lib/mysql"
import type { ContactRequest } from "@/lib/types"

// GET /api/messages — Liste des messages de contact
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const statut = searchParams.get("statut")
    const property_id = searchParams.get("property_id")

    let sql = `
      SELECT 
        cr.id, cr.property_id, cr.nom, cr.telephone, cr.email,
        cr.message, cr.statut, cr.date_creation,
        p.titre AS property_titre
      FROM contact_requests cr
      LEFT JOIN properties p ON cr.property_id = p.id
      WHERE 1=1
    `
    const params: unknown[] = []

    if (statut) { sql += " AND cr.statut = ?"; params.push(statut) }
    if (property_id) { sql += " AND cr.property_id = ?"; params.push(property_id) }

    sql += " ORDER BY cr.date_creation DESC"

    const rows = await query<ContactRequest & { property_titre: string }>(sql, params)
    return NextResponse.json({ messages: rows })
  } catch (err) {
    console.error("[GET /api/messages]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
