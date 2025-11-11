import mysql, { type Connection, type ConnectionOptions } from "mysql2";
import dotenv from "dotenv";

import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carga el .env desde la raíz del backend
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Helper para obtener variables de entorno
function getEnvVar(key: string, allowEmpty = false): string {
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`❌ Variable de entorno ${key} no definida`);
  }
  if (!value && allowEmpty) {
    console.warn(`⚠️ Variable ${key} está vacía`);
    return "";
  }
  if (!value && !allowEmpty) {
    throw new Error(`❌ Variable de entorno ${key} no puede estar vacía`);
  }
  return value;
}

const dbConfig: ConnectionOptions = {
  host: getEnvVar("DB_HOST"),
  user: getEnvVar("DB_USER"),
  password: getEnvVar("DB_PASSWORD", true), // ✅ Permitir vacía
  database: getEnvVar("DB_NAME"),
  port: Number(process.env.DB_PORT) || 3306, // 🔹 Aseguramos el puerto
};

export const db: Connection = mysql.createConnection(dbConfig);

// Prueba de conexión
db.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar a la base de datos:", err);
  } else {
    console.log("✅ Conectado a la base de datos MySQL");
  }
});
