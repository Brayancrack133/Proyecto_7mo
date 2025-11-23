import { Router } from "express";
import multer from "multer";
import  db  from "../config/db.js";
import type { ResultSetHeader } from "mysql2";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("archivo"), async (req, res) => {
  try {
    const { id_proyecto, id_usuario } = req.body;
    const archivo = req.file;

    if (!archivo) {
      return res.status(400).json({ error: "No se envió ningún archivo" });
    }

    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO Documentos (id_proyecto, nombre_archivo, url, id_tipo_doc, id_usuario_subida)
       VALUES (?, ?, ?, 1, ?)`,
      [
        id_proyecto,
        archivo.originalname,
        archivo.path, 
        id_usuario
      ]
    );

    res.json({ 
      message: "Archivo subido correctamente",
      id: result.insertId 
    });

  } catch (error: any) {
    console.error("❌ Error al subir archivo:", error);
    res.status(500).json({ error: "Error al subir archivo", details: error.message });
  }
});

export default router;
