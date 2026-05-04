-- ============================================================
-- NiresseHouse - Donnees exemples (biens immobiliers)
-- A executer APRES niressehouse.sql ET setup_admin_user.sql
-- Ce script est idempotent : DELETE puis INSERT pour éviter les doublons
-- ============================================================

USE niressehouse;

-- Nettoyage préalable (idempotent)
DELETE FROM property_images WHERE property_id IN (
  SELECT id FROM properties WHERE code_unique IN (
    'LOC-VILLA01','VNT-DUPLEX01','APM-CAD01','CHM-GOD01',
    'AUB-PAL01','VNT-FIDJ01','CSJ-GAN01','HTL-PAR01'
  )
);
DELETE FROM reviews WHERE property_id IN (
  SELECT id FROM properties WHERE code_unique IN (
    'LOC-VILLA01','VNT-DUPLEX01','APM-CAD01','CHM-GOD01',
    'AUB-PAL01','VNT-FIDJ01','CSJ-GAN01','HTL-PAR01'
  )
);
DELETE FROM properties WHERE code_unique IN (
  'LOC-VILLA01','VNT-DUPLEX01','APM-CAD01','CHM-GOD01',
  'AUB-PAL01','VNT-FIDJ01','CSJ-GAN01','HTL-PAR01'
);

-- ============================================================
-- INSERTION DES BIENS EXEMPLES
-- ============================================================

