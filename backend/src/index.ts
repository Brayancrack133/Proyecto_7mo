import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./config/db.js";

import projectRoutes from "./routes/project.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());

// Rutas API
app.use("/api/projects", projectRoutes);

// Ruta simple para probar servidor
app.get("/", (req, res) => {
  res.send("🚀 Backend FuturePlan funcionando!");
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);

  db.getConnection()
    .then(() => console.log("💾 Conectado a MySQL con éxito"))
    .catch(err => console.error("❌ Error conectando a MySQL:", err));
});
