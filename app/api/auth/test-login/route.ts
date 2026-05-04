import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const cookieStore = await cookies()
    
    const sessionData = JSON.stringify({
      user: {
        id: 1,
        nom: "Admin Test",
        email: "admin@niressehouse.com",
        role: "administrateur"
      },
      isLoggedIn: true
    })
    
    cookieStore.set("session", sessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7 // 7 jours
    })
    
    return NextResponse.json({
      success: true,
      message: "Session test créée, redirection vers /admin..."
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la création de la session test" },
      { status: 500 }
    )
  }
}
