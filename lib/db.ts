// ============================================================
// DONNEES MOCK POUR LA PREVIEW (en production, les donnees
// proviennent de MySQL via les fichiers PHP dans /public/api/)
// NiresseHouse - Plateforme Immobiliere au Benin
// ============================================================

import type { Property, User, ContactRequest, Location, Review, Reservation, DEPARTEMENTS_BENIN } from "@/lib/types"

// Types de proprietes et leurs affichages
export const PROPERTY_TYPES = {
  vente: "Vente",
  location: "Location",
  court_sejour: "Court séjour",
  auberge: "Auberge",
  hotel: "Hôtel",
  chambre_meublee: "Chambre meublée",
  appartement_meuble: "Appartement meublé",
} as const

// Toutes les localites du Benin par departement
export const mockLocations: Location[] = [
  // Alibori
  { id: 1, departement: "Alibori", ville: "Kandi", quartier: "Centre-ville" },
  { id: 2, departement: "Alibori", ville: "Malanville", quartier: "Frontière" },
  { id: 3, departement: "Alibori", ville: "Banikoara", quartier: "Marché" },
  // Atacora
  { id: 4, departement: "Atacora", ville: "Natitingou", quartier: "Centre" },
  { id: 5, departement: "Atacora", ville: "Tanguiéta", quartier: "Pendjari" },
  { id: 6, departement: "Atacora", ville: "Boukoumbé", quartier: "Tata Somba" },
  // Atlantique
  { id: 7, departement: "Atlantique", ville: "Abomey-Calavi", quartier: "Zogbadjè" },
  { id: 8, departement: "Atlantique", ville: "Abomey-Calavi", quartier: "Godomey" },
  { id: 9, departement: "Atlantique", ville: "Abomey-Calavi", quartier: "Togba" },
  { id: 10, departement: "Atlantique", ville: "Abomey-Calavi", quartier: "Akassato" },
  { id: 11, departement: "Atlantique", ville: "Ouidah", quartier: "Centre" },
  { id: 12, departement: "Atlantique", ville: "Allada", quartier: "Marché" },
  // Borgou
  { id: 13, departement: "Borgou", ville: "Parakou", quartier: "Banikanni" },
  { id: 14, departement: "Borgou", ville: "Parakou", quartier: "Ladji Farani" },
  { id: 15, departement: "Borgou", ville: "Parakou", quartier: "Guinssoko" },
  { id: 16, departement: "Borgou", ville: "Nikki", quartier: "Centre" },
  { id: 17, departement: "Borgou", ville: "Tchaourou", quartier: "Gare" },
  // Collines
  { id: 18, departement: "Collines", ville: "Dassa-Zoumé", quartier: "Centre-ville" },
  { id: 19, departement: "Collines", ville: "Dassa-Zoumé", quartier: "Tré" },
  { id: 20, departement: "Collines", ville: "Savalou", quartier: "Centre" },
  { id: 21, departement: "Collines", ville: "Savalou", quartier: "Marché" },
  { id: 22, departement: "Collines", ville: "Glazoué", quartier: "Centre" },
  { id: 23, departement: "Collines", ville: "Savè", quartier: "Gare" },
  // Couffo
  { id: 24, departement: "Couffo", ville: "Aplahoué", quartier: "Centre" },
  { id: 25, departement: "Couffo", ville: "Dogbo", quartier: "Marché" },
  // Donga
  { id: 26, departement: "Donga", ville: "Djougou", quartier: "Centre" },
  { id: 27, departement: "Donga", ville: "Bassila", quartier: "Forêt" },
  // Littoral
  { id: 28, departement: "Littoral", ville: "Cotonou", quartier: "Ganhi" },
  { id: 29, departement: "Littoral", ville: "Cotonou", quartier: "Akpakpa" },
  { id: 30, departement: "Littoral", ville: "Cotonou", quartier: "Cadjehoun" },
  { id: 31, departement: "Littoral", ville: "Cotonou", quartier: "Fidjrossè" },
  { id: 32, departement: "Littoral", ville: "Cotonou", quartier: "Haie Vive" },
  // Mono
  { id: 33, departement: "Mono", ville: "Lokossa", quartier: "Centre" },
  { id: 34, departement: "Mono", ville: "Grand-Popo", quartier: "Plage" },
  { id: 35, departement: "Mono", ville: "Comé", quartier: "Marché" },
  // Ouémé
  { id: 36, departement: "Ouémé", ville: "Porto-Novo", quartier: "Centre" },
  { id: 37, departement: "Ouémé", ville: "Porto-Novo", quartier: "Ouando" },
  { id: 38, departement: "Ouémé", ville: "Sèmè-Kpodji", quartier: "Plage" },
  // Plateau
  { id: 39, departement: "Plateau", ville: "Sakété", quartier: "Centre" },
  { id: 40, departement: "Plateau", ville: "Pobè", quartier: "Marché" },
  { id: 41, departement: "Plateau", ville: "Kétou", quartier: "Centre" },
  // Zou
  { id: 42, departement: "Zou", ville: "Abomey", quartier: "Palais Royal" },
  { id: 43, departement: "Zou", ville: "Bohicon", quartier: "Centre" },
  { id: 44, departement: "Zou", ville: "Bohicon", quartier: "Gare" },
  { id: 45, departement: "Zou", ville: "Covè", quartier: "Centre" },
]

