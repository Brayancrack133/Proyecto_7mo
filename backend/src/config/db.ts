import mysql from "mysql2";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargamos las variables. Asegúrate que la ruta "../../.env" sea la correcta
// según donde esté este archivo guardado.
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const db = mysql
  .createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 4000, // TiDB usa el 4000, no el 3306
    
    // 🔥 ESTO ES LO QUE FALTABA Y ES OBLIGATORIO PARA TIDB:
    ssl: {
      rejectUnauthorized: true,
      minVersion: 'TLSv1.2'
    },
    
    // Configuraciones para que la conexión no se caiga
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  })
  .promise();

// Probar conexión
db.getConnection()
  .then((conn) => {
    console.log("✅ Conexión a TiDB Cloud exitosa 🎉");
    conn.release(); // Liberamos la conexión de prueba
  })
  .catch((err) =>
    console.error("❌ Error al conectar a la Base de Datos:", err.message)
  );