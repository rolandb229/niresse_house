# Schéma de la Base de Données - NiresseHouse

Documentation complète de la structure de la base de données MySQL.

---

## 📊 Vue d'ensemble

**Database** : `niressehouse`  
**Charset** : UTF-8  
**Collation** : utf8mb4_unicode_ci  
**Tables** : 9 tables principales

---

## 👥 Table `users`

Stocke les comptes utilisateurs (clients, admins, commerciaux).

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('client', 'commercial', 'admin', 'super_admin') DEFAULT 'client',
  nom VARCHAR(255) NOT NULL,
  telephone VARCHAR(20),
  avatar_url VARCHAR(255),
  bio TEXT,
  ville_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role),
  FOREIGN KEY (ville_id) REFERENCES locations(id)
);
```

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | INT | Identifiant unique |
| `email` | VARCHAR(255) | Email unique |
| `password_hash` | VARCHAR(255) | Mot de passe hashé (bcrypt) |
| `role` | ENUM | Rôle (client, commercial, admin, super_admin) |
| `nom` | VARCHAR(255) | Nom complet |
| `telephone` | VARCHAR(20) | Numéro de téléphone |
| `avatar_url` | VARCHAR(255) | URL de la photo de profil |
| `bio` | TEXT | Biographie de l'utilisateur |
| `ville_id` | INT | Ville de résidence |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Date de modification |

---

## 🏠 Table `properties`

Stocke tous les biens immobiliers (villas, maisons, appartements, etc.).

```sql
CREATE TABLE properties (
  id INT PRIMARY KEY AUTO_INCREMENT,
  titre VARCHAR(255) NOT NULL,
  description TEXT,
  type ENUM('villa', 'maison', 'appartement', 'auberge', 'hotel', 'chambre') NOT NULL,
  prix INT NOT NULL,
  nombre_chambres INT DEFAULT 0,
  nombre_douches INT DEFAULT 0,
  surface INT,
  statut ENUM('disponible', 'occupe', 'loue', 'vendu', 'maintenance') DEFAULT 'disponible',
  ville_id INT NOT NULL,
  proprietaire_id INT NOT NULL,
  code_unique VARCHAR(20) UNIQUE,
  amenities TEXT,
  is_promotion BOOLEAN DEFAULT 0,
  premium BOOLEAN DEFAULT 0,
  verifie BOOLEAN DEFAULT 0,
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_type (type),
  INDEX idx_ville (ville_id),
  INDEX idx_proprietaire (proprietaire_id),
  INDEX idx_statut (statut),
  INDEX idx_premium (premium),
  FOREIGN KEY (ville_id) REFERENCES locations(id),
  FOREIGN KEY (proprietaire_id) REFERENCES users(id)
);
```

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | INT | Identifiant unique |
| `titre` | VARCHAR(255) | Titre du bien |
| `description` | TEXT | Description détaillée |
| `type` | ENUM | Type de bien |
| `prix` | INT | Prix en FCFA |
| `nombre_chambres` | INT | Nombre de chambres |
| `nombre_douches` | INT | Nombre de douches/salles d'eau |
| `surface` | INT | Surface en m² |
| `statut` | ENUM | État du bien |
| `ville_id` | INT | Ville du bien |
| `proprietaire_id` | INT | Propriétaire/Propriétaire |
| `code_unique` | VARCHAR(20) | Code unique (VIL-0001) |
| `amenities` | TEXT | Équipements (piscine, parking, etc.) |
| `is_promotion` | BOOLEAN | En promotion ? |
| `premium` | BOOLEAN | Bien premium ? |
| `verifie` | BOOLEAN | Bien vérifié par admin ? |
| `date_creation` | TIMESTAMP | Date de création |
| `created_at` | TIMESTAMP | Date d'insertion |
| `updated_at` | TIMESTAMP | Date de modification |

---

## 📸 Table `property_images`

Images associées aux biens immobiliers (galerie).

```sql
CREATE TABLE property_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  property_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_property (property_id),
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);
```

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | INT | Identifiant unique |
| `property_id` | INT | Propriété associée |
| `image_url` | VARCHAR(255) | URL de l'image |
| `order` | INT | Ordre d'affichage |
| `created_at` | TIMESTAMP | Date d'ajout |

---

## 🏙️ Table `locations`

Villes et départements du Bénin.

```sql
CREATE TABLE locations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ville VARCHAR(255) NOT NULL UNIQUE,
  departement VARCHAR(255) NOT NULL,
  quartier VARCHAR(255),
  code_postal VARCHAR(10),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_ville (ville),
  INDEX idx_departement (departement)
);
```

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | INT | Identifiant unique |
| `ville` | VARCHAR(255) | Nom de la ville |
| `departement` | VARCHAR(255) | Département |
| `quartier` | VARCHAR(255) | Principal quartier |
| `code_postal` | VARCHAR(10) | Code postal |
| `latitude` | DECIMAL | Latitude GPS |
| `longitude` | DECIMAL | Longitude GPS |
| `created_at` | TIMESTAMP | Date d'ajout |

### Villes et Départements Béninois

| Département | Villes | Nombre |
|-------------|--------|--------|
| **Atlantique** | Abomey-Calavi, Allada, Ouidah, Toffo, Zè | 5 |
| **Littoral** | Cotonou, Sèmè-Kpodji | 2 |
| **Donga** | Djougou, Bassila | 2 |
| **Plateau** | Sakété, Ifangni | 2 |
| **Collines** | Savalou, Glazoué, Savè, Dassa-Zoumé | 4 |
| **Borgou** | Parakou, Djougou, Nikki | 3 |
| **Alibori** | Malanville, Karimama | 2 |
| **Mono** | Athiémé, Lokossa | 2 |
| **Zou** | Abomey, Zagnanado, Bohicon | 3 |

---

## 🏨 Table `reservations`

Réservations pour hôtels, auberges, et autres.

```sql
CREATE TABLE reservations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  property_id INT NOT NULL,
  guest_name VARCHAR(255) NOT NULL,
  guest_email VARCHAR(255) NOT NULL,
  guest_phone VARCHAR(20) NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  number_of_guests INT NOT NULL,
  total_price INT NOT NULL,
  status ENUM('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_property (property_id),
  INDEX idx_guest_email (guest_email),
  INDEX idx_status (status),
  INDEX idx_check_in (check_in),
  FOREIGN KEY (property_id) REFERENCES properties(id)
);
```

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | INT | Identifiant unique |
| `property_id` | INT | Bien réservé |
| `guest_name` | VARCHAR(255) | Nom du client |
| `guest_email` | VARCHAR(255) | Email du client |
| `guest_phone` | VARCHAR(20) | Téléphone du client |
| `check_in` | DATE | Date d'arrivée |
| `check_out` | DATE | Date de départ |
| `number_of_guests` | INT | Nombre de clients |
| `total_price` | INT | Prix total en FCFA |
| `status` | ENUM | État de la réservation |
| `notes` | TEXT | Notes additionnelles |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Date de modification |

---

## ⭐ Table `reviews`

Avis et commentaires des clients.

```sql
CREATE TABLE reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  property_id INT NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  author_email VARCHAR(255) NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  approved BOOLEAN DEFAULT 0,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_property (property_id),
  INDEX idx_approved (approved),
  INDEX idx_rating (rating),
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);
```

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | INT | Identifiant unique |
| `property_id` | INT | Bien commenté |
| `author_name` | VARCHAR(255) | Nom du client |
| `author_email` | VARCHAR(255) | Email du client |
| `rating` | INT | Note 1-5 |
| `comment` | TEXT | Texte du commentaire |
| `approved` | BOOLEAN | Approuvé par admin ? |
| `helpful_count` | INT | Nombre de "utile" |
| `created_at` | TIMESTAMP | Date d'ajout |
| `updated_at` | TIMESTAMP | Date de modification |

---

## 🎉 Table `promotions`

Offres promotionnelles et réductions.

```sql
CREATE TABLE promotions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  property_id INT NOT NULL,
  description TEXT NOT NULL,
  discount_percent INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_property (property_id),
  INDEX idx_active (active),
  INDEX idx_dates (start_date, end_date),
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);
```

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | INT | Identifiant unique |
| `property_id` | INT | Bien en promotion |
| `description` | TEXT | Description de l'offre |
| `discount_percent` | INT | Réduction en % (0-100) |
| `start_date` | DATE | Date de début |
| `end_date` | DATE | Date de fin |
| `active` | BOOLEAN | Promotion active ? |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Date de modification |

---

## 💬 Table `contact_requests`

Messages de contact des visiteurs.

```sql
CREATE TABLE contact_requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nom VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telephone VARCHAR(20),
  objet VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('nouveau', 'lu', 'repondu', 'ferme') DEFAULT 'nouveau',
  reponse TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);
