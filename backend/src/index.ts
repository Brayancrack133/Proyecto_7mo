import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./config/db.js"; // SOLO importar para inicializar conexión
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("🚀 Backend funcionando y DB conectada");
});

app.listen(PORT, () => {
  console.log(`🔥 Servidor escuchando en puerto ${PORT}`);
});
