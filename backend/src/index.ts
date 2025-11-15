import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./config/db.js"; // SOLO importar para inicializar conexión

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("🚀 Backend funcionando y DB conectada");
});

app.listen(PORT, () => {
  console.log(`🔥 Servidor escuchando en puerto ${PORT}`);
});