INSERT INTO properties (
  titre, description, type, prix, nombre_chambres, nombre_douches,
  surface, statut, quartier_id, code_unique, verifie, premium,
  en_promotion, reduction, equipements
) VALUES
(
  'Villa moderne 4 chambres - Haie Vive',
  'Magnifique villa moderne située dans le quartier résidentiel de Haie Vive à Cotonou. Construccion récente avec des finitions haut de gamme. Idéale pour une famille ou un investissement locatif. Jardin paysager, piscine, garage 3 voitures.',
  'location', 450000, 4, 3, 280,
  'disponible',
  (SELECT id FROM quartiers WHERE nom = 'Haie Vive' LIMIT 1),
  'LOC-VILLA01', TRUE, TRUE, FALSE, 0,
  '["WiFi", "Climatisation centrale", "Piscine", "Garage 3 voitures", "Sécurité 24h", "Jardin paysager", "TV satellite"]'
),
(
  'Duplex à vendre - Akpakpa',
  'Beau duplex de 5 pièces à vendre dans le quartier calme d''Akpakpa. Deux niveaux avec terrasse au dernier étage offrant une vue dégagée. Quartier bien desservi, proche des commerces et transports. Idéal pour primo-accédants.',
  'vente', 28500000, 3, 2, 180,
  'disponible',
  (SELECT id FROM quartiers WHERE nom = 'Akpakpa' LIMIT 1),
  'VNT-DUPLEX01', TRUE, FALSE, TRUE, 10,
  '["Climatisation", "Parking sécurisé", "Sécurité", "TV"]'
),
(
  'Appartement meublé - Cadjehoun',
  'Appartement meublé de standing, entièrement équipé pour accueil immédiat. Situé au 2ème étage d''un immeuble sécurisé dans le quartier prisé de Cadjehoun. Internet haut débit inclus.',
  'appartement_meuble', 150000, 2, 1, 85,
  'disponible',
  (SELECT id FROM quartiers WHERE nom = 'Cadjehoun' LIMIT 1),
  'APM-CAD01', TRUE, TRUE, FALSE, 0,
  '["WiFi", "Climatisation", "TV satellite", "Cuisine équipée"]'
),
(
  'Chambre meublée - Godomey',
  'Chambre meublée confortable et propre à Godomey (Abomey-Calavi). Lit double, armoire, bureau. Idéale pour étudiant ou jeune professionnel. Accès Internet, eau courante, électricité inclus dans le loyer.',
  'chambre_meublee', 35000, 1, 1, 25,
  'disponible',
  (SELECT id FROM quartiers WHERE nom = 'Godomey' LIMIT 1),
  'CHM-GOD01', FALSE, FALSE, FALSE, 0,
  '["WiFi", "Climatisation"]'
),
(
  'Auberge Le Palmier - Porto-Novo',
  'Auberge familiale au cœur de Porto-Novo. Chambres propres et confortables avec ventilateur ou climatisation au choix. Petit-déjeuner disponible sur demande. Idéale pour séjour courte durée.',
  'auberge', 15000, 1, 1, 20,
  'disponible',
  (SELECT id FROM quartiers WHERE nom = 'Centre' AND ville_id = (SELECT id FROM villes WHERE nom = 'Porto-Novo') LIMIT 1),
  'AUB-PAL01', TRUE, FALSE, FALSE, 0,
  '["WiFi", "TV", "Climatisation"]'
),
(
  'Grande villa à vendre - Fidjrosse',
  'Exceptionnelle villa à quelques pas de la plage de Fidjrosse. 5 chambres, 4 salles de bain, grand salon, salle à manger, cuisine équipée, bureau, dépendances pour personnel. Investissement prestige.',
  'vente', 85000000, 5, 4, 450,
  'disponible',
  (SELECT id FROM quartiers WHERE nom = 'Fidjrosse' LIMIT 1),
  'VNT-FIDJ01', TRUE, TRUE, FALSE, 0,
  '["WiFi", "Climatisation centrale", "Piscine", "Garage 3 voitures", "Sécurité 24h", "Jardin paysager", "TV satellite", "Cuisine équipée"]'
),
(
  'Studio court séjour - Ganhi',
  'Studio fonctionnel disponible pour court séjour à Cotonou. Situé en plein centre commercial de Ganhi, idéal pour hommes d''affaires. Toutes commodités à portée. Ménage hebdomadaire inclus.',
  'court_sejour', 25000, 1, 1, 30,
  'disponible',
  (SELECT id FROM quartiers WHERE nom = 'Ganhi' LIMIT 1),
  'CSJ-GAN01', TRUE, FALSE, TRUE, 15,
  '["WiFi", "Climatisation", "TV"]'
),
(
  'Hôtel résidence - Parakou',
  'Hôtel résidence moderne en plein centre de Parakou. 20 chambres standard et suites. Restaurant, salle de conférence, parking privatif. Idéal pour séjours professionnels et événements.',
  'hotel', 30000, 1, 1, 40,
  'disponible',
  (SELECT id FROM quartiers WHERE nom = 'Banikanni' LIMIT 1),
  'HTL-PAR01', TRUE, TRUE, FALSE, 0,
  '["WiFi", "Climatisation", "TV satellite", "Cuisine équipée", "Parking sécurisé", "Sécurité 24h"]'
);

