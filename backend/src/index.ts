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
import userRoutes from "./routes/usuarios.routes.js";
import roleRoutes from "./routes/roles.routes.js";

const app = express();

// 🔥 Middlewares SIEMPRE primero
app.use(cors());
app.use(express.json());

// 🔥 Ahora sí, rutas
app.use("/api/auth", authRoutes);
app.use("/api/proyectos", proyectosRoutes);
app.use("/api/tareas", tareasRoutes);
app.use("/api/usuarios", userRoutes);
app.use("/api/roles", roleRoutes);

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
