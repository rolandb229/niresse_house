import { NextResponse } from "next/server"
import { query } from "@/lib/mysql"

// GET /api/statistiques — Dashboard stats
export async function GET() {
  try {
    // Comptes généraux
    const [totalBiens] = await query<{ count: number }>("SELECT COUNT(*) AS count FROM properties")
    const [totalMessages] = await query<{ count: number }>("SELECT COUNT(*) AS count FROM contact_requests")
    const [totalReservations] = await query<{ count: number }>("SELECT COUNT(*) AS count FROM reservations")
    const [totalUsers] = await query<{ count: number }>("SELECT COUNT(*) AS count FROM users")
    const [totalAvis] = await query<{ count: number }>("SELECT COUNT(*) AS count FROM reviews WHERE approuve = TRUE")
    const [nouveauxMessages] = await query<{ count: number }>("SELECT COUNT(*) AS count FROM contact_requests WHERE statut = 'nouveau'")
    const [reservationsEnAttente] = await query<{ count: number }>("SELECT COUNT(*) AS count FROM reservations WHERE statut = 'en_attente'")
    const [biensDisponibles] = await query<{ count: number }>("SELECT COUNT(*) AS count FROM properties WHERE statut = 'disponible'")
    const [promotions] = await query<{ count: number }>("SELECT COUNT(*) AS count FROM promotions WHERE active = TRUE")

    // Répartition par type
    const parType = await query<{ type: string; count: number }>(
      "SELECT type, COUNT(*) AS count FROM properties GROUP BY type"
    )

    // Répartition par statut
    const parStatut = await query<{ statut: string; count: number }>(
      "SELECT statut, COUNT(*) AS count FROM properties GROUP BY statut"
    )

    // Top villes
    const topVilles = await query<{ ville: string; count: number }>(
      `SELECT v.nom AS ville, COUNT(p.id) AS count
       FROM properties p
       JOIN quartiers q ON p.quartier_id = q.id
       JOIN villes v ON q.ville_id = v.id
       GROUP BY v.nom ORDER BY count DESC LIMIT 5`
    )

    // Biens récents
    const biensRecents = await query<{ id: number; titre: string; type: string; statut: string; date_creation: string }>(
      "SELECT id, titre, type, statut, date_creation FROM properties ORDER BY date_creation DESC LIMIT 5"
    )

    // Vues totales
    const [totalVues] = await query<{ total: number }>("SELECT SUM(vues) AS total FROM properties")

    return NextResponse.json({
      totaux: {
        biens: totalBiens.count,
        messages: totalMessages.count,
        reservations: totalReservations.count,
        users: totalUsers.count,
        avis: totalAvis.count,
        vues: totalVues.total || 0,
        promotions: promotions.count,
      },
      alertes: {
        nouveauxMessages: nouveauxMessages.count,
        reservationsEnAttente: reservationsEnAttente.count,
        biensDisponibles: biensDisponibles.count,
      },
      parType,
      parStatut,
      topVilles,
      biensRecents,
    })
  } catch (err) {
    console.error("[GET /api/statistiques]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
