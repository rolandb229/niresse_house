# Checklist de Déploiement - NiresseHouse

Suivez ce checklist avant de déployer NiresseHouse en production.

---

## 🔐 Sécurité (CRITIQUE)

- [ ] Changez les mots de passe par défaut
  ```sql
  UPDATE users SET password_hash = SHA2('NewPassword123!', 256) 
  WHERE email = 'admin@niressehouse.com';
  ```

- [ ] Générez une nouvelle `JWT_SECRET` dans `.env.local`
  ```bash
  openssl rand -base64 32
  ```

- [ ] Activez HTTPS sur le serveur
  ```
  ☐ Certificat SSL/TLS valide
  ☐ Redirection HTTP → HTTPS
  ☐ HSTS header activé
  ```

- [ ] Sécurisez la base de données
  ```
  ☐ Changez le mot de passe root MySQL
  ☐ Supprimez l'utilisateur MySQL anonyme
  ☐ Restreignez l'accès à la BD (localhost seulement)
  ☐ Activez les logs de la BD
  ```

- [ ] Configurez les en-têtes de sécurité
  ```
  ☐ Content-Security-Policy
  ☐ X-Frame-Options
  ☐ X-Content-Type-Options
  ☐ X-XSS-Protection
  ```

- [ ] Protégez les fichiers sensibles
  ```
  ☐ .env.local n'est pas accessible via le web
  ☐ Les clés privées ne sont pas versionées
  ☐ Les logs ne contiennent pas de données sensibles
  ```

---

## 🗄️ Base de Données

- [ ] Importez le schéma SQL complet
  ```bash
  mysql -u root -p niressehouse < scripts/niressehouse.sql
  ```

- [ ] Vérifiez les données par défaut
  - [ ] Au moins 1 utilisateur admin
  - [ ] Au moins 5 propriétés de test
  - [ ] Localités complètes (villes + départements)

- [ ] Mettez à jour les connexions
  ```
  ☐ DB_HOST = IP serveur (pas localhost)
  ☐ DB_USER = Utilisateur dédié (pas root)
  ☐ DB_PASS = Mot de passe fort
  ☐ DB_NAME = niressehouse
  ```

- [ ] Configurez les sauvegardes
  ```
  ☐ Sauvegarde quotidienne
  ☐ Sauvegarde hors site
  ☐ Plan de restauration testé
  ```

- [ ] Optimisez les performances
  ```sql
  ☐ CREATE INDEX idx_properties_type ON properties(type);
  ☐ CREATE INDEX idx_properties_ville ON properties(ville_id);
  ☐ CREATE INDEX idx_reservations_property ON reservations(property_id);
  ☐ CREATE INDEX idx_reviews_property ON reviews(property_id);
  ```

---

## 🚀 Frontend (Next.js)

- [ ] Build de production
  ```bash
  pnpm run build
  pnpm run start
  ```

- [ ] Testez les pages statiques
  - [ ] Homepage `/`
  - [ ] Page recherche `/recherche`
  - [ ] Page promotions `/promotions`
  - [ ] Page détail bien `/bien/1`

- [ ] Vérifiez les variables d'environnement
  ```
  ☐ NEXT_PUBLIC_API_URL pointe vers la bonne API
  ☐ Pas de console.log("[v0]") en prod
  ☐ Mode développement désactivé
  ```

- [ ] Optimisez les images
  ```
  ☐ Images compressées (< 500KB)
  ☐ Format WebP pour les navigateurs modernes
  ☐ Lazy loading activé
  ```

- [ ] Testez la performance
  ```
  ☐ Lighthouse score > 80
  ☐ Core Web Vitals optimisés
  ☐ Temps de chargement < 3s
  ```

---

## 🔌 APIs PHP

- [ ] Testez tous les endpoints
  ```bash
  ☐ GET /api/properties.php
  ☐ GET /api/reviews.php
  ☐ POST /api/auth.php
  ☐ GET /api/statistics.php
  ```

- [ ] Validez les réponses
  ```
  ☐ JSON valide
  ☐ Codes HTTP corrects
  ☐ Gestion d'erreurs appropriée
  ☐ CORS configuré correctement
  ```

- [ ] Sécurisez les APIs
  ```
  ☐ Rate limiting activé
  ☐ Input validation en place
  ☐ SQL injection prevention (prepared statements)
  ☐ CSRF protection activée
  ```

- [ ] Mettez à jour config.php
  ```php
  ☐ DB_HOST = IP correct
  ☐ DB_USER = Utilisateur dédié
  ☐ DB_PASS = Mot de passe fort
  ☐ ALLOWED_ORIGINS = Domaines autorisés
  ☐ DEBUG_MODE = false
  ```

---

## 📧 Email & Communication

- [ ] Configurez l'email de contact
  ```
  ☐ SMTP_HOST = serveur email
  ☐ SMTP_USER = adresse email
  ☐ SMTP_PASS = mot de passe app
  ☐ SMTP_PORT = 587 ou 465
  ```

- [ ] Testez les notifications
  - [ ] Confirmation de contact
  - [ ] Confirmation de réservation
  - [ ] Notification admin

- [ ] Configurez WhatsApp (optionnel)
  ```
  ☐ API key de Twilio/TalkingWhatsApp
  ☐ Numéro de téléphone vérifié
  ☐ Templates d'messages approuvés
  ```

---

## 👥 Utilisateurs & Rôles

