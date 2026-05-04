# Documentation des APIs PHP - NiresseHouse

## 🔌 Vue d'ensemble

Les APIs PHP gèrent toute la communication avec la base de données MySQL. Elles suivent les principes REST.

**URL de Base** : `http://localhost/api/`

---

## 🏠 `/api/properties.php` - Gestion des Propriétés

### GET - Lister les propriétés
```http
GET /api/properties.php?page=1&type=villa&ville=Cotonou&prix_max=100000
```

**Paramètres de recherche** :
- `page` (int) - Numéro de page (défaut: 1)
- `type` (string) - Type de bien (villa, maison, appartement, auberge, hotel, chambre)
- `ville` (string) - Ville
- `departement` (string) - Département
- `prix_min` (int) - Prix minimum
- `prix_max` (int) - Prix maximum
- `chambres_min` (int) - Nombre minimum de chambres
- `surface_min` (int) - Surface minimale
- `search` (string) - Recherche par mots-clés
- `promo_only` (bool) - Afficher seulement les promotions

**Réponse** :
```json
{
  "properties": [
    {
      "id": 1,
      "titre": "Belle villa à Cotonou",
      "type": "villa",
      "prix": 150000,
      "ville": "Cotonou",
      "image": "villa1.jpg",
      "rating": 4.5,
      "review_count": 12,
      "is_promotion": true
    }
  ],
  "total": 45,
  "page": 1,
  "total_pages": 5
}
```

### POST - Ajouter une propriété
```http
POST /api/properties.php

Content-Type: application/json
{
  "titre": "Villa neuve",
  "description": "Très belle villa...",
  "type": "villa",
  "prix": 200000,
  "nombre_chambres": 3,
  "surface": 250,
  "ville_id": 1,
  "amenities": "piscine,parking,jardin"
}
```

---

## ⭐ `/api/reviews.php` - Système d'Avis

### GET - Récupérer les avis
```http
GET /api/reviews.php?action=get_by_property&property_id=5
```

**Réponse** :
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "property_id": 5,
      "author_name": "Jean",
      "rating": 5,
      "comment": "Excellente propriété !",
      "created_at": "2024-04-15 10:30:00"
    }
  ]
}
```

### POST - Ajouter un avis
```http
POST /api/reviews.php?action=add

Content-Type: application/json
{
  "property_id": 5,
  "author_name": "Jean",
  "author_email": "jean@example.com",
  "rating": 5,
  "comment": "Excellente propriété !"
}
```

### PUT - Approuver un avis (Admin)
```http
PUT /api/reviews.php?action=approve

Content-Type: application/json
{
  "id": 1
}
```

### DELETE - Supprimer un avis (Admin)
```http
DELETE /api/reviews.php?action=delete&id=1
```

---

## 🎉 `/api/promotions.php` - Gestion des Promotions

### GET - Récupérer les promotions actives
```http
GET /api/promotions.php?action=active
```

**Réponse** :
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "property_id": 5,
      "titre": "Villa Côtonou",
      "description": "-20% cette semaine !",
      "discount_percent": 20,
      "start_date": "2024-04-15",
      "end_date": "2024-04-22"
    }
  ]
}
```

### POST - Créer une promotion
```http
POST /api/promotions.php?action=add

Content-Type: application/json
{
  "property_id": 5,
  "description": "-30% pour 10 jours",
  "discount_percent": 30,
  "start_date": "2024-04-15",
  "end_date": "2024-04-25"
}
```

### PUT - Modifier une promotion
```http
PUT /api/promotions.php?action=update

Content-Type: application/json
{
  "id": 1,
  "description": "Nouvelle description",
  "discount_percent": 25,
  "active": 1
}
```

### DELETE - Supprimer une promotion
```http
DELETE /api/promotions.php?action=delete&id=1
```

---

## 🏨 `/api/reservations.php` - Gestion des Réservations

### GET - Lister les réservations
```http
GET /api/reservations.php
```

**Ou par propriété** :
```http
GET /api/reservations.php?action=by_property&property_id=5
```

**Réponse** :
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "property_id": 5,
      "guest_name": "Marie",
      "guest_email": "marie@example.com",
      "guest_phone": "2342767890",
      "check_in": "2024-04-20",
      "check_out": "2024-04-25",
      "number_of_guests": 4,
      "total_price": 500000,
      "status": "confirmed"
    }
  ]
}
```

### POST - Créer une réservation
```http
POST /api/reservations.php?action=add

Content-Type: application/json
{
  "property_id": 5,
  "guest_name": "Marie",
  "guest_email": "marie@example.com",
  "guest_phone": "2342767890",
  "check_in": "2024-04-20",
  "check_out": "2024-04-25",
  "number_of_guests": 4,
  "total_price": 500000
}
```

### PUT - Changer le statut
```http
PUT /api/reservations.php?action=update_status

Content-Type: application/json
{
  "id": 1,
  "status": "confirmed"
}
```

**Statuts disponibles** : `pending`, `confirmed`, `checked_in`, `checked_out`, `cancelled`

### DELETE - Annuler une réservation
```http
DELETE /api/reservations.php?action=cancel&id=1
```

---

## 👥 `/api/users.php` - Gestion des Utilisateurs

### GET - Lister les utilisateurs
```http
GET /api/users.php
```

### GET - Utilisateur spécifique
```http
GET /api/users.php?id=5
```

### POST - Créer un utilisateur
```http
POST /api/users.php?action=add

