import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./config/db.js";
import path from "path";
import { fileURLToPath } from 'url';

// Importamos las rutas
import proyectosRoutes from "./routes/proyectos.routes.js";
import tareasRoutes from "./routes/tareas.routes.js";
import authRoutes from "./routes/auth.routes.js";
import documentosRoutes from "./routes/documentos.routes.js";
import notificacionesRoutes from "./routes/notificaciones.routes.js";
import chatRoutes from "./routes/chat.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// --- DEFINICIÓN DE RUTAS ---
app.use("/api/proyectos", proyectosRoutes);
app.use("/api/tareas", tareasRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", notificacionesRoutes);
app.use("/api", chatRoutes);
app.use("/api", documentosRoutes);

// Configuración de uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static('uploads'));

// Ruta simple de prueba
app.get("/", (req, res) => {
  res.send("🚀 Backend funcionando y DB conectada");
});

// Ruta para obtener proyectos (Corregida a async/await)
app.get("/api/mis-proyectos/:idUsuario", async (req, res) => {
  const { idUsuario } = req.params;

  try {
    const [rows]: any = await db.query(
      `
      SELECT DISTINCT 
          p.id_proyecto,
          p.nombre,
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

app.listen(PORT, async () => {
  console.log(`🔥 Servidor escuchando en puerto ${PORT}`);

  // Verificación de conexión moderna
  try {
    const connection = await db.getConnection();
    console.log("✅ Conectado a la base de datos MySQL");
    connection.release();
  } catch (err) {
    console.error("❌ Error conectando a la BD:", err);
  }
});