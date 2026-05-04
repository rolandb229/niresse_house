-- ============================================================
-- NiresseHouse - Script de correction (base déjà importée)
-- Exécuter dans phpMyAdmin si vous avez déjà importé niressehouse.sql
-- et que la connexion admin ne fonctionne pas.
-- ============================================================

USE niressehouse;

-- 1. S'assurer que la colonne actif existe et a la bonne valeur par défaut
ALTER TABLE users MODIFY COLUMN actif TINYINT(1) NOT NULL DEFAULT 1;

-- 2. Remettre actif = 1 pour tous les comptes existants (y compris NULL)
UPDATE users SET actif = 1 WHERE actif IS NULL OR actif = 0;

-- 3. Supprimer l'ancien admin et le recréer avec le bon hash bcrypt
--    Mot de passe : admin123
--    Hash vérifié avec Node.js bcryptjs
DELETE FROM users WHERE email = 'niressedigital@gmail.com';

INSERT INTO users (nom, email, telephone, mot_de_passe, role, actif) VALUES
(
  'Admin NiresseHouse',
  'niressedigital@gmail.com',
  '0166369842',
  '$2b$10$gh3fTOKfdJ9LFX8OjxITAemxD8O2vmk8SeVFiecXMwSNsOB6YD45a',
  'super_admin',
  1
);

-- 4. Vérification (optionnel)
SELECT id, nom, email, role, actif FROM users WHERE email = 'niressedigital@gmail.com';