export const mockProperties: Property[] = [
  // Villas et Maisons
  {
    id: 1,
    titre: "Villa moderne 4 chambres avec piscine",
    description: "Magnifique villa moderne située dans le quartier résidentiel de Zogbadjè. Cette propriété offre un cadre de vie exceptionnel avec ses 4 chambres spacieuses, un salon lumineux, une cuisine équipée et une belle piscine. Idéale pour une famille à la recherche de confort et de tranquillité.",
    type: "vente",
    prix: 85000000,
    nombre_chambres: 4,
    nombre_douches: 3,
    surface: 350,
    statut: "disponible",
    ville_id: 7,
    proprietaire_id: 1,
    date_creation: "2025-12-01",
    code_unique: "VNT-AC-001",
    ville: "Abomey-Calavi",
    quartier: "Zogbadjè",
    departement: "Atlantique",
    images: ["/images/villa1.jpg"],
    verifie: true,
    premium: true,
    en_promotion: true,
    reduction: 10,
    equipements: ["Piscine", "Climatisation", "Garage", "Jardin", "Sécurité 24h"],
    note_moyenne: 4.8,
    nombre_avis: 12,
    vues: 245
  },
  {
    id: 2,
    titre: "Appartement 3 pièces meublé à Godomey",
    description: "Bel appartement entièrement meublé au cœur de Godomey. 2 chambres, salon, cuisine équipée, climatisation dans toutes les pièces. Proximité des commerces et transports. Idéal pour jeune couple ou professionnel.",
    type: "appartement_meuble",
    prix: 150000,
    nombre_chambres: 2,
    nombre_douches: 2,
    surface: 85,
    statut: "disponible",
    ville_id: 8,
    proprietaire_id: 1,
    date_creation: "2025-11-20",
    code_unique: "LOC-AC-002",
    ville: "Abomey-Calavi",
    quartier: "Godomey",
    departement: "Atlantique",
    images: ["/images/appart1.jpg"],
    verifie: true,
    premium: false,
    en_promotion: false,
    equipements: ["Climatisation", "WiFi", "Cuisine équipée", "Machine à laver"],
    note_moyenne: 4.5,
    nombre_avis: 8,
    vues: 189
  },
  {
    id: 3,
    titre: "Maison 5 chambres avec grand terrain",
    description: "Grande maison familiale sur un terrain de 600m² à Dassa-Zoumé. 5 chambres, 3 douches, grand salon, terrasse couverte, garage pour 2 voitures. Terrain clôturé avec jardin et arbres fruitiers.",
    type: "vente",
    prix: 45000000,
    nombre_chambres: 5,
    nombre_douches: 3,
    surface: 450,
    statut: "disponible",
    ville_id: 18,
    proprietaire_id: 2,
    date_creation: "2025-11-15",
    code_unique: "VNT-DZ-003",
    ville: "Dassa-Zoumé",
    quartier: "Centre-ville",
    departement: "Collines",
    images: ["/images/maison1.jpg"],
    verifie: true,
    premium: true,
    en_promotion: false,
    equipements: ["Garage", "Jardin", "Terrasse", "Puits"],
    note_moyenne: 4.6,
    nombre_avis: 5,
    vues: 156
  },
  {
    id: 4,
    titre: "Studio moderne à Parakou",
    description: "Studio entièrement rénové et meublé dans le quartier animé de Banikanni. Parfait pour étudiant ou jeune professionnel. Eau courante, électricité, internet inclus.",
    type: "chambre_meublee",
    prix: 55000,
    nombre_chambres: 1,
    nombre_douches: 1,
    surface: 35,
    statut: "disponible",
    ville_id: 13,
    proprietaire_id: 2,
    date_creation: "2025-11-10",
    code_unique: "LOC-PK-004",
    ville: "Parakou",
    quartier: "Banikanni",
    departement: "Borgou",
    images: ["/images/studio1.jpg"],
    verifie: true,
    premium: false,
    en_promotion: true,
    reduction: 15,
    equipements: ["WiFi", "Climatisation", "Eau chaude"],
    note_moyenne: 4.3,
    nombre_avis: 15,
    vues: 312
  },
  {
    id: 5,
    titre: "Villa duplex de standing à Togba",
    description: "Superbe villa duplex haut standing à Togba. 6 chambres, 4 salles de bain, double salon, cuisine américaine, terrasse panoramique, piscine et jardin paysager. Finitions luxueuses, portail automatique.",
    type: "vente",
    prix: 120000000,
    nombre_chambres: 6,
    nombre_douches: 4,
    surface: 500,
    statut: "disponible",
    ville_id: 9,
    proprietaire_id: 1,
    date_creation: "2025-10-28",
    code_unique: "VNT-AC-005",
    ville: "Abomey-Calavi",
    quartier: "Togba",
    departement: "Atlantique",
    images: ["/images/villa2.jpg"],
    verifie: true,
    premium: true,
    en_promotion: false,
    equipements: ["Piscine", "Climatisation centrale", "Garage 3 voitures", "Jardin paysager", "Sécurité", "Groupe électrogène"],
    note_moyenne: 4.9,
    nombre_avis: 7,
    vues: 423
  },
  {
    id: 6,
    titre: "Maison 3 chambres à Ladji Farani",
    description: "Jolie maison de 3 chambres dans un quartier calme de Parakou. Salon spacieux, cuisine, cour intérieure, toilettes modernes. Accès facile au marché central et aux écoles.",
    type: "location",
    prix: 85000,
    nombre_chambres: 3,
    nombre_douches: 2,
    surface: 120,
    statut: "disponible",
    ville_id: 14,
    proprietaire_id: 2,
    date_creation: "2025-10-15",
    code_unique: "LOC-PK-006",
    ville: "Parakou",
    quartier: "Ladji Farani",
    departement: "Borgou",
    images: ["/images/maison2.jpg"],
    verifie: true,
    premium: false,
    en_promotion: false,
    equipements: ["Cour", "Cuisine", "Eau courante"],
    note_moyenne: 4.2,
    nombre_avis: 4,
    vues: 98
  },
  // Auberges
  {
    id: 7,
    titre: "Auberge Le Palmier - Cotonou",
    description: "Auberge confortable au cœur de Cotonou, proche du marché Dantokpa. Chambres climatisées, petit-déjeuner inclus, WiFi gratuit. Idéal pour voyageurs d'affaires et touristes.",
    type: "auberge",
    prix: 15000,
    nombre_chambres: 1,
    nombre_douches: 1,
    surface: 20,
    statut: "disponible",
    ville_id: 28,
    proprietaire_id: 1,
    date_creation: "2025-12-05",
    code_unique: "AUB-COT-007",
    ville: "Cotonou",
    quartier: "Ganhi",
    departement: "Littoral",
    images: ["/images/villa1.jpg"],
    verifie: true,
    premium: true,
    en_promotion: true,
    reduction: 20,
    equipements: ["Climatisation", "WiFi", "Petit-déjeuner", "TV", "Parking"],
    note_moyenne: 4.4,
    nombre_avis: 28,
    vues: 567
  },
  {
    id: 8,
    titre: "Auberge Chez Mama - Savalou",
    description: "Auberge traditionnelle à Savalou avec vue sur les collines. Ambiance familiale, cuisine locale, chambres propres. Parfait pour découvrir la région des Collines.",
    type: "auberge",
    prix: 10000,
    nombre_chambres: 1,
    nombre_douches: 1,
    surface: 18,
    statut: "disponible",
    ville_id: 20,
    proprietaire_id: 2,
    date_creation: "2025-11-28",
    code_unique: "AUB-SAV-008",
    ville: "Savalou",
    quartier: "Centre",
    departement: "Collines",
    images: ["/images/appart1.jpg"],
    verifie: true,
    premium: false,
    en_promotion: false,
    equipements: ["Ventilateur", "Repas locaux", "Cour", "Eau chaude"],
    note_moyenne: 4.6,
    nombre_avis: 19,
    vues: 234
  },
  // Hôtels
  {
    id: 9,
    titre: "Hôtel Royal Palace - Chambre Deluxe",
    description: "Chambre deluxe dans l'un des meilleurs hôtels de Cotonou. Lit king size, salle de bain privée avec baignoire, minibar, coffre-fort. Service de chambre 24h/24.",
    type: "hotel",
    prix: 45000,
    nombre_chambres: 1,
    nombre_douches: 1,
    surface: 35,
    statut: "disponible",
    ville_id: 32,
    proprietaire_id: 1,
    date_creation: "2025-12-08",
    code_unique: "HOT-COT-009",
    ville: "Cotonou",
    quartier: "Haie Vive",
    departement: "Littoral",
    images: ["/images/villa2.jpg"],
    verifie: true,
    premium: true,
    en_promotion: false,
    equipements: ["Climatisation", "WiFi", "Minibar", "TV satellite", "Coffre-fort", "Room service", "Piscine"],
    note_moyenne: 4.7,
    nombre_avis: 45,
    vues: 892
  },
  {
    id: 10,
    titre: "Hôtel du Lac - Porto-Novo",
    description: "Chambre standard avec vue sur la lagune. Établissement calme et élégant dans la capitale. Restaurant gastronomique, terrasse, jardin tropical.",
    type: "hotel",
    prix: 35000,
    nombre_chambres: 1,
    nombre_douches: 1,
    surface: 28,
    statut: "disponible",
    ville_id: 36,
    proprietaire_id: 2,
    date_creation: "2025-12-01",
    code_unique: "HOT-PN-010",
    ville: "Porto-Novo",
    quartier: "Centre",
    departement: "Ouémé",
    images: ["/images/maison1.jpg"],
    verifie: true,
    premium: true,
    en_promotion: true,
    reduction: 25,
    equipements: ["Climatisation", "WiFi", "Restaurant", "Bar", "Jardin", "Parking sécurisé"],
    note_moyenne: 4.5,
    nombre_avis: 32,
    vues: 456
  },
  // Court séjour
  {
    id: 11,
    titre: "Appartement Vacances Fidjrossè Plage",
    description: "Magnifique appartement en bord de mer à Fidjrossè. 2 chambres, salon avec vue sur l'océan, cuisine équipée. Idéal pour des vacances en famille ou entre amis.",
    type: "court_sejour",
    prix: 75000,
    nombre_chambres: 2,
    nombre_douches: 1,
    surface: 65,
    statut: "disponible",
    ville_id: 31,
    proprietaire_id: 1,
    date_creation: "2025-11-25",
    code_unique: "CSJ-COT-011",
    ville: "Cotonou",
    quartier: "Fidjrossè",
    departement: "Littoral",
    images: ["/images/appart1.jpg"],
    verifie: true,
    premium: true,
    en_promotion: true,
    reduction: 15,
    equipements: ["Vue mer", "Climatisation", "Cuisine équipée", "TV", "WiFi", "Plage à 50m"],
    note_moyenne: 4.8,
    nombre_avis: 23,
    vues: 678
  },
  {
    id: 12,
    titre: "Bungalow Grand-Popo Plage",
    description: "Bungalow traditionnel en bord de plage à Grand-Popo. Expérience authentique avec tout le confort moderne. Parfait pour un week-end de détente.",
    type: "court_sejour",
    prix: 50000,
    nombre_chambres: 1,
    nombre_douches: 1,
    surface: 30,
    statut: "disponible",
    ville_id: 34,
    proprietaire_id: 2,
    date_creation: "2025-11-20",
    code_unique: "CSJ-GP-012",
    ville: "Grand-Popo",
    quartier: "Plage",
    departement: "Mono",
    images: ["/images/studio1.jpg"],
    verifie: true,
    premium: false,
    en_promotion: false,
    equipements: ["Accès plage", "Ventilateur", "Terrasse", "Hamac", "Restaurant proche"],
    note_moyenne: 4.6,
    nombre_avis: 18,
    vues: 345
  },
  // Nouvelles villes: Bohicon, Glazoué, Savè
  {
    id: 13,
    titre: "Maison spacieuse à Bohicon Centre",
    description: "Grande maison familiale proche du carrefour principal de Bohicon. 4 chambres, 2 salons, grande cour, idéale pour commerce ou habitation.",
    type: "vente",
    prix: 35000000,
    nombre_chambres: 4,
    nombre_douches: 2,
    surface: 280,
    statut: "disponible",
    ville_id: 43,
    proprietaire_id: 1,
    date_creation: "2025-12-03",
    code_unique: "VNT-BOH-013",
    ville: "Bohicon",
    quartier: "Centre",
    departement: "Zou",
    images: ["/images/maison1.jpg"],
    verifie: true,
    premium: true,
    en_promotion: false,
    equipements: ["Grande cour", "Puits", "Garage", "Local commercial possible"],
    note_moyenne: 4.4,
    nombre_avis: 6,
    vues: 187
  },
  {
    id: 14,
    titre: "Appartement à louer Glazoué",
    description: "Appartement moderne de 2 pièces à Glazoué. Proche du marché et des transports. Eau et électricité disponibles.",
    type: "location",
    prix: 45000,
    nombre_chambres: 2,
    nombre_douches: 1,
    surface: 55,
    statut: "disponible",
    ville_id: 22,
    proprietaire_id: 2,
    date_creation: "2025-11-18",
    code_unique: "LOC-GLZ-014",
    ville: "Glazoué",
    quartier: "Centre",
    departement: "Collines",
    images: ["/images/appart1.jpg"],
    verifie: true,
    premium: false,
    en_promotion: false,
    equipements: ["Eau courante", "Électricité", "Proche marché"],
    note_moyenne: 4.1,
    nombre_avis: 3,
    vues: 89
  },
  {
    id: 15,
    titre: "Chambre meublée Savè Gare",
    description: "Chambre meublée confortable près de la gare de Savè. Idéale pour les voyageurs et les professionnels en déplacement.",
    type: "chambre_meublee",
    prix: 25000,
    nombre_chambres: 1,
    nombre_douches: 1,
    surface: 20,
    statut: "disponible",
    ville_id: 23,
    proprietaire_id: 2,
    date_creation: "2025-11-12",
    code_unique: "CMB-SAV-015",
    ville: "Savè",
    quartier: "Gare",
    departement: "Collines",
    images: ["/images/studio1.jpg"],
    verifie: true,
    premium: false,
    en_promotion: true,
    reduction: 10,
    equipements: ["Lit double", "Ventilateur", "Table de travail", "Eau courante"],
    note_moyenne: 4.0,
    nombre_avis: 8,
    vues: 112
  }
]

