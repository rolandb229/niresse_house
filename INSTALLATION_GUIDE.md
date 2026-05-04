# Guide d'Installation - NiresseHouse

## 🏠 Présentation
NiresseHouse est une plateforme immobilière complète pour le Bénin, permettant la location, la vente, et la réservation d'hôtels, auberges et appartements meublés.

**Informations de contact :**
- 📱 Téléphone/WhatsApp : 0166369842
- 📧 Email : niressedigital@gmail.com
- 🌐 Plateforme : NiresseHouse

---

## 📋 Configuration locale avec XAMPP

### 1. Prérequis
- XAMPP installé et Apache + MySQL démarrés
- Node.js v16+ et pnpm
- Un éditeur de code (VS Code, etc.)

### 2. Installation de la base de données MySQL

#### Via phpMyAdmin :
1. Ouvrez `http://localhost/phpmyadmin`
2. Créez une nouvelle base de données nommée `niressehouse`
3. Importez le fichier `scripts/niressehouse.sql` :
   - Cliquez sur l'onglet "Importer"
   - Sélectionnez le fichier SQL
   - Cliquez sur "Exécuter"

#### Ou via ligne de commande (MySQL CLI) :
```bash
mysql -u root -p < scripts/niressehouse.sql
```

### 3. Configuration PHP

- Assurez-vous que `php` est dans le PATH système
- Les fichiers PHP dans `public/api/` gèrent la communication avec MySQL
- Le fichier `public/api/config.php` contient les identifiants de connexion

### 4. Installation du Frontend React/Next.js

```bash
# Installez les dépendances
pnpm install

# Lancez le serveur de développement
pnpm dev
```

L'application sera accessible à `http://localhost:3000`

---

## 🗂️ Structure du projet

```
/app
  /admin          # Pages d'administration
    /biens        # Gestion des biens
    /utilisateurs # Gestion des utilisateurs
    /messages     # Gestion des messages
    /reservations # Gestion des réservations
    /avis         # Modération des avis
    /promotions   # Gestion des promotions
    /statistiques # Statistiques du site
    /localites    # Gestion des villes/départements
  /bien/[id]      # Détail d'un bien
  /recherche      # Page de recherche
  /promotions     # Page des promotions
  /connexion      # Page de connexion

/components       # Composants réutilisables
  /navbar.tsx     # Barre de navigation
  /footer.tsx     # Pied de page
  /property-card  # Carte de bien
  /search-filters # Filtres de recherche
  /reviews-section # Section des avis

/lib
  /db.ts          # Données mock (développement)
  /types.ts       # Types TypeScript

/public/api       # APIs PHP (production)
  /config.php     # Configuration MySQL
  /properties.php # Gestion des biens
  /reviews.php    # Gestion des avis
  /promotions.php # Gestion des promotions
  /reservations.php # Gestion des réservations
  /statistics.php # Statistiques
  /auth.php       # Authentification
  /contact.php    # Formulaire de contact
  /users.php      # Gestion des utilisateurs
  /locations.php  # Gestion des localités

/scripts
  /niressehouse.sql # Schéma de base de données complet
```

---

## 🔑 Types de biens supportés

- **Villa** - Maisons individuelles de luxe
- **Maison** - Maisons individuelles standard
- **Appartement** - Appartements et studios
- **Auberge** - Auberges touristiques
- **Hôtel** - Hôtels et résidences
- **Chambre** - Chambres individuelles à louer

---

## 🏙️ Villes et départements du Bénin

### Département de l'Atlantique
- Abomey-Calavi
- Allada
- Ouidah
- Toffo
- Zè

### Département du Littoral
- Cotonou
- Sèmè-Kpodji

### Département de la Donga
- Djougou
- Bassila

### Département du Plateau
- Sakété
- Ifangni

### Département des Collines
- Savalou
- Glazoué
- Savè
- Dassa-Zoumé

### Département de la Borgou
- Parakou
- Djougou
- Nikki

### Département de l'Alibori
- Malanville
- Karimama

### Département du Mono
- Athiémé
- Lokossa

### Département de la Zou
- Abomey
- Zagnanado
- Bohicon

---

## 👨‍💼 Rôles administrateur

### Super Admin
- Accès complet à toutes les sections
- Gestion des administrateurs
- Configuration globale

### Admin
- Gestion des biens
- Gestion des utilisateurs
- Modération des avis et messages

### Commercial
- Ajout et édition de biens
- Gestion des réservations
- Suivi des messages

---

## 🔐 Authentification

### Créer un compte admin (via phpMyAdmin)

```sql
INSERT INTO users (email, password_hash, role, nom, telephone) VALUES 
('admin@niressehouse.com', '$2y$10$HASHED_PASSWORD', 'super_admin', 'Admin', '0166369842');
```

Utilisez `bcrypt` pour hasher le mot de passe.

---

## 📊 Fonctionnalités principales

### Pour les visiteurs
- ✅ Recherche avancée avec filtres (prix, type, ville, etc.)
- ✅ Barre de recherche par mots-clés
- ✅ Visualisation des détails de propriété
- ✅ Système d'avis et de commentaires
- ✅ Page promotions
- ✅ Formulaire de contact
- ✅ Galerie d'images

### Pour les admins
- ✅ Dashboard avec statistiques
- ✅ Gestion complète des biens
- ✅ Gestion des utilisateurs
- ✅ Gestion des réservations
- ✅ Modération des avis
- ✅ Création de promotions
- ✅ Gestion des villes/départements
- ✅ Suivi des messages de contact
- ✅ Statistiques de visite

---

## 🚀 Déploiement en production

Pour déployer sur un serveur production :

1. **Remplacer les données mock par les APIs PHP**
   - Mettez à jour les URL des appels API dans les composants
   - Pointez vers `https://votre-domaine.com/api/`

2. **Configurer la base de données**
   - Importez `scripts/niressehouse.sql`
   - Mettez à jour les identifiants dans `public/api/config.php`

3. **Sécuriser les APIs**
   - Ajoutez l'authentification par token
   - Validez tous les inputs
   - Utilisez HTTPS obligatoirement

4. **Déployer le frontend**
   - Build : `pnpm build`
   - Déployer sur Vercel ou votre serveur

---

## 🐛 Dépannage

### La base de données ne se connecte pas
- Vérifiez que MySQL est démarré dans XAMPP
- Vérifiez les identifiants dans `public/api/config.php`
- Vérifiez que la base `niressehouse` existe

### Les images ne s'affichent pas
- Vérifiez le chemin des images dans `public/images/`
- Vérifiez les URLs dans la base de données

### Les filtres ne fonctionnent pas
- Vérifiez que les données mock sont bien chargées
- Vérifiez la console du navigateur pour les erreurs

---

## 📞 Support

Pour toute question ou problème :
- 📧 Email : niressedigital@gmail.com
- 📱 WhatsApp : 0166369842

**NiresseHouse © 2024 - Tous droits réservés**
