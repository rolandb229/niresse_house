import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { DEPARTEMENTS_BENIN } from "../lib/types"

const prisma = new PrismaClient()

const ADMIN_EMAIL = "niressedigital@gmail.com"
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!"

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

async function main() {
  console.log("Seeding geography (departements > villes > quartiers)...")
  await seedGeography()

  console.log("Seeding super_admin account...")
  await seedAdmin()

  const depts = await prisma.departement.count()
  const villes = await prisma.ville.count()
  const quartiers = await prisma.quartier.count()
  const users = await prisma.user.count()

  console.log(`Done. ${depts} departements, ${villes} villes, ${quartiers} quartiers, ${users} users.`)
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