export const mockUsers: User[] = [
  {
    id: 1,
    nom: "Admin NiresseHouse",
    email: "niressedigital@gmail.com",
    telephone: "0166369842",
    role: "super_admin",
    date_creation: "2025-01-01",
  },
  {
    id: 2,
    nom: "Jean Ahouandjinou",
    email: "jean@niressehouse.com",
    telephone: "+229 96 00 00 00",
    role: "commercial",
    date_creation: "2025-03-15",
  },
  {
    id: 3,
    nom: "Marie Dossou",
    email: "marie@niressehouse.com",
    telephone: "+229 95 11 22 33",
    role: "admin",
    date_creation: "2025-04-20",
  },
]

export const mockContactRequests: ContactRequest[] = [
  {
    id: 1,
    property_id: 1,
    nom: "Koffi Mensah",
    telephone: "+229 95 12 34 56",
    email: "koffi.mensah@email.com",
    message: "Bonjour, je suis intéressé par la villa. Peut-on organiser une visite cette semaine ?",
    statut: "nouveau",
    date_creation: "2025-12-10",
  },
  {
    id: 2,
    property_id: 2,
    nom: "Amina Saka",
    telephone: "+229 66 78 90 12",
    email: "amina.saka@email.com",
    message: "Est-ce que l'appartement est encore disponible ? Quel est le montant de la caution ?",
    statut: "en_traitement",
    date_creation: "2025-12-08",
  },
  {
    id: 3,
    property_id: 4,
    nom: "Patrick Dossou",
    telephone: "+229 97 45 67 89",
    message: "Je cherche un studio pour 6 mois minimum. Est-ce possible ?",
    statut: "nouveau",
    date_creation: "2025-12-12",
  },
  {
    id: 4,
    property_id: 7,
    nom: "Sophie Kouassi",
    telephone: "+229 94 33 44 55",
    email: "sophie.k@email.com",
    message: "Je voudrais réserver 2 chambres pour le week-end prochain. Disponibilité ?",
    statut: "nouveau",
    date_creation: "2025-12-13",
  },
  {
    id: 5,
    property_id: 9,
    nom: "Emmanuel Agbo",
    telephone: "+229 96 77 88 99",
    message: "Tarif pour une semaine complète en chambre deluxe ?",
    statut: "en_traitement",
    date_creation: "2025-12-11",
  },
]

