import mysql from "mysql2";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "db_futureplan",
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Exportación para tu líder (Promesas)
export const db = pool.promise();

// Exportación para ti (Callbacks)
// EL ": any" ES CRUCIAL AQUÍ. SI NO ESTÁ, FALLARÁ.
export const dbRaw: any = pool; 

// Log de conexión
db.getConnection()
  .then(() => console.log("✅ Conexión a MySQL exitosa 🎉"))
  .catch((err) => console.error("❌ Error al conectar a MySQL:", err.message));