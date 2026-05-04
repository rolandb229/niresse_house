// ============================================================
// Connexion MySQL centralisée – NiresseHouse
// Compatible XAMPP (host: localhost, user: root, password: '')
// Base de données : niressehouse
// ============================================================

import mysql from "mysql2/promise"

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "niressehouse",
  port: Number(process.env.MYSQL_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4",
})

export default pool

// Helper : exécuter une requête et renvoyer les lignes
export async function query<T = Record<string, unknown>>(
  sql: string,
  params?: unknown[]
): Promise<T[]> {
  const [rows] = await pool.execute(sql, params)
  return rows as T[]
}

// Helper : exécuter une requête et renvoyer le résultat complet (insert/update/delete)
export async function execute(sql: string, params?: unknown[]) {
  const [result] = await pool.execute(sql, params)
  return result as mysql.ResultSetHeader
}