```

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | INT | Identifiant unique |
| `nom` | VARCHAR(255) | Nom du visiteur |
| `email` | VARCHAR(255) | Email du visiteur |
| `telephone` | VARCHAR(20) | Téléphone du visiteur |
| `objet` | VARCHAR(255) | Sujet du message |
| `message` | TEXT | Contenu du message |
| `status` | ENUM | État du message |
| `reponse` | TEXT | Réponse admin |
| `created_at` | TIMESTAMP | Date d'arrivée |
| `updated_at` | TIMESTAMP | Date de modification |

---

## 📈 Table `statistics`

Logs des visites et statistiques.

```sql
CREATE TABLE statistics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  page_path VARCHAR(255) NOT NULL,
  user_agent VARCHAR(255),
  ip_address VARCHAR(45),
  referrer VARCHAR(255),
  session_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_page (page_path),
  INDEX idx_date (created_at),
  INDEX idx_session (session_id)
);
```

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | INT | Identifiant unique |
| `page_path` | VARCHAR(255) | Page visitée |
| `user_agent` | VARCHAR(255) | Navigateur/Device |
| `ip_address` | VARCHAR(45) | Adresse IP |
| `referrer` | VARCHAR(255) | Provenance |
| `session_id` | VARCHAR(255) | Session unique |
| `created_at` | TIMESTAMP | Date de visite |

---

## 🔑 Diagramme de Relation

```
users ─────────────────────────────────────────────┐
  ├─ owns ──────────→ properties                  │
  ├─ writes ──────→ reviews                       │
  └─ makes ──────→ reservations                   │
                     │
