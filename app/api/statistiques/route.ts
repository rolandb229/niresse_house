import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const [
      totalBiens,
      totalMessages,
      totalReservations,
      totalUsers,
      totalAvis,
      nouveauxMessages,
      reservationsEnAttente,
      biensDisponibles,
      promotionsActives,
      parType,
      parStatut,
      topVillesRaw,
      biensRecents,
      vuesAgg,
    ] = await Promise.all([
      prisma.property.count(),
      prisma.contactRequest.count(),
      prisma.reservation.count(),
      prisma.user.count(),
      prisma.review.count({ where: { approuve: true } }),
      prisma.contactRequest.count({ where: { statut: "nouveau" } }),
      prisma.reservation.count({ where: { statut: "en_attente" } }),
      prisma.property.count({ where: { statut: "disponible" } }),
      prisma.promotion.count({ where: { active: true } }),
      prisma.property.groupBy({ by: ["type"], _count: { _all: true } }),
      prisma.property.groupBy({ by: ["statut"], _count: { _all: true } }),
      prisma.property.findMany({
        select: { quartier: { include: { ville: true } } },
      }),
      prisma.property.findMany({
        orderBy: { dateCreation: "desc" },
        take: 5,
        select: { id: true, titre: true, type: true, statut: true, dateCreation: true },
      }),
      prisma.property.aggregate({ _sum: { vues: true } }),
    ])

    // Calcul des top villes en JS (groupBy sur relation non supporté directement)
    const villeCounts = new Map<string, number>()
    for (const row of topVillesRaw) {
      const villeNom = row.quartier?.ville?.nom
      if (villeNom) villeCounts.set(villeNom, (villeCounts.get(villeNom) ?? 0) + 1)
    }
    const topVilles = Array.from(villeCounts.entries())
      .map(([ville, count]) => ({ ville, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return NextResponse.json({
      totaux: {
        biens: totalBiens,
        messages: totalMessages,
        reservations: totalReservations,
        users: totalUsers,
        avis: totalAvis,
        vues: vuesAgg._sum.vues ?? 0,
        promotions: promotionsActives,
      },
      alertes: {
        nouveauxMessages,
        reservationsEnAttente,
        biensDisponibles,
      },
      parType: parType.map((p) => ({ type: p.type, count: p._count._all })),
      parStatut: parStatut.map((p) => ({ statut: p.statut, count: p._count._all })),
      topVilles,
      biensRecents: biensRecents.map((b) => ({
        id: b.id,
        titre: b.titre,
        type: b.type,
        statut: b.statut,
        date_creation: b.dateCreation.toISOString(),
      })),
    })
  } catch (err) {
    console.error("[GET /api/statistiques]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
