import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const departement_id = searchParams.get("departement_id")
    const ville_id = searchParams.get("ville_id")

    if (!type || type === "all") {
      const [departements, villes, quartiers] = await Promise.all([
        prisma.departement.findMany({ orderBy: { nom: "asc" } }),
        prisma.ville.findMany({
          orderBy: { nom: "asc" },
          select: { id: true, nom: true, departementId: true },
        }),
        prisma.quartier.findMany({
          orderBy: { nom: "asc" },
          select: { id: true, nom: true, villeId: true },
        }),
      ])
      return NextResponse.json({
        departements,
        villes: villes.map((v) => ({ id: v.id, nom: v.nom, departement_id: v.departementId })),
        quartiers: quartiers.map((q) => ({ id: q.id, nom: q.nom, ville_id: q.villeId })),
      })
    }

    if (type === "departements") {
      const departements = await prisma.departement.findMany({ orderBy: { nom: "asc" } })
      return NextResponse.json({ departements })
    }

    if (type === "villes") {
      const villes = await prisma.ville.findMany({
        where: departement_id ? { departementId: Number(departement_id) } : undefined,
        include: { departement: true },
        orderBy: { nom: "asc" },
      })
      return NextResponse.json({
        villes: villes.map((v) => ({
          id: v.id,
          nom: v.nom,
          departement_id: v.departementId,
          departement: v.departement.nom,
        })),
      })
    }

    if (type === "quartiers") {
      const quartiers = await prisma.quartier.findMany({
        where: ville_id ? { villeId: Number(ville_id) } : undefined,
        include: { ville: true },
        orderBy: { nom: "asc" },
      })
      return NextResponse.json({
        quartiers: quartiers.map((q) => ({
          id: q.id,
          nom: q.nom,
          ville_id: q.villeId,
          ville: q.ville.nom,
        })),
      })
    }

    return NextResponse.json({ error: "Type invalide." }, { status: 400 })
  } catch (err) {
    console.error("[GET /api/localites]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { type, nom, departement_id, ville_id } = await request.json()

    if (type === "ville") {
      if (!nom || !departement_id) {
        return NextResponse.json({ error: "Champs manquants." }, { status: 400 })
      }
      const created = await prisma.ville.create({
        data: { nom, departementId: Number(departement_id) },
      })
      return NextResponse.json({ success: true, id: created.id })
    }

    if (type === "quartier") {
      if (!nom || !ville_id) {
        return NextResponse.json({ error: "Champs manquants." }, { status: 400 })
      }
      const created = await prisma.quartier.create({
        data: { nom, villeId: Number(ville_id) },
      })
      return NextResponse.json({ success: true, id: created.id })
    }

    return NextResponse.json({ error: "Type invalide." }, { status: 400 })
  } catch (err) {
    console.error("[POST /api/localites]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
