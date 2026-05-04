// Types principaux de la plateforme NiresseHouse

export interface User {
  id: number
  nom: string
  email: string
  telephone: string
  role: "super_admin" | "admin" | "commercial" | "client"
  mot_de_passe?: string
  date_creation: string
}

export type PropertyType = 
  | "location" 
  | "vente" 
  | "court_sejour" 
  | "auberge" 
  | "hotel" 
  | "chambre_meublee" 
  | "appartement_meuble"

export interface Property {
  id: number
  titre: string
  description: string
  type: PropertyType
  prix: number
  nombre_chambres: number
  nombre_douches: number
  surface: number
  statut: "disponible" | "loue" | "vendu" | "suspendu" | "reserve"
  ville_id: number
  proprietaire_id: number
  date_creation: string
  code_unique: string
  ville?: string
  quartier?: string
  departement?: string
  images: string[]
  verifie: boolean
  premium: boolean
  en_promotion: boolean
  reduction?: number
  equipements?: string[]
  note_moyenne?: number
  nombre_avis?: number
  vues?: number
}

export interface PropertyImage {
  id: number
  property_id: number
  image_url: string
  type: "photo" | "video"
}

export interface Location {
  id: number
  departement: string
  ville: string
  quartier: string
}

export interface ContactRequest {
  id: number
  property_id: number | null
  nom: string
  telephone: string
  email?: string
  message: string
  statut: "nouveau" | "en_traitement" | "cloture"
  date_creation?: string
}

export interface Review {
  id: number
  property_id: number
  user_name: string
  user_email?: string
  note: number
  commentaire: string
  date_creation: string
  approuve: boolean
}

export interface Reservation {
  id: number
  property_id: number
  nom_client: string
  telephone: string
  email?: string
  date_debut: string
  date_fin: string
  nombre_personnes: number
  statut: "en_attente" | "confirmee" | "annulee" | "terminee"
  montant_total: number
  date_creation: string
}

export interface VisitorStats {
  id: number
  date: string
  page: string
  visiteurs: number
  vues: number
}

export interface Promotion {
  id: number
  property_id: number
  reduction: number
  date_debut: string
  date_fin: string
  active: boolean
  date_creation?: string
  property_titre?: string
  property_ville?: string
}

export interface SearchFilters {
  type?: string
  ville?: string
  departement?: string
  prix_min?: number
  prix_max?: number
  chambres_min?: number
  surface_min?: number
  keyword?: string
  en_promotion?: boolean
}

// Les 12 departements du Benin avec leurs principales villes
export const DEPARTEMENTS_BENIN = {
  "Alibori": ["Kandi", "Malanville", "Banikoara", "Karimama", "Gogounou", "Segbana"],
  "Atacora": ["Natitingou", "Tanguieta", "Boukoumbe", "Cobly", "Kouande", "Kerou", "Pehunco", "Toukountouna", "Matéri"],
  "Atlantique": ["Abomey-Calavi", "Allada", "Ouidah", "Tori-Bossito", "Kpomasse", "So-Ava", "Ze", "Toffo"],
  "Borgou": ["Parakou", "Tchaourou", "N'Dali", "Nikki", "Perere", "Sinende", "Bembereke", "Kalale"],
  "Collines": ["Dassa-Zoume", "Savalou", "Glazoue", "Save", "Bante", "Ouesse"],
  "Couffo": ["Aplahoue", "Djakotomey", "Dogbo", "Klouekanme", "Lalo", "Toviklin"],
  "Donga": ["Djougou", "Bassila", "Copargo", "Ouake"],
  "Littoral": ["Cotonou"],
  "Mono": ["Lokossa", "Athieme", "Bopa", "Come", "Grand-Popo", "Houeyogbe"],
  "Oueme": ["Porto-Novo", "Adjarra", "Avrankou", "Akpro-Misserete", "Seme-Kpodji", "Dangbo", "Aguegues", "Bonou"],
  "Plateau": ["Sakete", "Pobe", "Ketou", "Adja-Ouere", "Ifangni"],
  "Zou": ["Abomey", "Bohicon", "Cove", "Djidja", "Agbangnizoun", "Ouinhi", "Za-Kpota", "Zagnanado", "Zogbodomey"]
}

export const PROPERTY_TYPES = {
  "location": "Location longue durée",
  "vente": "Vente",
  "court_sejour": "Court séjour",
  "auberge": "Auberge",
  "hotel": "Chambre d'hôtel",
  "chambre_meublee": "Chambre meublée",
  "appartement_meuble": "Appartement meublé"
}

export const PROPERTY_TYPE_ICONS = {
  "location": "Key",
  "vente": "Home",
  "court_sejour": "Calendar",
  "auberge": "Building2",
  "hotel": "Hotel",
  "chambre_meublee": "BedDouble",
  "appartement_meuble": "Building"
}
