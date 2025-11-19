import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./config/db.js";  // ← Importante: .js no .ts

import proyectosRoutes from "./routes/proyectos.routes.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", proyectosRoutes);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Backend corriendo correctamente 🚀");
});

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
