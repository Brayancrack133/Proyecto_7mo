import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./config/db.js";

// Importamos las rutas
import proyectosRoutes from "./routes/proyectos.routes.js";
import tareasRoutes from "./routes/tareas.routes.js"; 
import "./config/db.js"; // SOLO importar para inicializar conexión
import authRoutes from "./routes/auth.routes.js";

dotenv.config();
import proyectosRoutes from "./routes/projectos.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// --- DEFINICIÓN DE RUTAS ---
app.use("/api", proyectosRoutes); // Para /mis-proyectos
app.use("/api", tareasRoutes);    // Para /tareas
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("🚀 Backend funcionando y DB conectada");
});
app.use("/api/proyectos", proyectosRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  db.connect((err) => {
    if (err) {
      console.error("❌ Error de conexión a la base de datos:", err);
    } else {
      console.log("✅ Conectado a la base de datos MySQL");
    }
  });
});


// Obtener proyectos de un usuario
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

  console.log(`🔥 Servidor escuchando en puerto ${PORT}`);
});

app.listen(3000, () => console.log("Servidor en puerto 3000"));
