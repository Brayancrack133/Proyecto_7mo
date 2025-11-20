// ===============================
//  db.ts — Conexión MySQL2 + TS
// ===============================

import mysql from "mysql2";
import type { PoolOptions, Connection } from "mysql2";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// -----------------------------
//   CARGA DEL ARCHIVO .env
// -----------------------------
dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

// -----------------------------
//   __dirname para ES Modules
// -----------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -----------------------------
//   Fun. helper para validar env
// -----------------------------
function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    console.error(`❌ ERROR: Falta variable de entorno: ${key}`);
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

// -----------------------------
//   Variables de entorno
// -----------------------------
const host = getEnvVar("DB_HOST");
const user = getEnvVar("DB_USER");
const password = process.env.DB_PASSWORD || ""; // Puede estar vacío
const database = getEnvVar("DB_NAME");
const port = Number(getEnvVar("DB_PORT"));
const timezone = "+00:00";

// -----------------------------
//   Conexión simple (db)
// -----------------------------
export const db: Connection = mysql.createConnection({
  host,
  user,
  password,
  database,
  port,
  timezone,
});

// Log de conexión simple
db.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar a MySQL:", err.message);
    console.error("🔍 Revisa el archivo .env y el servidor MySQL");
  } else {
    console.log(`✅ Conectado a MySQL — DB: ${database}`);
  }
});

// -----------------------------
//   Pool promisificado (pool)
// -----------------------------
const poolConfig: PoolOptions = {
  host,
  user,
  password,
  database,
  port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone,
};

// 👇 ESTE pool YA TIENE promesas
export const pool = mysql.createPool(poolConfig).promise();

// Export default (opcional)
export default db;
