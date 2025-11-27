import { Router } from "express";
import { generarDetallesProyecto } from "../controllers/proyectosIA.controller.js"; 

const router = Router();

// Ruta POST: http://localhost:3000/api/proyectos-ia/generar
router.post("/generar", generarDetallesProyecto);

export default router;