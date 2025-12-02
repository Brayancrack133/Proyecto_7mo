import { Router } from "express";
// 👇 1. Asegúrate de importar 'desglosarTareaIA'
import { generarDetallesProyecto, desglosarTareaIA } from "../controllers/proyectosIA.controller.js"; 

const router = Router();

// Ruta existente
router.post("/generar", generarDetallesProyecto);

// 👇 2. ¡ESTA ES LA LÍNEA QUE FALTA! 
// Sin esto, el backend devuelve el error "Cannot POST..."
router.post("/desglosar-tarea", desglosarTareaIA);

export default router;