export const mockReviews: Review[] = [
  {
    id: 1,
    property_id: 1,
    user_name: "Alain Tossou",
    user_email: "alain.t@email.com",
    note: 5,
    commentaire: "Villa magnifique, très bien entretenue. Le propriétaire est très réactif. Je recommande vivement !",
    date_creation: "2025-11-15",
    approuve: true
  },
  {
    id: 2,
    property_id: 1,
    user_name: "Claudine Ahoyo",
    note: 4,
    commentaire: "Très bel espace, la piscine est un vrai plus. Seul bémol, le quartier peut être bruyant le weekend.",
    date_creation: "2025-11-20",
    approuve: true
  },
  {
    id: 3,
    property_id: 7,
    user_name: "Marc Diallo",
    user_email: "marc.d@email.com",
    note: 5,
    commentaire: "Excellent rapport qualité-prix ! L'équipe est accueillante et le petit-déjeuner délicieux.",
    date_creation: "2025-12-01",
    approuve: true
  },
  {
    id: 4,
    property_id: 9,
    user_name: "Fatou Bénon",
    note: 4,
    commentaire: "Hôtel de qualité, service impeccable. La piscine est superbe. Un peu cher mais ça vaut le coup.",
    date_creation: "2025-12-05",
    approuve: true
  },
  {
    id: 5,
    property_id: 11,
    user_name: "Pierre Gnonlonfoun",
    user_email: "pierre.g@email.com",
    note: 5,
    commentaire: "Parfait pour les vacances ! La vue sur la mer est incroyable. On reviendra sans hésiter.",
    date_creation: "2025-11-28",
    approuve: true
  }
]

