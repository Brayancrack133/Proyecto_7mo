import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./config/db.js";

// Importamos rutas
import proyectosRoutes from "./routes/proyectos.routes.js";
import tareasRoutes from "./routes/tareas.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// --- RUTAS ---
app.use("/api/proyectos", proyectosRoutes);
app.use("/api/tareas", tareasRoutes);
app.use("/api/auth", authRoutes);

// Ruta simple de prueba
app.get("/", (req, res) => {
  res.send("🚀 Backend funcionando y DB conectada");
});

// --- Obtener proyectos de un usuario ---
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
