import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { nom, email, telephone, password } = await request.json()

    if (!nom || !email || !telephone || !password) {
      return NextResponse.json(
        { error: "Nom, email, téléphone et mot de passe sont requis." },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit faire au moins 8 caractères." },
        { status: 400 }
      )
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé." },
        { status: 409 }
      )
    }

    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        nom,
        email,
        telephone,
        motDePasse: hashed,
        role: "client",
      },
    })

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
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return NextResponse.json({
      success: true,
      user: { id: user.id, nom: user.nom, email: user.email, role: user.role },
    })
  } catch (err) {
    console.error("[signup]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