- [ ] Créez les comptes administrateurs
  ```sql
  INSERT INTO users (email, password_hash, role, nom, telephone)
  VALUES ('admin@niressehouse.com', SHA2('Password123!', 256), 'super_admin', 'Admin', '0166369842');
  ```

- [ ] Testez chaque rôle
  - [ ] Super Admin (accès complet)
  - [ ] Admin (gestion majeure)
  - [ ] Commercial (ajout biens)
  - [ ] Client (lecture seule)

- [ ] Configurez les permissions
  ```
  ☐ Seul admin peut modifier biens
  ☐ Seul admin peut valider avis
  ☐ Seul super_admin peut créer admins
  ☐ Clients ne peuvent éditer leurs données
  ```

---

## 📊 Monitoring & Logs

- [ ] Configurez les logs
  ```
  ☐ Fichier de log unique
  ☐ Format: [timestamp] [level] [message]
  ☐ Rotation des logs (quotidienne)
  ☐ Rétention: 30 jours minimum
  ```

- [ ] Mettez en place le monitoring
  ```
  ☐ Vérification uptime
  ☐ Alertes sur erreurs 500
  ☐ Monitoring du disque
  ☐ Monitoring de la mémoire
  ☐ Alertes email en cas de problème
  ```

- [ ] Configurez les analytics
  ```
  ☐ Google Analytics installé
  ☐ Tracking des événements
  ☐ Dashboard de statistiques
  ```

---

## 🌐 DNS & Domaine

- [ ] Configurez le domaine
  ```
  ☐ Domaine pointant vers le serveur
  ☐ Certificat SSL/TLS valide
  ☐ Records DNS corrects (A, CNAME, MX)
  ☐ Subdomains configurés (www, api, admin)
  ```

- [ ] Testez l'accès
  ```bash
  nslookup niressehouse.com
  curl https://niressehouse.com
  ```

- [ ] Configurez les emails
  ```
  ☐ SPF record
  ☐ DKIM record
  ☐ DMARC policy
  ```

---

## 🧪 Tests Finaux

- [ ] Testez le flux complet utilisateur
  ```
  ☐ Accueil → Recherche → Détail bien → Contact
  ☐ Login admin → Ajout bien → Modification → Suppression
  ☐ Création réservation → Confirmation
  ☐ Ajout avis → Modération → Affichage
  ```

- [ ] Testez sur tous les navigateurs
  ```
  ☐ Chrome (dernière version)
  ☐ Firefox (dernière version)
  ☐ Safari (dernière version)
  ☐ Edge (dernière version)
  ☐ Mobile Chrome
  ☐ Mobile Safari
  ```

- [ ] Testez la performance
  ```
  ☐ Chargement page accueil < 3s
  ☐ Recherche < 2s
  ☐ Détail bien < 1.5s
  ☐ Pas de memory leak
  ```

- [ ] Testez la sécurité
  ```bash
  ☐ Tests SQL injection
  ☐ Tests XSS
  ☐ Tests CSRF
  ☐ Tests authentification
  ☐ Tests autorisation
  ```

---

## 🚨 Plan de Rollback

- [ ] Sauvegarde avant déploiement
  ```bash
  mysqldump -u root -p niressehouse > backup_2024-04-15.sql
  ```

- [ ] Point de restauration
  ```
  ☐ Backup complet de la BD
  ☐ Copie du code en version
  ☐ Procédure de restauration documentée
  ☐ Temps de restauration estimé
  ```

- [ ] Plan en cas de panne
  ```
  ☐ Personne responsable désignée
  ☐ Contacts d'urgence disponibles
  ☐ Procédure de communication (statut page)
  ☐ SLA cible: 4h maximum
  ```

---

## 📋 Documentation

- [ ] Mettez à jour la documentation
  - [ ] README.md ✅
  - [ ] INSTALLATION_GUIDE.md ✅
  - [ ] API_DOCUMENTATION.md ✅
  - [ ] QUICKSTART.md ✅

- [ ] Documentez les processus
  ```
  ☐ Processus de déploiement
  ☐ Processus d'ajout de bien
  ☐ Processus de modération
  ☐ Processus de gestion des réservations
  ☐ Plan de maintenance
  ```

- [ ] Créez les guides pour l'équipe
  ```
  ☐ Guide admin
  ☐ Guide commercial
  ☐ FAQ technique
  ☐ Procédure d'urgence
  ```

---

## ✅ Checklist Finale

- [ ] Tous les points de sécurité validés
- [ ] Base de données en bon état
- [ ] Frontend build en production
- [ ] APIs fonctionnelles et sécurisées
- [ ] Monitoring et logs configurés
- [ ] DNS et domaine opérationnels
- [ ] Tests finaux passés
- [ ] Plan de rollback en place
- [ ] Documentation complète
- [ ] Équipe formée et prête
- [ ] Contacts d'urgence disponibles

---

## 🚀 Déploiement

```bash
# 1. Vérifiez tous les points ci-dessus
# 2. Informez l'équipe
# 3. Déployez
pnpm run build
# 4. Testez en production
# 5. Activez le monitoring
# 6. Documentez le déploiement
```

---

## 📞 Informations de Contact

**NiresseHouse Support**
- 📧 niressedigital@gmail.com
- 📱 0166369842 (WhatsApp)
- 🕒 Lun-Sam 9h-18h (Heure Bénin)

---

**Date de déploiement** : _______________
**Responsable** : _______________
**Validé par** : _______________

**Bonne déploiement ! 🚀**

NiresseHouse © 2024
