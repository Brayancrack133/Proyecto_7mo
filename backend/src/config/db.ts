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
