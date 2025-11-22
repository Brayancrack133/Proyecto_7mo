import { Router } from "express";
import { db } from "../config/db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// Configuración de Multer (Para guardar archivos en la carpeta uploads)
const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        const uploadPath = 'uploads/';
        if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req: any, file: any, cb: any) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// 1. OBTENER SOLO DOCUMENTOS OFICIALES (El filtro mágico)
router.get("/documentos/proyecto/:idProyecto", (req, res) => {
    const { idProyecto } = req.params;
    const query = `
        SELECT d.*, u.nombre, u.apellido 
        FROM Documentos d
        LEFT JOIN Documento_Tarea dt ON d.id_doc = dt.id_doc
        JOIN Usuarios u ON d.id_usuario_subida = u.id_usuario
        WHERE d.id_proyecto = ? AND dt.id_tarea IS NULL  -- <--- AQUÍ ESTÁ LA CLAVE
        ORDER BY d.fecha_subida DESC
    `;
    db.query(query, [idProyecto], (err, results) => {
        if (err) return res.status(500).json({ error: "Error cargando docs" });
        res.json(results);
    });
});

// 2. SUBIR DOCUMENTO OFICIAL
router.post("/documentos/general", upload.single('archivo'), (req, res) => {
    const file = (req as any).file;
    const { id_proyecto, id_usuario, comentario } = req.body;

    if (!file) return res.status(400).json({ error: "Falta archivo" });

    // Insertamos sin vincular a tareas
    const query = `
        INSERT INTO Documentos (id_proyecto, nombre_archivo, url, id_tipo_doc, id_usuario_subida, comentario)
        VALUES (?, ?, ?, 1, ?, ?)
    `;

    db.query(query, [id_proyecto, file.originalname, file.path, id_usuario, comentario], (err, result) => {
        if (err) return res.status(500).json({ error: "Error subiendo" });
        res.json({ message: "Documento oficial subido" });
    });
});

// 3. ELIMINAR DOCUMENTO
router.delete("/documentos/:idDoc", (req, res) => {
    const { idDoc } = req.params;
    db.query("DELETE FROM Documentos WHERE id_doc = ?", [idDoc], (err) => {
        if (err) return res.status(500).json({ error: "Error borrando" });
        res.json({ message: "Documento eliminado" });
    });
});

export default router;