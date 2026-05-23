import { PrismaClient, PropertyType } from "@prisma/client"
import bcrypt from "bcryptjs"
import { DEPARTEMENTS_BENIN } from "../lib/types"

const prisma = new PrismaClient()

const ADMIN_EMAIL = "niressedigital@gmail.com"
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!"

type SeedProperty = {
  codeUnique: string
  titre: string
  description: string
  type: PropertyType
  prix: number
  nombreChambres: number
  nombreDouches: number
  surface: number
  ville: string
  quartier: string
  images: string[]
  premium?: boolean
  enPromotion?: boolean
  reduction?: number
  verifie?: boolean
  equipements?: string[]
}

const PROPERTIES: SeedProperty[] = [
  {
    codeUnique: "NH-V001",
    titre: "Villa moderne avec piscine à Cocotomey",
    description: "Magnifique villa 4 chambres entièrement climatisée, piscine, jardin paysager et garage 2 voitures. Quartier sécurisé.",
    type: "vente",
    prix: 95000000,
    nombreChambres: 4,
    nombreDouches: 3,
    surface: 320,
    ville: "Abomey-Calavi",
    quartier: "Centre",
    images: ["/images/villa1.jpg", "/images/villa1_jardin.jpg", "/images/villa1_salon.jpg"],
    premium: true,
    verifie: true,
    equipements: ["Piscine", "Climatisation", "Garage", "Jardin", "Sécurité 24/7"],
  },
  {
    codeUnique: "NH-V002",
    titre: "Maison familiale à Cotonou Akpakpa",
    description: "Maison 3 chambres avec cour intérieure, parfaite pour une famille. Proche écoles et commerces.",
    type: "vente",
    prix: 42000000,
    nombreChambres: 3,
    nombreDouches: 2,
    surface: 180,
    ville: "Cotonou",
    quartier: "Centre",
    images: ["/images/maison1.jpg", "/images/maison2.jpg"],
    verifie: true,
    enPromotion: true,
    reduction: 8,
    equipements: ["Climatisation", "Cuisine équipée", "Cour intérieure"],
  },
  {
    codeUnique: "NH-V003",
    titre: "Duplex haut standing à Fidjrosse",
    description: "Duplex 5 chambres avec terrasse panoramique, finitions premium, à 10 min de la plage.",
    type: "vente",
    prix: 150000000,
    nombreChambres: 5,
    nombreDouches: 4,
    surface: 420,
    ville: "Cotonou",
    quartier: "Centre",
    images: ["/images/duplex1.jpg", "/images/villa1_salon.jpg"],
    premium: true,
    verifie: true,
    equipements: ["Terrasse", "Climatisation", "Garage", "Cuisine équipée", "Vue mer"],
  },
  {
    codeUnique: "NH-L001",
    titre: "Appartement 2 chambres à Cadjèhoun",
    description: "Bel appartement lumineux au 2ème étage, climatisé, proche aéroport. Eau et électricité incluses.",
    type: "location",
    prix: 175000,
    nombreChambres: 2,
    nombreDouches: 1,
    surface: 85,
    ville: "Cotonou",
    quartier: "Centre",
    images: ["/images/appart1.jpg", "/images/appartement1.jpg"],
    verifie: true,
    equipements: ["Climatisation", "Eau incluse", "Électricité incluse"],
  },
  {
    codeUnique: "NH-L002",
    titre: "Studio meublé à Calavi",
    description: "Studio idéal pour étudiant ou jeune actif. Internet WiFi inclus, sécurité.",
    type: "location",
    prix: 65000,
    nombreChambres: 1,
    nombreDouches: 1,
    surface: 30,
    ville: "Abomey-Calavi",
    quartier: "Centre",
    images: ["/images/studio1.jpg"],
    verifie: true,
    equipements: ["WiFi", "Sécurité", "Meublé"],
  },
  {
    codeUnique: "NH-L003",
    titre: "Maison 3 chambres à Parakou",
    description: "Maison spacieuse avec cour, idéale famille. Quartier calme, proche marché central.",
    type: "location",
    prix: 120000,
    nombreChambres: 3,
    nombreDouches: 2,
    surface: 140,
    ville: "Parakou",
    quartier: "Centre",
    images: ["/images/maison2.jpg"],
    verifie: true,
    enPromotion: true,
    reduction: 15,
  },
  {
    codeUnique: "NH-L004",
    titre: "Villa 4 chambres à Porto-Novo",
    description: "Villa avec jardin et garage, dans un quartier résidentiel calme de la capitale.",
    type: "location",
    prix: 280000,
    nombreChambres: 4,
    nombreDouches: 3,
    surface: 220,
    ville: "Porto-Novo",
    quartier: "Centre",
    images: ["/images/villa2.jpg", "/images/villa2_chambre.jpg", "/images/villa2_cuisine.jpg"],
    premium: true,
    verifie: true,
    equipements: ["Jardin", "Garage", "Climatisation"],
  },
  {
    codeUnique: "NH-H001",
    titre: "Hôtel Étoile - Chambre supérieure",
    description: "Chambre double avec petit-déjeuner inclus. Restaurant, piscine et navette aéroport disponibles.",
    type: "hotel",
    prix: 45000,
    nombreChambres: 1,
    nombreDouches: 1,
    surface: 28,
    ville: "Cotonou",
    quartier: "Centre",
    images: ["/images/hotel1.jpg"],
    premium: true,
    verifie: true,
    equipements: ["Petit-déjeuner", "Piscine", "Restaurant", "WiFi", "Climatisation"],
  },
  {
    codeUnique: "NH-H002",
    titre: "Hôtel Confort - Chambre standard",
    description: "Chambre tout confort en centre-ville, idéale pour séjour d'affaires.",
    type: "hotel",
    prix: 28000,
    nombreChambres: 1,
    nombreDouches: 1,
    surface: 20,
    ville: "Parakou",
    quartier: "Centre",
    images: ["/images/hotel1.jpg"],
    verifie: true,
    enPromotion: true,
    reduction: 20,
    equipements: ["WiFi", "Climatisation", "TV"],
  },
  {
    codeUnique: "NH-A001",
    titre: "Auberge du Lac - Chambre double",
    description: "Hébergement convivial face au lac Nokoué, ambiance familiale, parfait pour découvrir Ganvié.",
    type: "auberge",
    prix: 18000,
    nombreChambres: 1,
    nombreDouches: 1,
    surface: 18,
    ville: "Cotonou",
    quartier: "Centre",
    images: ["/images/auberge1.jpg"],
    verifie: true,
    equipements: ["Vue lac", "Petit-déjeuner", "Excursions"],
  },
  {
    codeUnique: "NH-A002",
    titre: "Auberge Ouidah - Chambre traditionnelle",
    description: "Auberge à proximité de la Route des Esclaves et de la Porte du Non-Retour.",
    type: "auberge",
    prix: 22000,
    nombreChambres: 1,
    nombreDouches: 1,
    surface: 22,
    ville: "Ouidah",
    quartier: "Centre",
    images: ["/images/auberge1.jpg"],
    verifie: true,
  },
  {
    codeUnique: "NH-C001",
    titre: "Court séjour - Appartement vue mer",
    description: "Appartement entièrement équipé pour 4 personnes, vue sur l'océan, accès direct plage.",
    type: "court_sejour",
    prix: 55000,
    nombreChambres: 2,
    nombreDouches: 1,
    surface: 70,
    ville: "Grand-Popo",
    quartier: "Centre",
    images: ["/images/appart1.jpg", "/images/villa1_jardin.jpg"],
    premium: true,
    verifie: true,
    enPromotion: true,
    reduction: 12,
    equipements: ["Vue mer", "Cuisine équipée", "Climatisation", "WiFi"],
  },
  {
    codeUnique: "NH-C002",
    titre: "Court séjour - Studio centre Cotonou",
    description: "Studio bien situé pour séjour court, près des restaurants et marchés.",
    type: "court_sejour",
    prix: 32000,
    nombreChambres: 1,
    nombreDouches: 1,
    surface: 35,
    ville: "Cotonou",
    quartier: "Centre",
    images: ["/images/studio1.jpg"],
    verifie: true,
    equipements: ["WiFi", "Climatisation", "Kitchenette"],
  },
  {
    codeUnique: "NH-M001",
    titre: "Appartement meublé F3 à Haie Vive",
    description: "F3 meublé haut de gamme, salon, 2 chambres, cuisine américaine. Pour séjour moyen terme.",
    type: "appartement_meuble",
    prix: 95000,
    nombreChambres: 2,
    nombreDouches: 2,
    surface: 95,
    ville: "Cotonou",
    quartier: "Centre",
    images: ["/images/appartement1.jpg"],
    premium: true,
    verifie: true,
    equipements: ["Meublé", "Cuisine équipée", "Climatisation", "WiFi", "Lave-linge"],
  },
  {
    codeUnique: "NH-CM001",
    titre: "Chambre meublée à Akpakpa",
    description: "Chambre privée meublée dans maison partagée, idéale étudiant ou professionnel en mission.",
    type: "chambre_meublee",
    prix: 40000,
    nombreChambres: 1,
    nombreDouches: 1,
    surface: 18,
    ville: "Cotonou",
    quartier: "Centre",
    images: ["/images/chambre1.jpg"],
    verifie: true,
    equipements: ["Meublé", "WiFi", "Climatisation"],
  },
]

