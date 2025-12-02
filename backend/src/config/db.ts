import mysql from "mysql2";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargamos las variables de entorno
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// 1. CONFIGURACIÓN DEL POOL (Usamos TUS datos de TiDB)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 4000, // TiDB usa 4000
    
    // 🔥 SSL OBLIGATORIO PARA TIDB (Esto viene de tu rama)
    ssl: {
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2'
    },
    
    // Configuraciones de estabilidad
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 2. EXPORTACIONES (Estructura del MAIN para compatibilidad)

// Exportación principal (Promesas) - La que usas tú
export const db = pool.promise();

// Exportación secundaria (Callbacks) - La que usan ellos (Probablemente para Passport)
export const dbRaw: any = pool; 

// 3. TEST DE CONEXIÓN
db.getConnection()
  .then((conn) => {
    console.log("✅ Conexión a TiDB Cloud exitosa 🎉");
    conn.release(); // Liberamos la conexión
  })
  .catch((err) => {
    console.error("❌ Error al conectar a la Base de Datos:", err.message);
  });