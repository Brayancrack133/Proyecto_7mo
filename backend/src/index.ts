// index.ts

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// Solución al TypeError: Importa la exportación por defecto
import db from "./config/db.js"; 

// Importar rutas
import proyectosRoutes from "./routes/proyectos.routes.js";
import tareasRoutes from "./routes/tareas.routes.js";
import authRoutes from "./routes/auth.routes.js";

// Cargar variables de entorno (Solo aquí)
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// --- RUTAS PRINCIPALES ---
app.use("/api/proyectos", proyectosRoutes);
app.use("/api/tareas", tareasRoutes);
app.use("/api/auth", authRoutes);

// Ruta simple para comprobar servidor
app.get("/", async (req, res) => {
    // Usamos el pool 'db' importado por defecto
    res.send("🚀 Backend funcionando y DB conectada"); 
});

// --- Obtener proyectos de un usuario ---
app.get("/api/mis-proyectos/:idUsuario", async (req, res) => {
    // ... (Tu lógica de ruta usando db.query se mantiene igual)
});

// --- INICIAR SERVIDOR ---
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`🔥 Servidor escuchando en puerto ${PORT}`);
    
    // ❌ QUITAR: Se elimina el bloque de código de verificación de conexión. 
    // Ya se realiza en el archivo db.ts y causaba el TypeError.
    
    /* try {
        const conn = await db.getConnection();
        console.log("✅ Conectado a la base de datos MySQL");
        conn.release();
    } catch (err) {
        console.error("❌ Error conectando a MySQL:", err);
    }
    */
});