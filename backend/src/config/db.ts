// config/db.ts

import mysql from "mysql2/promise";
// import dotenv from "dotenv"; // ❌ Eliminar
// import path from "path";     // ❌ Eliminar

// dotenv.config({ path: path.join(process.cwd(), ".env") }); // ❌ Eliminar

// Helper para variables de entorno (Lo mantienes)
const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    // Este error solo debería ocurrir si la carga en index.ts falló
    console.error(`❌ Variable de entorno ${key} no definida.`); 
    process.exit(1);
  }
  return value;
};

// Cargar variables
const host = getEnvVar("DB_HOST");
const user = getEnvVar("DB_USER");
const password = process.env.DB_PASSWORD || "";
const database = getEnvVar("DB_NAME");
const port = Number(getEnvVar("DB_PORT"));

// --- POOL CON PROMESAS ---
const dbPool = mysql.createPool({ // 👈 Cambiado a 'dbPool'
  host,
  user,
  password,
  database,
  port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: "+00:00"
});

// Probar conexión al iniciar
dbPool.getConnection()
  .then(conn => {
    console.log("✅ MySQL Pool creado y conectado");
    conn.release();
  })
  .catch(err => {
    // Es importante salir si la DB es crítica
    console.error("❌ Error inicial conectando a MySQL:", err.message);
    process.exit(1); 
  });

// Exportar solo el pool
export default dbPool; // 👈 Exportación por defecto