const REVIEWS: { code: string; userName: string; note: number; commentaire: string }[] = [
  { code: "NH-V001", userName: "Marie A.", note: 5, commentaire: "Villa magnifique, exactement comme sur les photos. Quartier très calme." },
  { code: "NH-L001", userName: "Sédro K.", note: 5, commentaire: "Appartement nickel, propriétaire réactif. Recommandé." },
  { code: "NH-H001", userName: "Aïssatou S.", note: 5, commentaire: "Excellent séjour, personnel aux petits soins. Je reviendrai." },
  { code: "NH-H001", userName: "Bertrand N.", note: 4, commentaire: "Très bon hôtel, navette aéroport très pratique." },
  { code: "NH-C001", userName: "Rachida M.", note: 5, commentaire: "Vue mer imprenable, appartement très propre. Parfait pour des vacances." },
  { code: "NH-V003", userName: "Patrick O.", note: 5, commentaire: "Duplex de très haut standing. Visite organisée impeccablement." },
  { code: "NH-M001", userName: "Léa D.", note: 4, commentaire: "Appartement bien équipé, idéal pour mission moyenne durée." },
]

async function seedGeography() {
  for (const [depName, villes] of Object.entries(DEPARTEMENTS_BENIN)) {
    const departement = await prisma.departement.upsert({
      where: { nom: depName },
      update: {},
      create: { nom: depName },
    })

    for (const villeName of villes) {
      const ville = await prisma.ville.upsert({
        where: { nom_departementId: { nom: villeName, departementId: departement.id } },
        update: {},
        create: { nom: villeName, departementId: departement.id },
      })

      await prisma.quartier.upsert({
        where: { nom_villeId: { nom: "Centre", villeId: ville.id } },
        update: {},
        create: { nom: "Centre", villeId: ville.id },
      })
    }
  }
}

