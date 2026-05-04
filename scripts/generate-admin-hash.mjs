// Script de génération du hash bcrypt pour le mot de passe admin
// Usage: node scripts/generate-admin-hash.mjs
// Ce script génère le hash bcryptjs compatible avec Node.js (bcryptjs)

import bcrypt from "bcryptjs"

const PASSWORD = "admin123"
const SALT_ROUNDS = 10

const hash = await bcrypt.hash(PASSWORD, SALT_ROUNDS)

console.log("\n========================================")
console.log("  Hash bcryptjs pour le mot de passe admin")
console.log("========================================")
console.log(`\nMot de passe : ${PASSWORD}`)
console.log(`Hash bcryptjs : ${hash}`)
console.log(`\nCommande SQL à exécuter dans phpMyAdmin :`)
console.log(`\nUPDATE users SET mot_de_passe = '${hash}' WHERE email = 'niressedigital@gmail.com';`)
console.log("\n========================================\n")

// Vérification
const isValid = await bcrypt.compare(PASSWORD, hash)
console.log(`Vérification : ${isValid ? "OK - le hash est correct" : "ERREUR - le hash est incorrect"}\n`)
