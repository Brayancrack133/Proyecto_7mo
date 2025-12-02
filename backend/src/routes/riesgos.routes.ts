import { Router } from "express";
import { analizarRiesgosProyecto } from "../controllers/riesgos.controller.js";

const router = Router();

// GET /api/riesgos/analisis/:idProyecto
router.get("/analisis/:idProyecto", analizarRiesgosProyecto);

export default router;