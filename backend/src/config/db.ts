import mysql, { PoolOptions } from 'mysql2/promise'; // <--- IMPORTANTE: Importamos desde /promise
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// --- CONFIGURACIÓN DE ENTORNO ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Intentamos cargar el .env
dotenv.config({ path: path.join(process.cwd(), '.env') });

function getEnvVar(key: string): string {
  const value = process.env[key];
  if (value === undefined || value === '') {
    // Si falta una variable, avisamos pero usamos un default para que no explote compilación
    console.warn(`⚠️ Variable ${key} no definida. Usando valor por defecto o vacío.`);
    return '';
  }
  return value;
}

// --- CONFIGURACIÓN DE LA BASE DE DATOS ---
const poolConfig: PoolOptions = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gestion_proyectos', // Ajusta si tu nombre es diferente
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00'
};

// --- CREACIÓN DEL POOL (PROMESAS) ---
export const pool = mysql.createPool(poolConfig);

// --- EXPORTAR "db" COMO ALIAS DE "pool" ---
// Esto soluciona que 'documentos.routes.ts' pueda usar await con 'db'
export const db = pool;

export default pool;