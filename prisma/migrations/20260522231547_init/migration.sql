-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('super_admin', 'admin', 'commercial', 'client');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('location', 'vente', 'court_sejour', 'auberge', 'hotel', 'chambre_meublee', 'appartement_meuble');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('disponible', 'loue', 'vendu', 'suspendu', 'reserve');

-- CreateEnum
CREATE TYPE "ImageType" AS ENUM ('photo', 'video');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('en_attente', 'confirmee', 'annulee', 'terminee');

-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('nouveau', 'en_traitement', 'cloture');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT,
    "mot_de_passe" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'client',
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departements" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "departements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "villes" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "departement_id" INTEGER NOT NULL,

    CONSTRAINT "villes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quartiers" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "ville_id" INTEGER NOT NULL,

    CONSTRAINT "quartiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "type" "PropertyType" NOT NULL,
    "prix" DECIMAL(12,2) NOT NULL,
    "nombre_chambres" INTEGER NOT NULL DEFAULT 0,
    "nombre_douches" INTEGER NOT NULL DEFAULT 0,
    "surface" DECIMAL(10,2),
    "statut" "PropertyStatus" NOT NULL DEFAULT 'disponible',
    "code_unique" TEXT NOT NULL,
    "verifie" BOOLEAN NOT NULL DEFAULT false,
    "premium" BOOLEAN NOT NULL DEFAULT false,
    "en_promotion" BOOLEAN NOT NULL DEFAULT false,
    "reduction" INTEGER,
    "equipements" JSONB,
    "vues" INTEGER NOT NULL DEFAULT 0,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quartier_id" INTEGER NOT NULL,
    "proprietaire_id" INTEGER NOT NULL,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_images" (
    "id" SERIAL NOT NULL,
    "property_id" INTEGER NOT NULL,
    "image_url" TEXT NOT NULL,
    "type" "ImageType" NOT NULL DEFAULT 'photo',
    "ordre" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "property_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservations" (
    "id" SERIAL NOT NULL,
    "property_id" INTEGER NOT NULL,
    "user_id" INTEGER,
    "nom_client" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "email" TEXT,
    "date_debut" DATE NOT NULL,
    "date_fin" DATE NOT NULL,
    "nombre_personnes" INTEGER NOT NULL DEFAULT 1,
    "statut" "ReservationStatus" NOT NULL DEFAULT 'en_attente',
    "montant_total" DECIMAL(12,2) NOT NULL,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_requests" (
    "id" SERIAL NOT NULL,
    "property_id" INTEGER,
    "nom" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "email" TEXT,
    "message" TEXT NOT NULL,
    "statut" "ContactStatus" NOT NULL DEFAULT 'nouveau',
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "property_id" INTEGER NOT NULL,
    "user_name" TEXT NOT NULL,
    "user_email" TEXT,
    "note" INTEGER NOT NULL,
    "commentaire" TEXT NOT NULL,
    "approuve" BOOLEAN NOT NULL DEFAULT false,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotions" (
    "id" SERIAL NOT NULL,
    "property_id" INTEGER NOT NULL,
    "reduction" INTEGER NOT NULL,
    "date_debut" DATE NOT NULL,
    "date_fin" DATE NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "promotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitor_stats" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "page" TEXT NOT NULL,
    "visiteurs" INTEGER NOT NULL DEFAULT 0,
    "vues" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "visitor_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "departements_nom_key" ON "departements"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "villes_nom_departement_id_key" ON "villes"("nom", "departement_id");

-- CreateIndex
CREATE UNIQUE INDEX "quartiers_nom_ville_id_key" ON "quartiers"("nom", "ville_id");

-- CreateIndex
CREATE UNIQUE INDEX "properties_code_unique_key" ON "properties"("code_unique");

-- CreateIndex
CREATE INDEX "properties_type_idx" ON "properties"("type");

-- CreateIndex
CREATE INDEX "properties_statut_idx" ON "properties"("statut");

-- CreateIndex
CREATE INDEX "properties_quartier_id_idx" ON "properties"("quartier_id");

-- CreateIndex
CREATE INDEX "properties_premium_idx" ON "properties"("premium");

-- CreateIndex
CREATE INDEX "properties_en_promotion_idx" ON "properties"("en_promotion");

-- CreateIndex
CREATE INDEX "property_images_property_id_idx" ON "property_images"("property_id");

-- CreateIndex
CREATE INDEX "reservations_property_id_idx" ON "reservations"("property_id");

-- CreateIndex
CREATE INDEX "reservations_statut_idx" ON "reservations"("statut");

-- CreateIndex
CREATE INDEX "contact_requests_statut_idx" ON "contact_requests"("statut");

-- CreateIndex
CREATE INDEX "reviews_property_id_idx" ON "reviews"("property_id");

-- CreateIndex
CREATE INDEX "reviews_approuve_idx" ON "reviews"("approuve");

-- CreateIndex
CREATE INDEX "promotions_property_id_idx" ON "promotions"("property_id");

-- CreateIndex
CREATE INDEX "promotions_active_idx" ON "promotions"("active");

-- CreateIndex
CREATE UNIQUE INDEX "visitor_stats_date_page_key" ON "visitor_stats"("date", "page");

-- AddForeignKey
ALTER TABLE "villes" ADD CONSTRAINT "villes_departement_id_fkey" FOREIGN KEY ("departement_id") REFERENCES "departements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quartiers" ADD CONSTRAINT "quartiers_ville_id_fkey" FOREIGN KEY ("ville_id") REFERENCES "villes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_quartier_id_fkey" FOREIGN KEY ("quartier_id") REFERENCES "quartiers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_proprietaire_id_fkey" FOREIGN KEY ("proprietaire_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_images" ADD CONSTRAINT "property_images_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_requests" ADD CONSTRAINT "contact_requests_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotions" ADD CONSTRAINT "promotions_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
