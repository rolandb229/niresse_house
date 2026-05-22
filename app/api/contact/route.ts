import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { property_id, nom, telephone, email, message } = await request.json()

    if (!nom || !telephone || !message) {
      return NextResponse.json(
        { error: "Nom, téléphone et message sont requis." },
        { status: 400 }
      )
    }

    if (telephone.length < 8) {
      return NextResponse.json(
        { error: "Numéro de téléphone invalide." },
        { status: 400 }
      )
    }

    await prisma.contactRequest.create({
      data: {
        propertyId: property_id ?? null,
        nom,
        telephone,
        email: email ?? null,
        message,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Votre demande a été enregistrée avec succès.",
    })
  } catch (err) {
    console.error("[contact]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