-- ============================================================
-- IMAGES DES BIENS (4 images par bien, chemins /images/*.jpg)
-- ============================================================

-- Villa Haie Vive — 4 images
INSERT INTO property_images (property_id, image_url, type, ordre)
SELECT p.id, '/images/villa1.jpg', 'photo', 0 FROM properties p WHERE p.code_unique = 'LOC-VILLA01';
INSERT INTO property_images (property_id, image_url, type, ordre)
SELECT p.id, '/images/villa1_salon.jpg', 'photo', 1 FROM properties p WHERE p.code_unique = 'LOC-VILLA01';
INSERT INTO property_images (property_id, image_url, type, ordre)
SELECT p.id, '/images/villa1_jardin.jpg', 'photo', 2 FROM properties p WHERE p.code_unique = 'LOC-VILLA01';
INSERT INTO property_images (property_id, image_url, type, ordre)
SELECT p.id, '/images/villa2_chambre.jpg', 'photo', 3 FROM properties p WHERE p.code_unique = 'LOC-VILLA01';

-- Duplex Akpakpa — 4 images
INSERT INTO property_images (property_id, image_url, type, ordre)
SELECT p.id, '/images/duplex1.jpg', 'photo', 0 FROM properties p WHERE p.code_unique = 'VNT-DUPLEX01';
INSERT INTO property_images (property_id, image_url, type, ordre)
SELECT p.id, '/images/villa2_chambre.jpg', 'photo', 1 FROM properties p WHERE p.code_unique = 'VNT-DUPLEX01';
INSERT INTO property_images (property_id, image_url, type, ordre)
SELECT p.id, '/images/villa2_cuisine.jpg', 'photo', 2 FROM properties p WHERE p.code_unique = 'VNT-DUPLEX01';
INSERT INTO property_images (property_id, image_url, type, ordre)
SELECT p.id, '/images/villa1_salon.jpg', 'photo', 3 FROM properties p WHERE p.code_unique = 'VNT-DUPLEX01';

-- Appartement Cadjehoun — 4 images
INSERT INTO property_images (property_id, image_url, type, ordre)
SELECT p.id, '/images/appartement1.jpg', 'photo', 0 FROM properties p WHERE p.code_unique = 'APM-CAD01';
INSERT INTO property_images (property_id, image_url, type, ordre)
SELECT p.id, '/images/villa2_cuisine.jpg', 'photo', 1 FROM properties p WHERE p.code_unique = 'APM-CAD01';
INSERT INTO property_images (property_id, image_url, type, ordre)
SELECT p.id, '/images/villa1_salon.jpg', 'photo', 2 FROM properties p WHERE p.code_unique = 'APM-CAD01';
INSERT INTO property_images (property_id, image_url, type, ordre)
SELECT p.id, '/images/villa2_chambre.jpg', 'photo', 3 FROM properties p WHERE p.code_unique = 'APM-CAD01';

-- Chambre Godomey — 4 images
INSERT INTO property_images (property_id, image_url, type, ordre)
SELECT p.id, '/images/chambre1.jpg', 'photo', 0 FROM properties p WHERE p.code_unique = 'CHM-GOD01';
INSERT INTO property_images (property_id, image_url, type, ordre)
SELECT p.id, '/images/studio1.jpg', 'photo', 1 FROM properties p WHERE p.code_unique = 'CHM-GOD01';
INSERT INTO property_images (property_id, image_url, type, ordre)
SELECT p.id, '/images/villa2_chambre.jpg', 'photo', 2 FROM properties p WHERE p.code_unique = 'CHM-GOD01';
INSERT INTO property_images (property_id, image_url, type, ordre)
SELECT p.id, '/images/appartement1.jpg', 'photo', 3 FROM properties p WHERE p.code_unique = 'CHM-GOD01';

-- Auberge Porto-Novo — 4 images
INSERT INTO property_images (property_id, image_url, type, ordre)
SELECT p.id, '/images/auberge1.jpg', 'photo', 0 FROM properties p WHERE p.code_unique = 'AUB-PAL01';
INSERT INTO property_images (property_id, image_url, type, ordre)
SELECT p.id, '/images/chambre1.jpg', 'photo', 1 FROM properties p WHERE p.code_unique = 'AUB-PAL01';
INSERT INTO property_images (property_id, image_url, type, ordre)
SELECT p.id, '/images/studio1.jpg', 'photo', 2 FROM properties p WHERE p.code_unique = 'AUB-PAL01';
INSERT INTO property_images (property_id, image_url, type, ordre)
SELECT p.id, '/images/villa2_chambre.jpg', 'photo', 3 FROM properties p WHERE p.code_unique = 'AUB-PAL01';

-- Grande villa Fidjrosse — 4 images
INSERT INTO property_images (property_id, image_url, type, ordre)
SELECT p.id, '/images/villa2.jpg', 'photo', 0 FROM properties p WHERE p.code_unique = 'VNT-FIDJ01';
INSERT INTO property_images (property_id, image_url, type, ordre)
SELECT p.id, '/images/villa1_salon.jpg', 'photo', 1 FROM properties p WHERE p.code_unique = 'VNT-FIDJ01';
INSERT INTO property_images (property_id, image_url, type, ordre)
SELECT p.id, '/images/villa1_jardin.jpg', 'photo', 2 FROM properties p WHERE p.code_unique = 'VNT-FIDJ01';
INSERT INTO property_images (property_id, image_url, type, ordre)
SELECT p.id, '/images/villa2_cuisine.jpg', 'photo', 3 FROM properties p WHERE p.code_unique = 'VNT-FIDJ01';

-- Studio Ganhi — 4 images
INSERT INTO property_images (property_id, image_url, type, ordre)
SELECT p.id, '/images/studio1.jpg', 'photo', 0 FROM properties p WHERE p.code_unique = 'CSJ-GAN01';
INSERT INTO property_images (property_id, image_url, type, ordre)
SELECT p.id, '/images/chambre1.jpg', 'photo', 1 FROM properties p WHERE p.code_unique = 'CSJ-GAN01';
INSERT INTO property_images (property_id, image_url, type, ordre)
SELECT p.id, '/images/appartement1.jpg', 'photo', 2 FROM properties p WHERE p.code_unique = 'CSJ-GAN01';
INSERT INTO property_images (property_id, image_url, type, ordre)
SELECT p.id, '/images/villa2_cuisine.jpg', 'photo', 3 FROM properties p WHERE p.code_unique = 'CSJ-GAN01';

-- Hotel Parakou — 4 images
INSERT INTO property_images (property_id, image_url, type, ordre)
SELECT p.id, '/images/hotel1.jpg', 'photo', 0 FROM properties p WHERE p.code_unique = 'HTL-PAR01';
INSERT INTO property_images (property_id, image_url, type, ordre)
SELECT p.id, '/images/chambre1.jpg', 'photo', 1 FROM properties p WHERE p.code_unique = 'HTL-PAR01';
INSERT INTO property_images (property_id, image_url, type, ordre)
SELECT p.id, '/images/villa1_salon.jpg', 'photo', 2 FROM properties p WHERE p.code_unique = 'HTL-PAR01';
INSERT INTO property_images (property_id, image_url, type, ordre)
SELECT p.id, '/images/studio1.jpg', 'photo', 3 FROM properties p WHERE p.code_unique = 'HTL-PAR01';

-- ============================================================
-- AVIS EXEMPLES (approuves)
-- ============================================================
INSERT INTO reviews (property_id, user_name, user_email, note, commentaire, approuve)
SELECT p.id, 'Kofi Mensah', 'kofi@gmail.com', 5,
  'Excellente villa, très bien entretenue. Le quartier est calme et sécurisé. Je recommande vivement !', TRUE
FROM properties p WHERE p.code_unique = 'LOC-VILLA01';

INSERT INTO reviews (property_id, user_name, user_email, note, commentaire, approuve)
SELECT p.id, 'Aïchatou Diallo', 'aichatou@gmail.com', 4,
  'Bonne propriété, bien situé. Quelques petits travaux à prévoir mais le prix est raisonnable.', TRUE
FROM properties p WHERE p.code_unique = 'VNT-DUPLEX01';

INSERT INTO reviews (property_id, user_name, user_email, note, commentaire, approuve)
SELECT p.id, 'Jean-Baptiste Houessou', 'jb@outlook.com', 5,
  'Appartement parfait pour mon séjour professionnel. Tout est inclus, WiFi excellent, très propre.', TRUE
FROM properties p WHERE p.code_unique = 'APM-CAD01';

INSERT INTO reviews (property_id, user_name, user_email, note, commentaire, approuve)
SELECT p.id, 'Fatima Sidi', 'fatima.s@gmail.com', 4,
  'Auberge propre et accueillante. Personnel sympathique. Je reviendrai lors de mon prochain passage à Porto-Novo.', TRUE
FROM properties p WHERE p.code_unique = 'AUB-PAL01';
