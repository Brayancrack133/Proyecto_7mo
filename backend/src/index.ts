import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./config/db.js";

// --- IMPORTACIONES (Fusionadas) ---
import path from "path";
import { fileURLToPath } from 'url';

// Rutas
import proyectosRoutes from "./routes/proyectos.routes.js";
import tareasRoutes from "./routes/tareas.routes.js";
import authRoutes from "./routes/auth.routes.js"; // Nuevo de Main
import documentosRoutes from "./routes/documentos.routes.js"; // Tuyo
import notificacionesRoutes from "./routes/notificaciones.routes.js"; // Tuyo
import chatRoutes from "./routes/chat.routes.js"; // Tuyo

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// --- DEFINICIÓN DE RUTAS ---

// 1. Rutas Estándar del equipo (Main)
// Nota: Tus compañeros cambiaron "/api" por "/api/proyectos".
// Si tu frontend falla al cargar proyectos, revisa si necesitas ajustar la URL ahí.
app.use("/api/proyectos", proyectosRoutes);
app.use("/api/tareas", tareasRoutes);
app.use("/api/auth", authRoutes);

// 2. Tus Rutas Nuevas (HEAD)
app.use("/api", notificacionesRoutes);
app.use("/api", chatRoutes);
app.use("/api", documentosRoutes);

// 3. Configuración de Archivos Estáticos (Uploads)
// Definimos __dirname para ES Modules por si lo necesitas, aunque express.static directo funciona
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static('uploads'));

// Ruta simple de prueba
app.get("/", (req, res) => {
  res.send("🚀 Backend funcionando y DB conectada");
});

// --- Obtener proyectos de un usuario (Query Manual) ---
app.get("/api/mis-proyectos/:idUsuario", async (req, res) => {
  const { idUsuario } = req.params;

  try {
    const [rows]: any = await db.query(
      `
      SELECT DISTINCT 
          p.id_proyecto,
          p.nombre,
          p.fecha_creacion,
          IF(p.id_jefe = ?, 'Líder', 'Integrante') AS rol
      FROM proyectos p
      JOIN miembros_equipo me ON p.id_equipo = me.id_equipo
      WHERE me.id_usuario = ?
      `,
      [idUsuario, idUsuario]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo proyectos" });
  }
});

// --- INICIAR SERVIDOR ---
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🔥 Servidor escuchando en puerto ${PORT}`);

  db.connect((err) => {
    if (err) {
      console.error("❌ Error de conexión a la base de datos:", err);
    } else {
      console.log("✅ Conectado a la base de datos MySQL");
    }
  });
});