export const mockReservations: Reservation[] = [
  {
    id: 1,
    property_id: 7,
    nom_client: "Marie Sènou",
    telephone: "+229 95 00 11 22",
    email: "marie.s@email.com",
    date_debut: "2025-12-20",
    date_fin: "2025-12-22",
    nombre_personnes: 2,
    statut: "confirmee",
    montant_total: 30000,
    date_creation: "2025-12-10"
  },
  {
    id: 2,
    property_id: 9,
    nom_client: "Jean-Paul Adjovi",
    telephone: "+229 96 33 44 55",
    date_debut: "2025-12-25",
    date_fin: "2025-12-28",
    nombre_personnes: 1,
    statut: "en_attente",
    montant_total: 135000,
    date_creation: "2025-12-12"
  },
  {
    id: 3,
    property_id: 11,
    nom_client: "Famille Agossou",
    telephone: "+229 97 66 77 88",
    email: "agossou.famille@email.com",
    date_debut: "2025-12-31",
    date_fin: "2026-01-03",
    nombre_personnes: 4,
    statut: "confirmee",
    montant_total: 225000,
    date_creation: "2025-12-08"
  }
]

export const mockVisitorStats = {
  today: 156,
  yesterday: 142,
  thisWeek: 1024,
  thisMonth: 4562,
  totalViews: 28945,
  topPages: [
    { page: "Accueil", vues: 8234 },
    { page: "Recherche", vues: 6521 },
    { page: "Villa moderne 4 chambres", vues: 2341 },
    { page: "Auberge Le Palmier", vues: 1987 },
    { page: "Hôtel Royal Palace", vues: 1654 }
  ],
  topCities: [
    { ville: "Cotonou", visiteurs: 12456 },
    { ville: "Abomey-Calavi", visiteurs: 8234 },
    { ville: "Porto-Novo", visiteurs: 3456 },
    { ville: "Parakou", visiteurs: 2341 },
    { ville: "Bohicon", visiteurs: 1234 }
  ]
}

