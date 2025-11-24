import { Router } from "express";
import { db } from "../config/db.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { ResultSetHeader } from "mysql2";

const router = Router();

// --- CONFIGURACIÓN DE MULTER (Conservamos la tuya, es mejor) ---
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

// 1. OBTENER SOLO DOCUMENTOS OFICIALES (Adaptado a async/await)
router.get("/documentos/proyecto/:idProyecto", async (req, res) => {
    const { idProyecto } = req.params;
    const query = `
        SELECT d.*, u.nombre, u.apellido 
        FROM Documentos d
        LEFT JOIN Documento_Tarea dt ON d.id_doc = dt.id_doc
        JOIN Usuarios u ON d.id_usuario_subida = u.id_usuario
        WHERE d.id_proyecto = ? AND dt.id_tarea IS NULL 
        ORDER BY d.fecha_subida DESC
    `;
    
    try {
        const [results] = await db.query(query, [idProyecto]);
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error cargando docs" });
    }
});

// 2. SUBIR DOCUMENTO OFICIAL (Adaptado a async/await)
router.post("/documentos/general", upload.single('archivo'), async (req, res) => {
    const file = (req as any).file;
    const { id_proyecto, id_usuario, comentario } = req.body;

    if (!file) return res.status(400).json({ error: "Falta archivo" });

    // Insertamos sin vincular a tareas
    const query = `
        INSERT INTO Documentos (id_proyecto, nombre_archivo, url, id_tipo_doc, id_usuario_subida, comentario)
        VALUES (?, ?, ?, 1, ?, ?)
    `;

    try {
        const [result] = await db.query<ResultSetHeader>(query, [id_proyecto, file.originalname, file.path, id_usuario, comentario]);
        res.json({ message: "Documento oficial subido", id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error subiendo documento" });
    }
});

// 3. ELIMINAR DOCUMENTO (Adaptado a async/await)
router.delete("/documentos/:idDoc", async (req, res) => {
    const { idDoc } = req.params;
    
    try {
        await db.query("DELETE FROM Documentos WHERE id_doc = ?", [idDoc]);
        res.json({ message: "Documento eliminado" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error borrando documento" });
    }
});

export default router;