Content-Type: application/json
{
  "email": "nouveau@example.com",
  "password": "SecurePassword123!",
  "nom": "John Doe",
  "telephone": "2342121212",
  "role": "commercial"
}
```

### PUT - Modifier un utilisateur
```http
PUT /api/users.php?action=update

Content-Type: application/json
{
  "id": 5,
  "nom": "John Doe",
  "telephone": "2342121212",
  "role": "admin"
}
```

### DELETE - Supprimer un utilisateur
```http
DELETE /api/users.php?action=delete&id=5
```

---

## 📍 `/api/locations.php` - Gestion des Localités

### GET - Lister les villes
```http
GET /api/locations.php
```

**Réponse** :
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "ville": "Cotonou",
      "departement": "Littoral",
      "quartier": "Plateau"
    }
  ]
}
```

### POST - Ajouter une localité
```http
POST /api/locations.php?action=add

Content-Type: application/json
{
  "ville": "Parakou",
  "departement": "Borgou",
  "quartier": "Centre"
}
```

### DELETE - Supprimer une localité
```http
DELETE /api/locations.php?action=delete&id=1
```

---

## 💬 `/api/contact.php` - Messages de Contact

### GET - Lister les messages
```http
GET /api/contact.php
```

### POST - Soumettre un message
```http
POST /api/contact.php?action=send

Content-Type: application/json
{
  "nom": "Jean",
  "email": "jean@example.com",
  "telephone": "2342121212",
  "objet": "Demande d'information",
  "message": "J'ai une question..."
}
```

### PUT - Marquer comme lu
```http
PUT /api/contact.php?action=mark_read

Content-Type: application/json
{
  "id": 5
}
```

### DELETE - Supprimer un message
```http
DELETE /api/contact.php?action=delete&id=5
```

---

## 🔐 `/api/auth.php` - Authentification

### POST - Login
```http
POST /api/auth.php?action=login

Content-Type: application/json
{
  "email": "admin@niressehouse.com",
  "password": "Admin@2024"
}
```

**Réponse** :
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "admin@niressehouse.com",
    "nom": "Admin",
    "role": "super_admin"
  },
  "token": "jwt_token_here"
}
```

### GET - Récupérer la session
```http
GET /api/auth.php?action=session
```

### POST - Logout
```http
POST /api/auth.php?action=logout
```

---

## 📊 `/api/statistics.php` - Statistiques

### GET - Récupérer les statistiques
```http
GET /api/statistics.php
```

**Réponse** :
```json
{
  "success": true,
  "data": {
    "total_properties": 145,
    "total_users": 320,
    "total_reservations": 89,
    "total_messages": 254,
    "by_type": [
      {"type": "villa", "count": 45},
      {"type": "maison", "count": 60}
    ],
    "by_city": [
      {"ville": "Cotonou", "count": 70},
      {"ville": "Parakou", "count": 35}
    ],
    "avg_price": 125000,
    "monthly_visits": 1500
  }
}
```

---

## 🛡️ Codes de Réponse HTTP

| Code | Sens |
|------|------|
| 200 | OK - Succès |
| 201 | Created - Ressource créée |
| 400 | Bad Request - Erreur dans les données |
| 401 | Unauthorized - Non authentifié |
| 403 | Forbidden - Non autorisé |
| 404 | Not Found - Ressource non trouvée |
| 405 | Method Not Allowed - Méthode non supportée |
| 500 | Server Error - Erreur serveur |

---

## 📋 Format d'Erreur Standard

Toutes les erreurs retournent ce format :
```json
{
  "success": false,
  "error": "Description de l'erreur"
}
```

---

## 🔑 Authentification

La plupart des endpoints admin nécessitent l'authentification par session :
- Login d'abord via `/api/auth.php?action=login`
- Les cookies de session sont automatiquement envoyés
- Utilisez des tokens JWT en production

---

## 📝 Exemples cURL

### Chercher des villas à Cotonou
```bash
curl "http://localhost/api/properties.php?type=villa&ville=Cotonou"
```

### Récupérer les avis d'une propriété
```bash
curl "http://localhost/api/reviews.php?action=get_by_property&property_id=5"
```

### Login admin
```bash
curl -X POST "http://localhost/api/auth.php?action=login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@niressehouse.com","password":"Admin@2024"}'
```

### Créer une promotion
```bash
curl -X POST "http://localhost/api/promotions.php?action=add" \
  -H "Content-Type: application/json" \
  -d '{
    "property_id": 5,
    "description": "Promotion spéciale",
    "discount_percent": 20,
    "start_date": "2024-04-15",
    "end_date": "2024-04-22"
  }'
```

---

## 🚀 Notes de Production

1. **Changez les secrets** dans `public/api/config.php`
2. **Activez HTTPS** pour sécuriser les communications
3. **Validez tous les inputs** côté serveur
4. **Limitez le rate limiting** pour éviter les abus
5. **Utilisez des tokens JWT** au lieu de sessions
6. **Logez les accès** pour l'audit
7. **Backupez la base de données** régulièrement

---

**NiresseHouse © 2024 - API v1.0**
