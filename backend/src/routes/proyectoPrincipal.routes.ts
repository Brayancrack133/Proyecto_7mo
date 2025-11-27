import { Router } from "express";
import * as controller from "../controllers/proyectoPrincipal.controller.js";

const router = Router();

// POST: Crear proyecto (Usado por el formulario de tu compañero)
router.post("/", controller.createProyectoPrincipal);

// GET: Obtener info (Usado por tus páginas de metodología)
router.get("/:id", controller.getProyectoPrincipalById);

export default router;