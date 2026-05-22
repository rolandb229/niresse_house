import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import type { Prisma } from "@prisma/client"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { nom, email, telephone, role, mot_de_passe, actif } = await request.json()

    const data: Prisma.UserUpdateInput = {
      nom,
      email,
      telephone,
      role,
      actif: actif !== undefined ? !!actif : true,
    }

    if (mot_de_passe) {
      data.motDePasse = await bcrypt.hash(mot_de_passe, 10)
    }

    await prisma.user.update({ where: { id: Number(id) }, data })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[PUT /api/utilisateurs/[id]]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.user.delete({ where: { id: Number(id) } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[DELETE /api/utilisateurs/[id]]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
