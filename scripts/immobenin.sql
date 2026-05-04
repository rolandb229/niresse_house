-- ============================================================
-- ImmoBenin - Script de creation de la base de donnees MySQL
-- A executer dans phpMyAdmin (XAMPP)
-- ============================================================

CREATE DATABASE IF NOT EXISTS immobenin
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE immobenin;

-- ============================================================
-- Table USERS (utilisateurs et admins)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  telephone VARCHAR(50),
  role ENUM('super_admin', 'admin', 'commercial', 'client') NOT NULL DEFAULT 'client',
  mot_de_passe VARCHAR(255) NOT NULL,
  date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB;

-- ============================================================
-- Table LOCATIONS (departements, villes, quartiers)
-- ============================================================
CREATE TABLE IF NOT EXISTS locations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  departement VARCHAR(100) NOT NULL,
  ville VARCHAR(100) NOT NULL,
  quartier VARCHAR(100) NOT NULL,
  INDEX idx_ville (ville)
) ENGINE=InnoDB;

-- ============================================================
-- Table PROPERTIES (biens immobiliers)
-- ============================================================
CREATE TABLE IF NOT EXISTS properties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(255) NOT NULL,
  description TEXT,
  type ENUM('location', 'vente', 'court_sejour') NOT NULL DEFAULT 'location',
  prix BIGINT NOT NULL DEFAULT 0,
  nombre_chambres INT DEFAULT 0,
  nombre_douches INT DEFAULT 0,
  surface INT DEFAULT 0,
  statut ENUM('disponible', 'loue', 'vendu', 'suspendu') NOT NULL DEFAULT 'disponible',
  ville_id INT,
  proprietaire_id INT,
  code_unique VARCHAR(50) UNIQUE,
  verifie TINYINT(1) DEFAULT 0,
  premium TINYINT(1) DEFAULT 0,
  date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ville_id) REFERENCES locations(id) ON DELETE SET NULL,
  FOREIGN KEY (proprietaire_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_type (type),
  INDEX idx_statut (statut),
  INDEX idx_ville_id (ville_id),
  INDEX idx_prix (prix)
) ENGINE=InnoDB;

-- ============================================================
-- Table PROPERTY_IMAGES (images et videos des biens)
-- ============================================================
CREATE TABLE IF NOT EXISTS property_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  type ENUM('photo', 'video') NOT NULL DEFAULT 'photo',
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  INDEX idx_property_id (property_id)
) ENGINE=InnoDB;

-- ============================================================
-- Table CONTACT_REQUESTS (demandes de contact)
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT,
  nom VARCHAR(255) NOT NULL,
  telephone VARCHAR(50) NOT NULL,
  message TEXT,
  statut ENUM('nouveau', 'en_traitement', 'cloture') NOT NULL DEFAULT 'nouveau',
  date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL,
  INDEX idx_statut (statut),
  INDEX idx_property_id (property_id)
) ENGINE=InnoDB;


-- ============================================================
-- DONNEES INITIALES
-- ============================================================

-- Utilisateurs (mots de passe hashes avec password_hash PHP)
-- admin123 => $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
-- jean123  => $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
INSERT INTO users (nom, email, telephone, role, mot_de_passe) VALUES
('Admin Principal', 'admin@immobenin.com', '+229 97 00 00 00', 'super_admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Jean Ahouandjinou', 'jean@immobenin.com', '+229 96 00 00 00', 'commercial', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Localites
INSERT INTO locations (departement, ville, quartier) VALUES
('Atlantique', 'Abomey-Calavi', 'Zogbadje'),
('Atlantique', 'Abomey-Calavi', 'Godomey'),
('Atlantique', 'Abomey-Calavi', 'Togba'),
('Collines', 'Dassa-Zoume', 'Centre-ville'),
('Collines', 'Dassa-Zoume', 'Tre'),
('Borgou', 'Parakou', 'Banikanni'),
('Borgou', 'Parakou', 'Ladji Farani'),
('Borgou', 'Parakou', 'Guinssoko');

-- Biens immobiliers
INSERT INTO properties (titre, description, type, prix, nombre_chambres, nombre_douches, surface, statut, ville_id, proprietaire_id, code_unique, verifie, premium) VALUES
('Villa moderne 4 chambres avec piscine', 'Magnifique villa moderne situee dans le quartier residentiel de Zogbadje. Cette propriete offre un cadre de vie exceptionnel avec ses 4 chambres spacieuses, un salon lumineux, une cuisine equipee et une belle piscine.', 'vente', 85000000, 4, 3, 350, 'disponible', 1, 1, 'VNT-AC-001', 1, 1),
('Appartement 3 pieces meuble a Godomey', 'Bel appartement entierement meuble au coeur de Godomey. 2 chambres, salon, cuisine equipee, climatisation dans toutes les pieces.', 'location', 150000, 2, 2, 85, 'disponible', 2, 1, 'LOC-AC-002', 1, 0),
('Maison 5 chambres avec grand terrain', 'Grande maison familiale sur un terrain de 600m2 a Dassa-Zoume. 5 chambres, 3 douches, grand salon, terrasse couverte, garage pour 2 voitures.', 'vente', 45000000, 5, 3, 450, 'disponible', 4, 2, 'VNT-DZ-003', 1, 1),
('Studio moderne a Parakou', 'Studio entierement renove et meuble dans le quartier anime de Banikanni. Parfait pour etudiant ou jeune professionnel.', 'location', 55000, 1, 1, 35, 'disponible', 6, 2, 'LOC-PK-004', 1, 0),
('Villa duplex de standing a Togba', 'Superbe villa duplex haut standing a Togba. 6 chambres, 4 salles de bain, double salon, cuisine americaine, terrasse panoramique, piscine et jardin paysager.', 'vente', 120000000, 6, 4, 500, 'disponible', 3, 1, 'VNT-AC-005', 1, 1),
('Maison 3 chambres a Ladji Farani', 'Jolie maison de 3 chambres dans un quartier calme de Parakou. Salon spacieux, cuisine, cour interieure, toilettes modernes.', 'location', 85000, 3, 2, 120, 'disponible', 7, 2, 'LOC-PK-006', 1, 0);

-- Images des biens
INSERT INTO property_images (property_id, image_url, type) VALUES
(1, '/images/villa1.jpg', 'photo'),
(2, '/images/appart1.jpg', 'photo'),
(3, '/images/maison1.jpg', 'photo'),
(4, '/images/studio1.jpg', 'photo'),
(5, '/images/villa2.jpg', 'photo'),
(6, '/images/maison2.jpg', 'photo');

-- Messages de contact exemples
INSERT INTO contact_requests (property_id, nom, telephone, message, statut) VALUES
(1, 'Koffi Mensah', '+229 95 12 34 56', 'Bonjour, je suis interesse par la villa. Peut-on organiser une visite cette semaine ?', 'nouveau'),
(2, 'Amina Saka', '+229 66 78 90 12', 'Est-ce que l appartement est encore disponible ? Quel est le montant de la caution ?', 'en_traitement'),
(4, 'Patrick Dossou', '+229 97 45 67 89', 'Je cherche un studio pour 6 mois minimum. Est-ce possible ?', 'nouveau');
