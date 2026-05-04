import { NextResponse } from "next/server"
import { query, execute } from "@/lib/mysql"
import type { Property } from "@/lib/types"

// GET /api/properties — Liste des biens avec filtres
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const ville = searchParams.get("ville")
    const departement = searchParams.get("departement")
    const prix_min = searchParams.get("prix_min")
    const prix_max = searchParams.get("prix_max")
    const chambres_min = searchParams.get("chambres_min")
    const keyword = searchParams.get("keyword")
    const en_promotion = searchParams.get("en_promotion")
    const statut = searchParams.get("statut")
    const limit = parseInt(searchParams.get("limit") || "100")
    const offset = parseInt(searchParams.get("offset") || "0")

    let sql = `
      SELECT 
        p.id, p.titre, p.description, p.type, p.prix,
        p.nombre_chambres, p.nombre_douches, p.surface,
        p.statut, p.code_unique, p.verifie, p.premium,
        p.en_promotion, p.reduction, p.equipements, p.vues,
        p.date_creation, p.quartier_id, p.proprietaire_id,
        q.nom AS quartier, v.nom AS ville, d.nom AS departement,
        COALESCE(AVG(r.note), 0) AS note_moyenne,
        COUNT(DISTINCT r.id) AS nombre_avis,
        GROUP_CONCAT(DISTINCT pi.image_url ORDER BY pi.ordre SEPARATOR '||') AS images_concat
      FROM properties p
      LEFT JOIN quartiers q ON p.quartier_id = q.id
      LEFT JOIN villes v ON q.ville_id = v.id
      LEFT JOIN departements d ON v.departement_id = d.id
      LEFT JOIN reviews r ON r.property_id = p.id AND r.approuve = TRUE
      LEFT JOIN property_images pi ON pi.property_id = p.id AND pi.type = 'photo'
      WHERE 1=1
    `
    const params: unknown[] = []

    if (type) { sql += " AND p.type = ?"; params.push(type) }
    if (statut) { sql += " AND p.statut = ?"; params.push(statut) }
    if (ville) { sql += " AND v.nom LIKE ?"; params.push(`%${ville}%`) }
    if (departement) { sql += " AND d.nom LIKE ?"; params.push(`%${departement}%`) }
    if (prix_min) { sql += " AND p.prix >= ?"; params.push(Number(prix_min)) }
    if (prix_max) { sql += " AND p.prix <= ?"; params.push(Number(prix_max)) }
    if (chambres_min) { sql += " AND p.nombre_chambres >= ?"; params.push(Number(chambres_min)) }
    if (en_promotion === "true") { sql += " AND p.en_promotion = TRUE" }
    if (keyword) {
      sql += " AND (p.titre LIKE ? OR p.description LIKE ? OR v.nom LIKE ?)"
      params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`)
    }

    sql += " GROUP BY p.id ORDER BY p.premium DESC, p.date_creation DESC LIMIT ? OFFSET ?"
    params.push(limit, offset)

    const rows = await query<Record<string, unknown>>(sql, params)

    const properties: Property[] = rows.map((row) => ({
      id: row.id as number,
      titre: row.titre as string,
      description: row.description as string,
      type: row.type as Property["type"],
      prix: Number(row.prix),
      nombre_chambres: row.nombre_chambres as number,
      nombre_douches: row.nombre_douches as number,
      surface: Number(row.surface),
      statut: row.statut as Property["statut"],
      code_unique: row.code_unique as string,
      verifie: Boolean(row.verifie),
      premium: Boolean(row.premium),
      en_promotion: Boolean(row.en_promotion),
      reduction: row.reduction as number,
      equipements: row.equipements
        ? (typeof row.equipements === "string" ? JSON.parse(row.equipements) : row.equipements) as string[]
        : [],
      vues: row.vues as number,
      date_creation: String(row.date_creation),
      ville_id: row.quartier_id as number,
      proprietaire_id: row.proprietaire_id as number,
      quartier: row.quartier as string,
      ville: row.ville as string,
      departement: row.departement as string,
      note_moyenne: Number(row.note_moyenne) || 0,
      nombre_avis: Number(row.nombre_avis) || 0,
      images: row.images_concat
        ? (row.images_concat as string).split("||").filter(Boolean)
        : [],
    }))

    return NextResponse.json({ properties, total: properties.length })
  } catch (err) {
    console.error("[GET /api/properties]", err)
    return NextResponse.json(
      { error: "Erreur serveur. Vérifiez que XAMPP/MySQL est démarré." },
      { status: 500 }
    )
  }
}

// POST /api/properties — Créer un bien
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      titre, description, type, prix, nombre_chambres, nombre_douches,
      surface, statut, quartier_id, proprietaire_id, verifie, premium,
      en_promotion, reduction, equipements, images,
    } = body

    if (!titre || !type || !prix) {
      return NextResponse.json(
        { error: "Titre, type et prix sont requis." },
        { status: 400 }
      )
    }

    // Générer code unique
    const prefix = type === "vente" ? "VNT" : type === "location" ? "LOC" : "BIE"
    const code_unique = `${prefix}-${Date.now().toString(36).toUpperCase()}`

    const result = await execute(
      `INSERT INTO properties 
        (titre, description, type, prix, nombre_chambres, nombre_douches, surface, statut, 
         quartier_id, proprietaire_id, code_unique, verifie, premium, en_promotion, reduction, equipements)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        titre, description || null, type, prix,
        nombre_chambres || 1, nombre_douches || 1, surface || null,
        statut || "disponible", quartier_id || null, proprietaire_id || null,
        code_unique, verifie ? 1 : 0, premium ? 1 : 0,
        en_promotion ? 1 : 0, reduction || 0,
        equipements ? JSON.stringify(equipements) : null,
      ]
    )

    const propertyId = result.insertId

    // Insérer les images
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await execute(
          "INSERT INTO property_images (property_id, image_url, type, ordre) VALUES (?, ?, 'photo', ?)",
          [propertyId, images[i], i]
        )
      }
    }

    return NextResponse.json({
      success: true,
      id: propertyId,
      code_unique,
      message: "Bien créé avec succès.",
    })
  } catch (err) {
    console.error("[POST /api/properties]", err)
    return NextResponse.json(
      { error: "Erreur serveur. Vérifiez que XAMPP/MySQL est démarré." },
      { status: 500 }
    )
  }
}
