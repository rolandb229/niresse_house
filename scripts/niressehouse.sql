-- ============================================================
-- NiresseHouse - Schema de base de donnees MySQL
-- Plateforme immobiliere au Benin
-- A importer dans phpMyAdmin (XAMPP)
-- ============================================================

-- Creer la base de donnees
CREATE DATABASE IF NOT EXISTS niressehouse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE niressehouse;

-- ============================================================
-- TABLE: users (Utilisateurs)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telephone VARCHAR(20) NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'admin', 'commercial', 'client') DEFAULT 'client',
    actif BOOLEAN DEFAULT TRUE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE: departements (12 departements du Benin)
-- ============================================================
CREATE TABLE IF NOT EXISTS departements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- ============================================================
-- TABLE: villes
-- ============================================================
CREATE TABLE IF NOT EXISTS villes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    departement_id INT NOT NULL,
    nom VARCHAR(100) NOT NULL,
    FOREIGN KEY (departement_id) REFERENCES departements(id) ON DELETE CASCADE,
    INDEX idx_departement (departement_id)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE: quartiers
-- ============================================================
CREATE TABLE IF NOT EXISTS quartiers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ville_id INT NOT NULL,
    nom VARCHAR(100) NOT NULL,
    FOREIGN KEY (ville_id) REFERENCES villes(id) ON DELETE CASCADE,
    INDEX idx_ville (ville_id)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE: properties (Biens immobiliers)