async function seedAdmin() {
  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10)
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      nom: "Administrateur NiresseHouse",
      email: ADMIN_EMAIL,
      telephone: "0166369842",
      motDePasse: hash,
      role: "super_admin",
    },
  })
}

async function seedProperties() {
  const admin = await prisma.user.findUniqueOrThrow({ where: { email: ADMIN_EMAIL } })

  for (const p of PROPERTIES) {
    const quartier = await prisma.quartier.findFirst({
      where: { nom: p.quartier, ville: { nom: p.ville } },
    })
    if (!quartier) {
      console.warn(`Quartier ${p.quartier} introuvable pour ${p.ville}, bien ${p.codeUnique} ignoré.`)
      continue
    }

    const property = await prisma.property.upsert({
      where: { codeUnique: p.codeUnique },
      update: {},
      create: {
        codeUnique: p.codeUnique,
        titre: p.titre,
        description: p.description,
        type: p.type,
        prix: p.prix,
        nombreChambres: p.nombreChambres,
        nombreDouches: p.nombreDouches,
        surface: p.surface,
        quartierId: quartier.id,
        proprietaireId: admin.id,
        premium: p.premium ?? false,
        enPromotion: p.enPromotion ?? false,
        reduction: p.reduction ?? null,
        verifie: p.verifie ?? false,
        equipements: p.equipements ? (p.equipements as unknown as object) : undefined,
        statut: "disponible",
      },
    })

    const existingImages = await prisma.propertyImage.count({ where: { propertyId: property.id } })
    if (existingImages === 0) {
      await prisma.propertyImage.createMany({
        data: p.images.map((url, idx) => ({
          propertyId: property.id,
          imageUrl: url,
          ordre: idx,
        })),
      })
    }

    if (p.enPromotion && p.reduction) {
      const existing = await prisma.promotion.findFirst({ where: { propertyId: property.id, active: true } })
      if (!existing) {
        const today = new Date()
        const inOneMonth = new Date()
        inOneMonth.setMonth(inOneMonth.getMonth() + 1)
        await prisma.promotion.create({
          data: {
            propertyId: property.id,
            reduction: p.reduction,
            dateDebut: today,
            dateFin: inOneMonth,
            active: true,
          },
        })
      }
    }
  }

  for (const r of REVIEWS) {
    const property = await prisma.property.findUnique({ where: { codeUnique: r.code } })
    if (!property) continue
    const existing = await prisma.review.findFirst({
      where: { propertyId: property.id, userName: r.userName },
    })
    if (existing) continue
    await prisma.review.create({
      data: {
        propertyId: property.id,
        userName: r.userName,
        note: r.note,
        commentaire: r.commentaire,
        approuve: true,
      },
    })
  }
}

async function main() {
  console.log("Seeding geography (departements > villes > quartiers)...")
  await seedGeography()

  console.log("Seeding super_admin account...")
  await seedAdmin()

  console.log("Seeding properties + images + promotions + reviews...")
  await seedProperties()

  const depts = await prisma.departement.count()
  const villes = await prisma.ville.count()
  const quartiers = await prisma.quartier.count()
  const users = await prisma.user.count()
  const properties = await prisma.property.count()
  const images = await prisma.propertyImage.count()
  const promotions = await prisma.promotion.count()
  const reviews = await prisma.review.count()

  console.log(`Done. ${depts} departements, ${villes} villes, ${quartiers} quartiers, ${users} users.`)
  console.log(`      ${properties} biens, ${images} images, ${promotions} promotions, ${reviews} avis.`)
  console.log(`Admin: ${ADMIN_EMAIL} (password from SEED_ADMIN_PASSWORD env var)`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
