import { NextResponse } from "next/server"
import { query, execute } from "@/lib/mysql"
import bcrypt from "bcryptjs"
import type { User } from "@/lib/types"

// GET /api/utilisateurs
export async function GET() {
  try {
    const rows = await query<Omit<User, "mot_de_passe">>(
      "SELECT id, nom, email, telephone, role, date_creation FROM users ORDER BY date_creation DESC"
    )
    return NextResponse.json({ utilisateurs: rows })
  } catch (err) {
    console.error("[GET /api/utilisateurs]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

// POST /api/utilisateurs — Créer un utilisateur
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nom, email, telephone, role, mot_de_passe } = body

    if (!nom || !email || !telephone || !mot_de_passe) {
      return NextResponse.json({ error: "Champs obligatoires manquants." }, { status: 400 })
    }

    // Vérifier si email déjà utilisé
    const existing = await query("SELECT id FROM users WHERE email = ?", [email])
    if (existing.length > 0) {
      return NextResponse.json({ error: "Cet email est déjà utilisé." }, { status: 409 })
    }

    const hashed = await bcrypt.hash(mot_de_passe, 10)

    const result = await execute(
      "INSERT INTO users (nom, email, telephone, role, mot_de_passe) VALUES (?, ?, ?, ?, ?)",
      [nom, email, telephone, role || "client", hashed]
    )

    return NextResponse.json({ success: true, id: result.insertId })
  } catch (err) {
    console.error("[POST /api/utilisateurs]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
