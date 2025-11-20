import { Router } from "express";
import {
  obtenerRoles,
  crearRol,
  editarRol,
  eliminarRol
} from "../controllers/roles.controller";

const router = Router();

router.get("/", obtenerRoles);
router.post("/", crearRol);
router.put("/:id", editarRol);
router.delete("/:id", eliminarRol);

export default router;
