import { NextResponse } from "next/server"
import { query, execute } from "@/lib/mysql"

// GET /api/localites — Toutes les localités (départements, villes, quartiers)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") // "departements" | "villes" | "quartiers" | "all"
    const departement_id = searchParams.get("departement_id")
    const ville_id = searchParams.get("ville_id")

    if (type === "departements" || !type) {
      const departements = await query("SELECT id, nom, code FROM departements ORDER BY nom")
      if (type === "departements") return NextResponse.json({ departements })

      const villes = await query("SELECT id, departement_id, nom FROM villes ORDER BY nom")
      const quartiers = await query("SELECT id, ville_id, nom FROM quartiers ORDER BY nom")
      return NextResponse.json({ departements, villes, quartiers })
    }

    if (type === "villes") {
      let sql = "SELECT v.id, v.nom, v.departement_id, d.nom AS departement FROM villes v JOIN departements d ON v.departement_id = d.id"
      const params: unknown[] = []
      if (departement_id) { sql += " WHERE v.departement_id = ?"; params.push(departement_id) }
      sql += " ORDER BY v.nom"
      const villes = await query(sql, params)
      return NextResponse.json({ villes })
    }

    if (type === "quartiers") {
      let sql = "SELECT q.id, q.nom, q.ville_id, v.nom AS ville FROM quartiers q JOIN villes v ON q.ville_id = v.id"
      const params: unknown[] = []
      if (ville_id) { sql += " WHERE q.ville_id = ?"; params.push(ville_id) }
      sql += " ORDER BY q.nom"
      const quartiers = await query(sql, params)
      return NextResponse.json({ quartiers })
    }

    return NextResponse.json({ error: "Type invalide." }, { status: 400 })
  } catch (err) {
    console.error("[GET /api/localites]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

// POST /api/localites — Ajouter un quartier
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, nom, departement_id, ville_id } = body

    if (type === "ville") {
      if (!nom || !departement_id) return NextResponse.json({ error: "Champs manquants." }, { status: 400 })
      const result = await execute("INSERT INTO villes (nom, departement_id) VALUES (?, ?)", [nom, departement_id])
      return NextResponse.json({ success: true, id: result.insertId })
    }

    if (type === "quartier") {
      if (!nom || !ville_id) return NextResponse.json({ error: "Champs manquants." }, { status: 400 })
      const result = await execute("INSERT INTO quartiers (nom, ville_id) VALUES (?, ?)", [nom, ville_id])
      return NextResponse.json({ success: true, id: result.insertId })
    }

    return NextResponse.json({ error: "Type invalide." }, { status: 400 })
  } catch (err) {
    console.error("[POST /api/localites]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
