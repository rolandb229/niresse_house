import { NextResponse } from "next/server"
import { execute } from "@/lib/mysql"
import bcrypt from "bcryptjs"

// PUT /api/utilisateurs/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { nom, email, telephone, role, mot_de_passe, actif } = body

    if (mot_de_passe) {
      const hashed = await bcrypt.hash(mot_de_passe, 10)
      await execute(
        "UPDATE users SET nom = ?, email = ?, telephone = ?, role = ?, mot_de_passe = ?, actif = ? WHERE id = ?",
        [nom, email, telephone, role, hashed, actif !== undefined ? (actif ? 1 : 0) : 1, id]
      )
    } else {
      await execute(
        "UPDATE users SET nom = ?, email = ?, telephone = ?, role = ?, actif = ? WHERE id = ?",
        [nom, email, telephone, role, actif !== undefined ? (actif ? 1 : 0) : 1, id]
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[PUT /api/utilisateurs/[id]]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

// DELETE /api/utilisateurs/[id]
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await execute("DELETE FROM users WHERE id = ?", [id])
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[DELETE /api/utilisateurs/[id]]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
