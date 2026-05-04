import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")

  if (!session?.value) {
    return NextResponse.json({ user: null })
  }

  try {
    // Essayer de parser en JSON direct d'abord
    let sessionData
    try {
      sessionData = JSON.parse(session.value)
    } catch {
      // Sinon, essayer de décoder en base64
      const decoded = Buffer.from(session.value, "base64").toString("utf-8")
      sessionData = JSON.parse(decoded)
    }
    
    // Retourner l'utilisateur du sessionData
    const user = sessionData.user || sessionData
    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ user: null })
  }
}
