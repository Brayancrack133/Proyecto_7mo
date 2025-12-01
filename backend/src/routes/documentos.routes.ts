import { Router } from "express";
// Usamos 'db' para soportar Promesas (async/await)
import { db } from "../config/db.js"; 
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

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

// ====================================================================
// RUTAS DE LECTURA
// (No incluimos '/documentos' aquí porque ya está en index.ts)
// ====================================================================

// 1. OBTENER DOCS DE UN PROYECTO
// Ruta final: /api/documentos/proyecto/:idProyecto
router.get("/proyecto/:idProyecto", async (req, res) => {
    const { idProyecto } = req.params;
    const query = `
        SELECT d.*, u.nombre, u.apellido 
        FROM documentos d
        JOIN usuarios u ON d.id_usuario_subida = u.id_usuario
        WHERE d.id_proyecto = ?
        ORDER BY d.fecha_subida DESC
    `;
    try {
        // @ts-ignore
        const [results] = await db.query(query, [idProyecto]);
        res.json(results);
    } catch (err: any) {
        console.error("Error docs proyecto:", err);
        res.status(500).json({ error: "Error cargando documentos del proyecto" });
    }
});

// 2. OBTENER DOCS DE UN USUARIO (Mis Documentos)
// Ruta final: /api/documentos/usuario/:idUsuario
router.get("/usuario/:idUsuario", async (req, res) => {
    const { idUsuario } = req.params;
    const query = `
        SELECT d.*, p.nombre as nombre_proyecto 
        FROM documentos d
        LEFT JOIN proyectos p ON d.id_proyecto = p.id_proyecto
        WHERE d.id_usuario_subida = ?
        ORDER BY d.fecha_subida DESC
    `;
    try {
        // @ts-ignore
        const [results] = await db.query(query, [idUsuario]);
        res.json(results);
    } catch (err: any) {
        console.error("Error mis docs:", err);
        res.status(500).json({ error: "Error cargando mis documentos" });
    }
});

// ====================================================================
// RUTAS DE ACCIÓN
// ====================================================================

// 3. SUBIR DOCUMENTO
// Ruta final: /api/documentos/general
router.post("/general", upload.single('archivo'), async (req, res) => {
    try {
        const file = (req as any).file;
        const { id_proyecto, id_usuario, categoria, descripcion } = req.body;

        if (!file) return res.status(400).json({ error: "Falta archivo físico" });
        if (!id_proyecto || id_proyecto === "0") return res.status(400).json({ error: "Falta ID de proyecto" });

        const id_tipo_doc = 1; 
        const comentarioFinal = categoria ? `[${categoria}] ${descripcion || ''}` : descripcion;

        const query = `
            INSERT INTO documentos (id_proyecto, nombre_archivo, url, id_tipo_doc, id_usuario_subida, comentario)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        // @ts-ignore
        await db.query(query, [id_proyecto, file.originalname, file.path, id_tipo_doc, id_usuario, comentarioFinal]);
        
        res.json({ message: "Documento oficial subido" });
    } catch (err: any) {
        console.error("Error subida:", err);
        res.status(500).json({ error: "Error interno al subir documento" });
    }
});

// 4. CLONAR DOCUMENTO
router.post("/clonar", async (req, res) => {
    const { id_doc, id_proyecto_destino, id_usuario } = req.body;
    try {
        const query = `
            INSERT INTO documentos (id_proyecto, nombre_archivo, url, id_tipo_doc, id_usuario_subida, comentario)
            SELECT ?, nombre_archivo, url, id_tipo_doc, ?, comentario
            FROM documentos WHERE id_doc = ?
        `;
        // @ts-ignore
        await db.query(query, [id_proyecto_destino, id_usuario, id_doc]);
        res.json({ message: "Documento copiado al proyecto exitosamente" });
    } catch (err) {
        res.status(500).json({ error: "Error al clonar documento" });
    }
});

// 5. ELIMINAR DOCUMENTO
router.delete("/:idDoc", async (req, res) => {
    const { idDoc } = req.params;
    try {
        // @ts-ignore
        await db.query("DELETE FROM documentos WHERE id_doc = ?", [idDoc]);
        res.json({ message: "Documento eliminado" });
    } catch (err) {
        res.status(500).json({ error: "Error borrando" });
    }
});

// 6. DESCARGAR DOCUMENTO
router.get("/descargar/:idDoc", async (req, res) => {
    const { idDoc } = req.params;
    try {
        // @ts-ignore
        const [results] = await db.query("SELECT * FROM documentos WHERE id_doc = ?", [idDoc]);
        
        if ((results as any[]).length === 0) return res.status(404).json({ error: "No encontrado" });
        
        const doc = (results as any[])[0];
        const filePath = path.resolve(doc.url);
        
        if (fs.existsSync(filePath)) {
            res.download(filePath, doc.nombre_archivo);
        } else {
            res.status(404).json({ error: "El archivo físico no existe en el servidor" });
        }
    } catch (err) {
        res.status(500).json({ error: "Error en descarga" });
    }
});

export default router;