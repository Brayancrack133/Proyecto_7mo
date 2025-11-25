// src/routes/proyectos.routes.ts
import { Router } from "express";
import { crearProyecto } from "../controllers/proyectos.controller";

const router = Router();

router.post("/", crearProyecto);

export default router;