export function formatPrice(prix: number, type: string): string {
  const formatted = new Intl.NumberFormat("fr-FR").format(prix)
  if (type === "location" || type === "chambre_meublee") {
    return `${formatted} FCFA/mois`
  }
  if (type === "auberge" || type === "hotel" || type === "court_sejour") {
    return `${formatted} FCFA/nuit`
  }
  return `${formatted} FCFA`
}

export function searchProperties(filters: {
  keyword?: string
  type?: string
  ville?: string
  departement?: string
  prix_min?: number
  prix_max?: number
  chambres_min?: number
  en_promotion?: boolean
}): Property[] {
  let results = [...mockProperties]

  if (filters.keyword) {
    const kw = filters.keyword.toLowerCase()
    results = results.filter(p => 
      p.titre.toLowerCase().includes(kw) ||
      p.description.toLowerCase().includes(kw) ||
      p.ville?.toLowerCase().includes(kw) ||
      p.quartier?.toLowerCase().includes(kw) ||
      p.equipements?.some(e => e.toLowerCase().includes(kw))
    )
  }

  if (filters.type) {
    results = results.filter(p => p.type === filters.type)
  }

  if (filters.ville) {
    results = results.filter(p => p.ville === filters.ville)
  }

  if (filters.departement) {
    results = results.filter(p => p.departement === filters.departement)
  }

  if (filters.prix_min) {
    results = results.filter(p => p.prix >= filters.prix_min!)
  }

  if (filters.prix_max) {
    results = results.filter(p => p.prix <= filters.prix_max!)
  }

  if (filters.chambres_min) {
    results = results.filter(p => p.nombre_chambres >= filters.chambres_min!)
  }

  if (filters.en_promotion) {
    results = results.filter(p => p.en_promotion)
  }

  return results
}

export function getPromotions(): Property[] {
  return mockProperties.filter(p => p.en_promotion)
}

export function getPremiumProperties(): Property[] {
  return mockProperties.filter(p => p.premium)
}

export function getPropertyById(id: number): Property | undefined {
  return mockProperties.find(p => p.id === id)
}

export function getReviewsByPropertyId(propertyId: number): Review[] {
  return mockReviews.filter(r => r.property_id === propertyId && r.approuve)
}

export function getUniqueVilles(): string[] {
  return [...new Set(mockLocations.map(l => l.ville))]
}

export function getUniqueDepartements(): string[] {
  return [...new Set(mockLocations.map(l => l.departement))]
}

export function getVillesByDepartement(departement: string): string[] {
  return [...new Set(mockLocations.filter(l => l.departement === departement).map(l => l.ville))]
}
