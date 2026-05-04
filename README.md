# NiresseHouse - Plateforme Immobilière Complète

Bienvenue sur **NiresseHouse**, la plateforme immobilière la plus complète pour le Bénin, offrant location, vente, réservation d'hôtels, auberges et appartements meublés dans toutes les villes du pays.

![NiresseHouse Banner]

## 📱 Informations de Contact

- **Téléphone/WhatsApp** : 0166369842
- **Email** : niressedigital@gmail.com
- **Plateforme** : NiresseHouse

---

## 🌟 Caractéristiques Principales

### Pour les Clients
- **Recherche Avancée** : Filtrez par prix, type de bien, nombre de chambres, surface, ville, département
- **Barre de Recherche Globale** : Trouvez des biens par mots-clés dans titre, description, équipements
- **Galerie d'Images** : Visualisez les propriétés en détail avec galerie complète
- **Système d'Avis** : Consultez les commentaires d'autres clients
- **Promotions** : Découvrez les meilleures offres du moment
- **6 Types de Biens** : Villa, Maison, Appartement, Auberge, Hôtel, Chambre
- **Couverture Complète** : Accédez à 12 villes et 9 départements du Bénin
- **Réservation Facile** : Contactez les propriétaires directement

### Pour les Administrateurs
- **Dashboard Complet** : Vue d'ensemble avec statistiques (visiteurs, réservations, revenus)
- **Gestion des Biens** : Ajout, édition, suppression, gestion des images
- **Gestion des Utilisateurs** : Création de comptes, attribution de rôles
- **Gestion des Réservations** : Suivi des réservations, changement de statut
- **Modération des Avis** : Approbation/suppression des commentaires
- **Promotions** : Créez des offres spéciales avec réduction
- **Messages de Contact** : Répondez aux demandes des clients
- **Gestion des Localités** : Ajoutez/modifiez villes et départements
- **Statistiques Avancées** : Répartition par type, prix moyen, visites mensuelles

---

## 🏙️ Couverture Géographique

### Villes Disponibles (12 au total)
- **Atlantique** : Abomey-Calavi, Allada, Ouidah, Toffo, Zè
- **Littoral** : Cotonou, Sèmè-Kpodji
- **Collines** : Savalou, Glazoué, Savè, Dassa-Zoumé
- **Zou** : Abomey, Zagnanado, Bohicon
- **Borgou** : Parakou, Djougou, Nikki
- **Et plus...** (extensible)

### Départements du Bénin (9 au total)
- Atlantique
- Littoral
- Donga
- Plateau
- Collines
- Borgou
- Alibori
- Mono
- Zou

---

## 🛠️ Stack Technique

### Frontend
- **Framework** : Next.js 16 (App Router)
- **UI Library** : shadcn/ui
- **Styling** : Tailwind CSS
- **Fonts** : Poppins (headings) + Inter (body)
- **Language** : TypeScript + React 19

### Backend
- **Database** : MySQL 8.0 (via XAMPP)
- **API Layer** : PHP 8.0+ (REST APIs)
- **Authentication** : Session-based avec bcrypt
- **Hosting** : Local development avec XAMPP

### Infrastructure
- **Development** : pnpm + Node.js 16+
- **Database Management** : phpMyAdmin
- **Code Quality** : TypeScript strict mode

---

## 📊 Types de Biens

| Type | Description | Cas d'Utilisation |
|------|-------------|------------------|
| **Villa** | Maisons individuelles de luxe | Ventes haut de gamme |
| **Maison** | Maisons individuelles standard | Locations et ventes |
| **Appartement** | Appartements et studios | Locations longues durées |
| **Auberge** | Hébergements touristiques | Courts séjours |
| **Hôtel** | Chambres d'hôtels en partenariat | Réservations à court terme |
| **Chambre** | Chambres individuelles | Location à la chambre |

---

## 🗄️ Architecture Base de Données

### Tables Principales
- **users** - Comptes utilisateurs (clients, admins, commerciaux)
- **properties** - Biens immobiliers
- **property_images** - Images associées aux biens
- **locations** - Villes et départements
- **reservations** - Réservations d'hôtels/auberges
- **reviews** - Avis et commentaires
- **promotions** - Offres promotionnelles
- **contact_requests** - Demandes de contact
- **statistics** - Logs de visites

---

## 🚀 Démarrage Rapide

### 1. Installation
```bash
# Clone et accédez au dossier
cd niressehouse

# Installez les dépendances
pnpm install

# Importez la base de données SQL
# Via phpMyAdmin ou en ligne de commande
mysql -u root -p niressehouse < scripts/niressehouse.sql
```

### 2. Configuration
- Vérifiez `public/api/config.php` pour les identifiants MySQL
- Assurez-vous que XAMPP (Apache + MySQL) est démarré

### 3. Lancement
```bash
# Démarrage en développement
pnpm dev

# Accédez à http://localhost:3000
```

---

## 📂 Structure du Projet

