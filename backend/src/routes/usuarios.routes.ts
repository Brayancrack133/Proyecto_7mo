import { Router } from "express";
import multer from "multer";
import path from "path";
import {
  obtenerUsuarios,
  crearUsuario,
  editarUsuario,
  cambiarEstadoUsuario,
  buscarUsuarios
} from "../controllers/usuarios.controller.js";

const router = Router();

// Configuración de Multer (Guardar imágenes en la carpeta 'uploads')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Asegúrate de que esta carpeta exista en tu backend
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

router.get("/", obtenerUsuarios);
router.get("/buscar", buscarUsuarios);
router.post("/", crearUsuario);

// ⚠️ CAMBIO AQUÍ: Agregamos el middleware 'upload.single'
router.put("/:id", upload.single('foto'), editarUsuario);

router.patch("/:id/estado", cambiarEstadoUsuario);

export default router;