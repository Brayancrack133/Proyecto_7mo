import mysql, { type Connection, type PoolOptions } from 'mysql2';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// --- PASO 1: CARGAR VARIABLES DE ENTORNO ---
// Usamos el path.join para simplificar, asumiendo que el .env está en la raíz del backend.
// NOTA: Si tu archivo .env está en la raíz de 'adm_proyecto' (y no en 'adm_proyecto/backend'), 
// deberás ajustar esta ruta. Aquí asumimos que está en la raíz de 'backend'.
const dotenvResult = dotenv.config({ 
    path: path.join(process.cwd(), '.env') 
});

if (dotenvResult.error) {
    console.warn("⚠️ Advertencia: No se encontró el archivo .env o hubo un error al cargarlo.");
    // No lanzamos un error fatal aquí, permitimos que getEnvVar maneje la falta.
}

// --- PASO 2: CONFIGURACIÓN DE UTILIDADES ---
// Configuración de __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// FUNCIÓN HELPER: Validar que las variables de entorno existan
function getEnvVar(key: string): string {
  const value = process.env[key];
  if (value === undefined || value === '') {
    // Es CRUCIAL que este throw NO OCURRA durante la carga del módulo (sync)
    // El error general que viste suele ser causado por este tipo de throws.
    console.error(`❌ Variable de entorno ${key} no definida o vacía. Deteniendo ejecución.`);
    process.exit(1); // Usar process.exit en lugar de throw para un mejor manejo en Node.
  }
  return value;
}

// ============================================================================
// CONFIGURACIÓN DE LA BASE DE DATOS
// ============================================================================
// Verificamos que las variables de entorno estén disponibles
const host = getEnvVar('DB_HOST');
const user = getEnvVar('DB_USER');
const password = process.env.DB_PASSWORD || ''; // Manejo de contraseña vacía
const database = getEnvVar('DB_NAME');
const port = Number(getEnvVar('DB_PORT')); // Usamos getEnvVar para asegurar que el puerto existe
const timezone = '+00:00';

// ============================================================================
// EXPORTAR CONEXIÓN SIMPLE
// ============================================================================
export const db: Connection = mysql.createConnection({
  host,
  user,
  password,
  database,
  port,
  timezone
});

// Probar conexión al iniciar
db.connect((err) => {
  if (err) {
    console.error('❌ Error al conectar a MySQL:', err.message);
    console.error('   Verifica tu archivo .env y que MySQL esté corriendo');
    return;
  }
  console.log('✅ Conexión a MySQL exitosa 🎉');
  console.log(`   Base de datos: ${database}`);
});

// ============================================================================
// EXPORTAR POOL DE CONEXIONES CON PROMESAS
// ============================================================================
const poolConfig: PoolOptions = {
  host,
  user,
  password,
  database,
  port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone
};

export const pool = mysql.createPool(poolConfig).promise();

// ============================================================================
// EXPORTAR POR DEFECTO
// ============================================================================
export default db;