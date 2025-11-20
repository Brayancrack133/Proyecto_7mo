import { Router } from "express";
import {
  obtenerUsuarios,
  crearUsuario,
  editarUsuario,
  cambiarEstadoUsuario,
  buscarUsuarios
} from "../controllers/usuarios.controller";

const router = Router();

router.get("/", obtenerUsuarios);
router.get("/buscar", buscarUsuarios);
router.post("/", crearUsuario);
router.put("/:id", editarUsuario);
router.patch("/:id/estado", cambiarEstadoUsuario);

export default router;
