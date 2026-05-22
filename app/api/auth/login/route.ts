import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis." },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect." },
        { status: 401 }
      )
    }

    if (!user.actif) {
      return NextResponse.json(
        { error: "Compte désactivé. Contactez l'administrateur." },
        { status: 403 }
      )
    }

    const valid = await bcrypt.compare(password, user.motDePasse)
    if (!valid) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect." },
        { status: 401 }
      )
    }

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
      maxAge: 60 * 60 * 24,
      path: "/",
    })

    return NextResponse.json({
      success: true,
      user: { id: user.id, nom: user.nom, email: user.email, role: user.role },
    })
  } catch (err) {
    console.error("[login]", err)
    return NextResponse.json(
      { error: "Erreur serveur lors de la connexion." },
      { status: 500 }
    )
  }
}