properties ──→ locations
         │
         ├─ has ────→ property_images
         ├─ gets ───→ reviews
         ├─ has ────→ reservations
         └─ in ─────→ promotions
```

---

## 💾 Taille Estimée

| Table | Enregistrements | Taille |
|-------|-----------------|--------|
| users | 1000 | ~2 MB |
| properties | 5000 | ~15 MB |
| property_images | 25000 | ~20 MB |
| locations | 25 | ~50 KB |
| reservations | 10000 | ~5 MB |
| reviews | 50000 | ~30 MB |
| promotions | 200 | ~500 KB |
| contact_requests | 5000 | ~10 MB |
| statistics | 1000000 | ~100 MB |
| **TOTAL** | **~1.1M** | **~182 MB** |

---

## 🔒 Intégrité des Données

### Contraintes d'intégrité
- Foreign keys activées
- Contraintes UNIQUE sur email, titre de ville
- Vérification des ranges (rating 1-5, discount 0-100)
- Timestamps automatiques

### Backup recommandé
```bash
# Quotidien
mysqldump -u root -p niressehouse > backup_$(date +%Y-%m-%d).sql

# Hebdomadaire (compressé)
mysqldump -u root -p niressehouse | gzip > backup_$(date +%Y-w%V).sql.gz
```

---

## 🚀 Optimisations

### Indexes créés
```sql
-- Recherche
CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_ville ON properties(ville_id);
CREATE INDEX idx_properties_prix ON properties(prix);

-- Jointures fréquentes
CREATE INDEX idx_reservations_property ON reservations(property_id);
CREATE INDEX idx_reviews_property ON reviews(property_id);
CREATE INDEX idx_images_property ON property_images(property_id);

-- Filtres
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reviews_approved ON reviews(approved);
CREATE INDEX idx_promotions_active ON promotions(active);

-- Analytics
CREATE INDEX idx_statistics_page ON statistics(page_path);
CREATE INDEX idx_statistics_date ON statistics(created_at);
```

---

## 📊 Requêtes Courantes

### Top 5 villes
```sql
SELECT ville, COUNT(*) as count 
FROM properties p
JOIN locations l ON p.ville_id = l.id
GROUP BY l.id
ORDER BY count DESC
LIMIT 5;
```

### Propriétés en promotion
```sql
SELECT p.*, pr.discount_percent
FROM properties p
JOIN promotions pr ON p.id = pr.property_id
WHERE pr.active = 1 AND pr.end_date >= NOW();
```

### Avis non approuvés
```sql
SELECT r.*, p.titre
FROM reviews r
JOIN properties p ON r.property_id = p.id
WHERE r.approved = 0
ORDER BY r.created_at DESC;
```

### Réservations du mois
```sql
SELECT COUNT(*) as total, SUM(total_price) as revenue
FROM reservations
WHERE MONTH(check_in) = MONTH(NOW())
AND YEAR(check_in) = YEAR(NOW());
```

---

**NiresseHouse © 2024 - Database v1.0**

Dernière mise à jour : Avril 2024
