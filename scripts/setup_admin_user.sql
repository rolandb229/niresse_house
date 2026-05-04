-- ============================================================
-- NiresseHouse - Script de création/réinitialisation du compte admin
-- Hash bcrypt généré et VÉRIFIÉ avec Node.js bcryptjs
-- Mot de passe admin : admin123
-- ============================================================

USE niressehouse;

-- Ajouter la colonne actif si elle n'existe pas encore
ALTER TABLE users MODIFY COLUMN actif TINYINT(1) DEFAULT 1;

-- Supprimer l'ancien compte admin (hash potentiellement incorrect)
DELETE FROM users WHERE email = 'niressedigital@gmail.com';

-- Insérer le compte admin avec hash bcryptjs VÉRIFIÉ (mot de passe : admin123)
INSERT INTO users (nom, email, telephone, mot_de_passe, role, actif) VALUES
(
  'Admin NiresseHouse',
  'niressedigital@gmail.com',
  '0166369842',
  '$2b$10$gh3fTOKfdJ9LFX8OjxITAemxD8O2vmk8SeVFiecXMwSNsOB6YD45a',
  'super_admin',
  1
);

-- Compte commercial de test (mot de passe : admin123)
INSERT IGNORE INTO users (nom, email, telephone, mot_de_passe, role, actif) VALUES
(
  'Jean Commercial',
  'jean@niressehouse.com',
  '0166369843',
  '$2b$10$gh3fTOKfdJ9LFX8OjxITAemxD8O2vmk8SeVFiecXMwSNsOB6YD45a',
  'commercial',
  1
);

-- S'assurer que tous les comptes existants ont actif = 1
UPDATE users SET actif = 1 WHERE actif IS NULL OR actif = 0;
