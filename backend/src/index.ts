import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./config/db.js"; // 

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("🚀 Backend corriendo correctamente");
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
});
