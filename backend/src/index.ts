import express from "express";
import cors from "cors";
import proyectosRoutes from "./routes/projectos.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/proyectos", proyectosRoutes);

app.listen(3000, () => console.log("Servidor en puerto 3000"));