-- ============================================================
CREATE TABLE IF NOT EXISTS properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(200) NOT NULL,
    description TEXT,
    type ENUM('location', 'vente', 'court_sejour', 'auberge', 'hotel', 'chambre_meublee', 'appartement_meuble') NOT NULL,
    prix DECIMAL(15, 2) NOT NULL,
    nombre_chambres INT DEFAULT 1,
    nombre_douches INT DEFAULT 1,
    surface DECIMAL(10, 2),
    statut ENUM('disponible', 'loue', 'vendu', 'suspendu', 'reserve') DEFAULT 'disponible',
    quartier_id INT,
    proprietaire_id INT,
    code_unique VARCHAR(20) UNIQUE,
    verifie BOOLEAN DEFAULT FALSE,
    premium BOOLEAN DEFAULT FALSE,
    en_promotion BOOLEAN DEFAULT FALSE,
    reduction INT DEFAULT 0,
    equipements JSON,
    vues INT DEFAULT 0,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (quartier_id) REFERENCES quartiers(id) ON DELETE SET NULL,
    FOREIGN KEY (proprietaire_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_type (type),
    INDEX idx_statut (statut),
    INDEX idx_prix (prix),
    INDEX idx_premium (premium),
    INDEX idx_promotion (en_promotion),
    FULLTEXT idx_fulltext (titre, description)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE: property_images
-- ============================================================
CREATE TABLE IF NOT EXISTS property_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    type ENUM('photo', 'video') DEFAULT 'photo',
    ordre INT DEFAULT 0,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    INDEX idx_property (property_id)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE: contact_requests (Demandes de contact)
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT DEFAULT NULL,
    nom VARCHAR(100) NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    message TEXT,
    statut ENUM('nouveau', 'en_traitement', 'cloture') DEFAULT 'nouveau',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    INDEX idx_property (property_id),
    INDEX idx_statut (statut)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE: reviews (Avis clients)
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(100),
    note INT NOT NULL CHECK (note >= 1 AND note <= 5),
    commentaire TEXT NOT NULL,
    approuve BOOLEAN DEFAULT FALSE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    INDEX idx_property (property_id),
    INDEX idx_approuve (approuve)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE: reservations
-- ============================================================
CREATE TABLE IF NOT EXISTS reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    nom_client VARCHAR(100) NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    nombre_personnes INT DEFAULT 1,
    statut ENUM('en_attente', 'confirmee', 'annulee', 'terminee') DEFAULT 'en_attente',
    montant_total DECIMAL(15, 2),
    notes TEXT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    INDEX idx_property (property_id),
    INDEX idx_statut (statut),
    INDEX idx_dates (date_debut, date_fin)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE: promotions
-- ============================================================
CREATE TABLE IF NOT EXISTS promotions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL UNIQUE,
    reduction INT NOT NULL CHECK (reduction >= 1 AND reduction <= 50),
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    INDEX idx_active (active),
    INDEX idx_dates (date_debut, date_fin)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE: visitor_stats (Statistiques visiteurs)
-- ============================================================
CREATE TABLE IF NOT EXISTS visitor_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    page VARCHAR(200),
    property_id INT,
    visiteurs INT DEFAULT 0,
    vues INT DEFAULT 0,
    ville_visiteur VARCHAR(100),
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    INDEX idx_date (date),
    INDEX idx_property (property_id)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE: favoris
-- ============================================================
CREATE TABLE IF NOT EXISTS favoris (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    property_id INT NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favori (user_id, property_id)
) ENGINE=InnoDB;

-- ============================================================
-- INSERTION DES DONNEES INITIALES
-- ============================================================

-- Departements du Benin
INSERT INTO departements (nom, code) VALUES
('Alibori', 'ALI'),
('Atacora', 'ATA'),
('Atlantique', 'ATL'),
('Borgou', 'BOR'),
('Collines', 'COL'),
('Couffo', 'COU'),
('Donga', 'DON'),
('Littoral', 'LIT'),
('Mono', 'MON'),
('Oueme', 'OUE'),
('Plateau', 'PLA'),
('Zou', 'ZOU');

-- Villes principales par departement
INSERT INTO villes (departement_id, nom) VALUES
-- Alibori (1)
(1, 'Kandi'), (1, 'Malanville'), (1, 'Banikoara'), (1, 'Karimama'), (1, 'Gogounou'), (1, 'Segbana'),
-- Atacora (2)
(2, 'Natitingou'), (2, 'Tanguieta'), (2, 'Boukoumbe'), (2, 'Cobly'), (2, 'Kouande'), (2, 'Kerou'), (2, 'Pehunco'), (2, 'Toukountouna'), (2, 'Materi'),
-- Atlantique (3)
(3, 'Abomey-Calavi'), (3, 'Allada'), (3, 'Ouidah'), (3, 'Tori-Bossito'), (3, 'Kpomasse'), (3, 'So-Ava'), (3, 'Ze'), (3, 'Toffo'),
-- Borgou (4)
(4, 'Parakou'), (4, 'Tchaourou'), (4, 'N''Dali'), (4, 'Nikki'), (4, 'Perere'), (4, 'Sinende'), (4, 'Bembereke'), (4, 'Kalale'),
-- Collines (5)
(5, 'Dassa-Zoume'), (5, 'Savalou'), (5, 'Glazoue'), (5, 'Save'), (5, 'Bante'), (5, 'Ouesse'),
-- Couffo (6)
(6, 'Aplahoue'), (6, 'Djakotomey'), (6, 'Dogbo'), (6, 'Klouekanme'), (6, 'Lalo'), (6, 'Toviklin'),
-- Donga (7)
(7, 'Djougou'), (7, 'Bassila'), (7, 'Copargo'), (7, 'Ouake'),
-- Littoral (8)
(8, 'Cotonou'),
-- Mono (9)
(9, 'Lokossa'), (9, 'Athieme'), (9, 'Bopa'), (9, 'Come'), (9, 'Grand-Popo'), (9, 'Houeyogbe'),
-- Oueme (10)
(10, 'Porto-Novo'), (10, 'Adjarra'), (10, 'Avrankou'), (10, 'Akpro-Misserete'), (10, 'Seme-Kpodji'), (10, 'Dangbo'), (10, 'Aguegues'), (10, 'Bonou'),
-- Plateau (11)
(11, 'Sakete'), (11, 'Pobe'), (11, 'Ketou'), (11, 'Adja-Ouere'), (11, 'Ifangni'),
-- Zou (12)
(12, 'Abomey'), (12, 'Bohicon'), (12, 'Cove'), (12, 'Djidja'), (12, 'Agbangnizoun'), (12, 'Ouinhi'), (12, 'Za-Kpota'), (12, 'Zagnanado'), (12, 'Zogbodomey');

-- Quartiers exemples pour les grandes villes
INSERT INTO quartiers (ville_id, nom) VALUES
-- Cotonou
((SELECT id FROM villes WHERE nom = 'Cotonou'), 'Ganhi'),
((SELECT id FROM villes WHERE nom = 'Cotonou'), 'Akpakpa'),
((SELECT id FROM villes WHERE nom = 'Cotonou'), 'Cadjehoun'),
((SELECT id FROM villes WHERE nom = 'Cotonou'), 'Fidjrosse'),
((SELECT id FROM villes WHERE nom = 'Cotonou'), 'Haie Vive'),
((SELECT id FROM villes WHERE nom = 'Cotonou'), 'Zongo'),
((SELECT id FROM villes WHERE nom = 'Cotonou'), 'Gbegamey'),
-- Abomey-Calavi
((SELECT id FROM villes WHERE nom = 'Abomey-Calavi'), 'Zogbadje'),
((SELECT id FROM villes WHERE nom = 'Abomey-Calavi'), 'Godomey'),
((SELECT id FROM villes WHERE nom = 'Abomey-Calavi'), 'Togba'),
((SELECT id FROM villes WHERE nom = 'Abomey-Calavi'), 'Akassato'),
-- Porto-Novo
((SELECT id FROM villes WHERE nom = 'Porto-Novo'), 'Centre'),
((SELECT id FROM villes WHERE nom = 'Porto-Novo'), 'Ouando'),
-- Parakou
((SELECT id FROM villes WHERE nom = 'Parakou'), 'Banikanni'),
((SELECT id FROM villes WHERE nom = 'Parakou'), 'Ladji Farani'),
((SELECT id FROM villes WHERE nom = 'Parakou'), 'Guinssoko'),
-- Bohicon
((SELECT id FROM villes WHERE nom = 'Bohicon'), 'Centre'),
((SELECT id FROM villes WHERE nom = 'Bohicon'), 'Gare'),
-- Savalou
((SELECT id FROM villes WHERE nom = 'Savalou'), 'Centre'),
((SELECT id FROM villes WHERE nom = 'Savalou'), 'Marche');

-- Utilisateur admin par defaut
-- Email: niressedigital@gmail.com | Mot de passe: admin123
-- Hash genere par bcryptjs (Node.js) avec saltRounds=10
INSERT INTO users (nom, email, telephone, mot_de_passe, role) VALUES
('Admin NiresseHouse', 'niressedigital@gmail.com', '0166369842', '$2b$10$gh3fTOKfdJ9LFX8OjxITAemxD8O2vmk8SeVFiecXMwSNsOB6YD45a', 'super_admin')
ON DUPLICATE KEY UPDATE mot_de_passe = '$2b$10$gh3fTOKfdJ9LFX8OjxITAemxD8O2vmk8SeVFiecXMwSNsOB6YD45a';

-- ============================================================
-- VUES UTILES
-- ============================================================

-- Vue des proprietes avec infos de localisation
CREATE OR REPLACE VIEW v_properties_full AS
SELECT 
    p.*,
    q.nom AS quartier_nom,
    v.nom AS ville_nom,
    d.nom AS departement_nom,
    (SELECT AVG(note) FROM reviews WHERE property_id = p.id AND approuve = TRUE) AS note_moyenne,
    (SELECT COUNT(*) FROM reviews WHERE property_id = p.id AND approuve = TRUE) AS nombre_avis
FROM properties p
LEFT JOIN quartiers q ON p.quartier_id = q.id
LEFT JOIN villes v ON q.ville_id = v.id
LEFT JOIN departements d ON v.departement_id = d.id;

-- Vue des statistiques par jour
CREATE OR REPLACE VIEW v_stats_daily AS
SELECT 
    date,
    SUM(visiteurs) AS total_visiteurs,
    SUM(vues) AS total_vues,
    COUNT(DISTINCT property_id) AS properties_vues
FROM visitor_stats
GROUP BY date
ORDER BY date DESC;

-- ============================================================
-- PROCEDURES STOCKEES
-- ============================================================

DELIMITER //

-- Procedure pour incrementer les vues d'une propriete
CREATE PROCEDURE IF NOT EXISTS increment_property_views(IN prop_id INT)
BEGIN
    UPDATE properties SET vues = vues + 1 WHERE id = prop_id;
    INSERT INTO visitor_stats (date, property_id, vues) 
    VALUES (CURDATE(), prop_id, 1)
    ON DUPLICATE KEY UPDATE vues = vues + 1;
END //

-- Procedure pour obtenir les statistiques du mois
CREATE PROCEDURE IF NOT EXISTS get_monthly_stats(IN year_param INT, IN month_param INT)
BEGIN
    SELECT 
        COUNT(DISTINCT DATE(date)) AS jours_actifs,
        SUM(visiteurs) AS total_visiteurs,
        SUM(vues) AS total_vues
    FROM visitor_stats
    WHERE YEAR(date) = year_param AND MONTH(date) = month_param;
END //

DELIMITER ;

-- ============================================================
-- FIN DU SCRIPT
-- ============================================================
