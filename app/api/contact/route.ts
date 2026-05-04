import { NextResponse } from "next/server"
import { execute } from "@/lib/mysql"

// POST /api/contact — Enregistrer une demande de contact dans MySQL
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { property_id, nom, telephone, email, message } = body

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

    await execute(
      "INSERT INTO contact_requests (property_id, nom, telephone, email, message, statut) VALUES (?, ?, ?, ?, ?, 'nouveau')",
      [property_id, nom, telephone, email || null, message]
    )

    return NextResponse.json({
      success: true,
      message: "Votre demande a été enregistrée avec succès.",
    })
  } catch (err) {
    console.error("[contact]", err)
    return NextResponse.json(
      { error: "Erreur serveur. Vérifiez que XAMPP/MySQL est démarré." },
      { status: 500 }
    )
  }
}
