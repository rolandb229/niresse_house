import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    const rows = await prisma.user.findMany({
      orderBy: { dateCreation: "desc" },
      select: {
        id: true,
        nom: true,
        email: true,
        telephone: true,
        role: true,
        actif: true,
        dateCreation: true,
      },
    })

    const utilisateurs = rows.map((u) => ({
      id: u.id,
      nom: u.nom,
      email: u.email,
      telephone: u.telephone,
      role: u.role,
      actif: u.actif,
      date_creation: u.dateCreation.toISOString(),
    }))

    return NextResponse.json({ utilisateurs })
  } catch (err) {
    console.error("[GET /api/utilisateurs]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { nom, email, telephone, role, mot_de_passe } = await request.json()

    if (!nom || !email || !telephone || !mot_de_passe) {
      return NextResponse.json({ error: "Champs obligatoires manquants." }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "Cet email est déjà utilisé." }, { status: 409 })
    }

    const hashed = await bcrypt.hash(mot_de_passe, 10)
    const created = await prisma.user.create({
      data: {
        nom,
        email,
        telephone,
        role: role ?? "client",
        motDePasse: hashed,
      },
    })

    return NextResponse.json({ success: true, id: created.id })
  } catch (err) {
    console.error("[POST /api/utilisateurs]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
