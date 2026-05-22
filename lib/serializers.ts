import type { Prisma } from "@prisma/client"

type PropertyWithRelations = Prisma.PropertyGetPayload<{
  include: {
    quartier: { include: { ville: { include: { departement: true } } } }
    reviews: true
    images: true
  }
}>

export function serializeProperty(p: PropertyWithRelations) {
  const approuves = p.reviews.filter((r) => r.approuve)
  const note_moyenne = approuves.length
    ? approuves.reduce((sum, r) => sum + r.note, 0) / approuves.length
    : 0

  return {
    id: p.id,
    titre: p.titre,
    description: p.description,
    type: p.type,
    prix: Number(p.prix),
    nombre_chambres: p.nombreChambres,
    nombre_douches: p.nombreDouches,
    surface: p.surface ? Number(p.surface) : 0,
    statut: p.statut,
    code_unique: p.codeUnique,
    verifie: p.verifie,
    premium: p.premium,
    en_promotion: p.enPromotion,
    reduction: p.reduction ?? 0,
    equipements: p.equipements ?? [],
    vues: p.vues,
    date_creation: p.dateCreation.toISOString(),
    quartier_id: p.quartierId,
    ville_id: p.quartierId,
    proprietaire_id: p.proprietaireId,
    quartier: p.quartier?.nom ?? null,
    ville: p.quartier?.ville?.nom ?? null,
    departement: p.quartier?.ville?.departement?.nom ?? null,
    note_moyenne,
    nombre_avis: approuves.length,
    images: p.images
      .filter((img) => img.type === "photo")
      .sort((a, b) => a.ordre - b.ordre)
      .map((img) => img.imageUrl),
  }
}

export const propertyIncludeAll = {
  quartier: { include: { ville: { include: { departement: true } } } },
  reviews: true,
  images: true,
} as const
