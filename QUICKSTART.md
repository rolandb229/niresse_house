# Démarrage Rapide - NiresseHouse

Vous avez 5 minutes ? Voici comment mettre en place NiresseHouse en local !

## ⚡ 5 Étapes Faciles

### 1️⃣ Prérequis (2 min)
Assurez-vous d'avoir :
- ✅ XAMPP installé et lancé (Apache + MySQL)
- ✅ Node.js v16+ (`node -v` pour vérifier)
- ✅ pnpm (`npm install -g pnpm`)

### 2️⃣ Importer la Base de Données (1 min)

#### Option A : Via phpMyAdmin (Graphique)
1. Ouvrez `http://localhost/phpmyadmin` dans votre navigateur
2. Connectez-vous (login: `root`, password: vide)
3. Cliquez sur l'onglet **"Importer"**
4. Sélectionnez le fichier `scripts/niressehouse.sql`
5. Cliquez sur **"Exécuter"** 🎉

#### Option B : En ligne de commande
```bash
# Ouvrez un terminal et exécutez :
mysql -u root -p < scripts/niressehouse.sql

# Appuyez sur Entrée quand demandé pour le password (vide)
```

### 3️⃣ Installer les Dépendances (1 min)
```bash
cd niressehouse
pnpm install
```

### 4️⃣ Lancer le Serveur (30 sec)
```bash
pnpm dev
```

### 5️⃣ Accédez au site (30 sec)
Ouvrez votre navigateur et allez à :
- **Frontend** : http://localhost:3000 ✅
- **Admin** : http://localhost:3000/admin (voir infos login plus bas)
- **phpMyAdmin** : http://localhost/phpmyadmin

---

## 🔑 Identifiants par Défaut

### Admin Login
```
Email : admin@niressehouse.com
Mot de passe : Admin@2024
Rôle : Super Admin
```

**⚠️ À CHANGER EN PRODUCTION !**

### Base de Données
```
Host : localhost
User : root
Password : (vide)
Database : niressehouse
```

---

## 📱 Vérifier que tout marche

1. Allez à http://localhost:3000
2. Vous devriez voir la homepage de NiresseHouse
3. Essayez une recherche (ex: "Villa")
4. Allez à `/admin` et connectez-vous
5. Vérifiez le dashboard admin

---

## 🐛 Problèmes courants

### "Erreur de connexion MySQL"
```
❌ MySQL n'est pas lancé dans XAMPP
✅ Ouvrez XAMPP, cliquez sur "Start" pour MySQL
```

### "La base de données n'existe pas"
```
❌ Vous n'avez pas importé niressehouse.sql
✅ Suivez l'étape 2️⃣ ci-dessus
```

### "Port 3000 déjà utilisé"
```
❌ Quelque chose d'autre utilise le port 3000
✅ Changez le port : pnpm dev -- -p 3001
```

### "Erreur : Cannot find module"
```
❌ Vous n'avez pas installé les dépendances
✅ Exécutez : pnpm install
```

---

## 🚀 Étapes suivantes

Après le démarrage :

1. **Modifier les informations de l'entreprise**
   - Éditez `lib/db.ts` (ligne: `COMPANY_INFO`)
   - Ou créez un `.env.local` en copiant `.env.example`

2. **Ajouter des biens**
   - Allez à `/admin/biens`
   - Cliquez "Ajouter un bien"
   - Remplissez le formulaire

3. **Personnaliser le design**
   - Changez les couleurs dans `app/globals.css`
   - Modifiez les fonts dans `app/layout.tsx`

4. **Ajouter vos images**
   - Placez les images dans `public/images/`
   - Référencez-les dans les formulaires d'ajout

---

## 📚 Documentation Complète

Pour plus de détails, consultez :
- **INSTALLATION_GUIDE.md** - Guide d'installation complet
- **README.md** - Documentation générale du projet
- **public/api/** - Documentations des APIs PHP

---

## 💡 Astuces

### Arrêter le serveur
```bash
# Appuyez sur Ctrl + C dans le terminal
```

### Redémarrer le serveur
```bash
# Appuyez sur Ctrl + C
# Puis : pnpm dev
```

### Accéder à la base de données
```bash
mysql -u root
USE niressehouse;
SELECT * FROM properties;
```

### Réinitialiser la base de données
```bash
# Supprimer et réimporter
mysql -u root -e "DROP DATABASE niressehouse;"
mysql -u root -p < scripts/niressehouse.sql
```

---

## 📞 Besoin d'aide ?

Si vous rencontrez un problème non listé ici :
- 📧 niressedigital@gmail.com
- 📱 0166369842 (WhatsApp)

---

**Prêt à démarrer ? Lancez `pnpm dev` et profitez ! 🎉**

NiresseHouse © 2024