```
niressehouse/
├── app/
│   ├── admin/                    # Dashboard administrateur
│   │   ├── layout.tsx            # Sidebar + Navigation
│   │   ├── page.tsx              # Accueil admin avec stats
│   │   ├── biens/                # Gestion des propriétés
│   │   ├── utilisateurs/         # Gestion des users
│   │   ├── reservations/         # Suivi des réservations
│   │   ├── avis/                 # Modération des avis
│   │   ├── promotions/           # Gestion des promotions
│   │   ├── statistiques/         # Analytics avancées
│   │   └── localites/            # Gestion villes/depts
│   ├── bien/[id]/                # Détail d'une propriété
│   ├── recherche/                # Page de recherche
│   ├── promotions/               # Page des offres spéciales
│   ├── connexion/                # Login/Register
│   ├── layout.tsx                # Layout global
│   ├── page.tsx                  # Accueil public
│   └── globals.css               # Styles globaux
│
├── components/
│   ├── navbar.tsx                # Barre de navigation
│   ├── footer.tsx                # Pied de page
│   ├── hero-section.tsx          # Hero avec recherche globale
│   ├── property-card.tsx         # Carte de bien
│   ├── search-filters.tsx        # Filtres avancés
│   ├── search-results.tsx        # Affichage des résultats
│   ├── property-gallery.tsx      # Galerie d'images
│   ├── reviews-section.tsx       # Système d'avis
│   ├── promotions-section.tsx    # Section promotions
│   ├── contact-form.tsx          # Formulaire de contact
│   └── ui/                       # Composants shadcn/ui
│
├── lib/
│   ├── db.ts                     # Données mock (développement)
│   ├── types.ts                  # Types TypeScript
│   └── utils.ts                  # Utilitaires
│
├── public/
│   ├── api/                      # APIs PHP
│   │   ├── config.php            # Configuration MySQL
│   │   ├── properties.php        # CRUD propriétés
│   │   ├── reviews.php           # Gestion avis
│   │   ├── promotions.php        # Gestion promotions
│   │   ├── reservations.php      # Gestion réservations
│   │   ├── statistics.php        # Stats du site
│   │   ├── auth.php              # Authentification
│   │   ├── contact.php           # Messages de contact
│   │   ├── users.php             # Gestion users
│   │   └── locations.php         # Gestion localités
│   └── images/                   # Images des propriétés
│
├── scripts/
│   └── niressehouse.sql          # Schéma complet de la BD
│
├── INSTALLATION_GUIDE.md         # Guide détaillé
└── README.md                     # Ce fichier
```

---

## 🎨 Design & Branding

### Couleurs NiresseHouse
- **Bleu Primaire** : #0B1F3A (Confiance, Professionnalisme)
- **Blanc** : #FFFFFF (Clarté, Minimalisme)
- **Vert Accent** : #1DB954 (Croissance, Positif)
- **Or** : #C9A227 (Luxe, Premium)

### Typographie
- **Headings** : Poppins (400-800 weight)
- **Body** : Inter (lisible, moderne)

### Interface
- Minimaliste avec grands visuels
- Airy design (espaces blancs)
- Boutons clairs et actionables
- Images professionnelles de qualité

---

## 🔐 Sécurité & Authentification

### Authentification
- Session-based avec cookies sécurisés
- Mots de passe hashés avec bcrypt
- Validation des entrées utilisateur
- Protection CSRF sur les formulaires

### Rôles & Permissions
- **Super Admin** : Accès complet
- **Admin** : Gestion complète sauf admins
- **Commercial** : Ajout biens et suivi réservations
- **Client** : Lecture seule + commentaires

### Variables d'Environnement
```
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=niressehouse
```

---

## 📈 Fonctionnalités Avancées

### Search & Filter
- Recherche par mots-clés multi-champs
- Filtres composables (prix, type, ville, dept, surface, chambres)
- Autocomplétion de recherche
- Tri par pertinence

### Promotional Features
- Biens en promotion mis en avant
- Réduction % automatique
- Durée limitée pour les offres
- Page dédiée aux meilleures affaires

### Reviews & Ratings
- Notes de 1 à 5 étoiles
- Modération admin obligatoire
- Moyenne des avis affichée
- Commentaires détaillés

### Admin Dashboard
- Graphiques statistiques
- KPIs en temps réel
- Export de données
- Actions en masse

---

## 🌐 Déploiement Production

### Prérequis
- Serveur avec PHP 8.0+
- MySQL 8.0+
- Domaine + SSL certificate
- Node.js 16+ pour le build

### Étapes
1. Build Next.js : `pnpm build`
2. Importer la BD SQL
3. Configurer `public/api/config.php`
4. Déployer sur serveur (Vercel, AWS, etc.)
5. Configurer le DNS

---

## 📞 Support & Contact

Pour toute question, suggestion ou problème technique :

- **Email** : niressedigital@gmail.com
- **WhatsApp** : 0166369842
- **Disponible** : Lun-Sam, 9h-18h (Heure Bénin)

---

## 📄 Licence

NiresseHouse © 2024. Tous droits réservés.

---

## 🙏 Remerciements

Plateforme développée avec passion pour faciliter l'accès au marché immobilier béninois.

**Vive le Bénin, Terre de paix et de prospérité ! 🇧🇯**

---

**Version** : 1.0.0  
**Dernière mise à jour** : Avril 2024  
**Statut** : Production Ready
