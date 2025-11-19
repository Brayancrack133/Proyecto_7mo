// ...existing code...
import mysql, { type Connection } from "mysql2";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ...existing code...
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Crear conexión
export const db: Connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "db_futureplan",
  port: Number(process.env.DB_PORT) || 3306,
});
// ...existing code...
// Probar conexión
db.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar a MySQL:", err.message);
    return;
  }
  console.log("✅ Conexión a MySQL exitosa 🎉");
});

import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// Validar variables de entorno
function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ Variable de entorno ${key} no definida`);
  }
  return value;
}

// Pool con promesas
export const db = mysql.createPool({
  host: getEnvVar('DB_HOST'),
  user: getEnvVar('DB_USER'),
  password: getEnvVar('DB_PASSWORD'),
  database: getEnvVar('DB_NAME'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00',
}).promise(); // 👈 SUPER IMPORTANTE
