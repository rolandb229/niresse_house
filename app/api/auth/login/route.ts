import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { query } from "@/lib/mysql"
import bcrypt from "bcryptjs"
import type { User } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis." },
        { status: 400 }
      )
    }

    // Chercher l'utilisateur dans MySQL
    // actif peut valoir NULL si non initialisé — on ne bloque que si actif = 0 explicitement
    let rows: (User & { mot_de_passe: string; actif: number | null })[] = []
    try {
      rows = await query<User & { mot_de_passe: string; actif: number | null }>(
        "SELECT id, nom, email, telephone, role, mot_de_passe, actif FROM users WHERE email = ? LIMIT 1",
        [email]
      )
    } catch {
      // Fallback : la colonne actif n'existe pas encore dans cette base
      rows = await query<User & { mot_de_passe: string; actif: number | null }>(
        "SELECT id, nom, email, telephone, role, mot_de_passe FROM users WHERE email = ? LIMIT 1",
        [email]
      )
    }

    if (!rows.length) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect." },
        { status: 401 }
      )
    }

    const user = rows[0]

    // Bloquer uniquement si actif vaut explicitement 0 (pas NULL, pas undefined)
    if (user.actif === 0) {
      return NextResponse.json(
        { error: "Compte désactivé. Contactez l'administrateur." },
        { status: 403 }
      )
    }

    // Vérifier le mot de passe avec bcrypt
    const valid = await bcrypt.compare(password, user.mot_de_passe)
    if (!valid) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect." },
        { status: 401 }
      )
    }

    // Créer session via cookie HTTP-only
    const sessionData = JSON.stringify({
      id: user.id,
      email: user.email,
      nom: user.nom,
      role: user.role,
    })

    const cookieStore = await cookies()
    cookieStore.set("session", Buffer.from(sessionData).toString("base64"), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 heures
      path: "/",
    })

    return NextResponse.json({
      success: true,
      user: { id: user.id, nom: user.nom, email: user.email, role: user.role },
    })
  } catch (err) {
    console.error("[login]", err)
    return NextResponse.json(
      { error: "Impossible de se connecter à la base de données. Vérifiez que XAMPP/MySQL est démarré." },
      { status: 500 }
    )
  }
}
