import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

// Intentamos cargar el .env buscando explícitamente en la carpeta actual
console.log("📂 Buscando archivo .env en:", path.resolve(process.cwd(), '.env'));
const result = dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// --- ZONA DE DEPURACIÓN (MIRA ESTO EN TU CONSOLA) ---
console.log("----------------------------------------");
console.log("🔍 ESTADO DE VARIABLES DE ENTORNO:");
if (result.error) {
    console.log("❌ ERROR: No se pudo cargar el archivo .env");
} else {
    console.log("✅ Archivo .env cargado correctamente");
}
console.log("HOST:", process.env.DB_HOST || "UNDEFINED (Usando localhost por defecto)");
console.log("USER:", process.env.DB_USER || "UNDEFINED");
console.log("PORT:", process.env.DB_PORT || "3306");
console.log("----------------------------------------");

// Configuración del Pool
export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 4000,
  ssl: {
    rejectUnauthorized: true
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});