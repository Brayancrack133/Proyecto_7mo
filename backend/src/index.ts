import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Inicializar variables de entorno
dotenv.config();

// Inicializar DB (solo importarla para conectarse)
import "./config/db.js";

// Importar rutas
import authRoutes from "./routes/auth.routes.js";
import proyectosRoutes from "./routes/proyectos.routes.js"; 
import tareasRoutes from "./routes/tareas.routes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas principales
app.use("/api/auth", authRoutes);
app.use("/api/proyectos", proyectosRoutes);
app.use("/api/tareas", tareasRoutes);

// Ruta base
app.get("/", (req, res) => {
  res.send("🚀 Backend funcionando y DB conectada");
});

// Puerto
const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🔥 Servidor escuchando en puerto ${PORT}`);
});
