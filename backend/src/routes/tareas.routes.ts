import { Router } from "express";
import { db } from "../config/db.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { ResultSetHeader, RowDataPacket } from "mysql2";

const router = Router();

// --- CONFIGURACIÓN DE MULTER ---
const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        const uploadPath = 'uploads/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req: any, file: any, cb: any) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// 1. OBTENER TAREAS DE UN PROYECTO
router.get("/tareas/:idProyecto", async (req, res) => {
    const { idProyecto } = req.params;

    const query = `
        SELECT 
            t.id_tarea,
            t.titulo,
            t.descripcion,
            t.fecha_inicio,
            t.fecha_fin,
            t.id_responsable, 
            u.nombre AS nombre_responsable,
            u.apellido AS apellido_responsable
        FROM Tareas t
        LEFT JOIN Usuarios u ON t.id_responsable = u.id_usuario
        WHERE t.id_proyecto = ?
    `;

    try {
        const [results] = await db.query(query, [idProyecto]);
        res.json(results);
    } catch (err) {
        console.error("Error al obtener tareas:", err);
        res.status(500).json({ error: "Error al obtener tareas" });
    }
});

// 2. CREAR NUEVA TAREA
router.post("/tareas", async (req, res) => {
    const { id_proyecto, titulo, descripcion, fecha_inicio, fecha_fin, id_responsable } = req.body;

    const query = `
        INSERT INTO Tareas (id_proyecto, titulo, descripcion, fecha_inicio, fecha_fin, id_responsable)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    try {
        // 1. Insertar la tarea
        const [result] = await db.query<ResultSetHeader>(query, [id_proyecto, titulo, descripcion, fecha_inicio, fecha_fin, id_responsable]);
        const idTarea = result.insertId;

        // 2. Crear notificación para el responsable
        const notiQuery = `
            INSERT INTO Notificaciones (id_usuario_destino, id_tipo_notificacion, contenido, id_tarea)
            VALUES (?, 1, ?, ?)
        `;
        const contenido = `Se te ha asignado una nueva tarea: "${titulo}"`;

        // Ejecutamos la notificación sin esperar bloqueante (opcional poner await si quieres asegurar que se cree)
        await db.query(notiQuery, [id_responsable, contenido, idTarea]);

        res.json({ message: "Tarea creada y notificada", id: idTarea });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al crear la tarea" });
    }
});

// 3. SUBIR AVANCE (DOCUMENTO)
router.post("/tareas/subir-avance", upload.single('archivo'), async (req, res) => {
    const file = (req as any).file;
    const { id_tarea, id_usuario, comentario } = req.body;

    if (!file) return res.status(400).json({ error: "Sin archivo" });

    try {
        // 1. Guardar documento en BD
        const queryDoc = `
            INSERT INTO Documentos (id_proyecto, nombre_archivo, url, id_tipo_doc, id_usuario_subida, comentario)
            SELECT id_proyecto, ?, ?, 1, ?, ? FROM Tareas WHERE id_tarea = ?
        `;

        const [result] = await db.query<ResultSetHeader>(queryDoc, [file.originalname, file.path, id_usuario, comentario, id_tarea]);
        const idDoc = result.insertId;

        // 2. Relacionar documento con la tarea
        await db.query("INSERT INTO Documento_Tarea (id_doc, id_tarea) VALUES (?, ?)", [idDoc, id_tarea]);

        // 3. Avisar al Líder del Proyecto
        const queryJefe = `
            SELECT p.id_jefe, t.titulo 
            FROM Proyectos p 
            JOIN Tareas t ON p.id_proyecto = t.id_proyecto 
            WHERE t.id_tarea = ?
        `;

        const [rows] = await db.query<RowDataPacket[]>(queryJefe, [id_tarea]);

        if (rows.length > 0) {
            const { id_jefe, titulo } = rows[0];

            // Solo notificamos si el que sube NO es el mismo jefe
            if (id_jefe != id_usuario) {
                const notiQuery = `
                    INSERT INTO Notificaciones (id_usuario_destino, id_tipo_notificacion, contenido, id_tarea)
                    VALUES (?, 2, ?, ?)
                `;
                const msg = `El usuario ha subido un avance en la tarea: "${titulo}"`;
                await db.query(notiQuery, [id_jefe, msg, id_tarea]);
            }
        }

        res.json({ message: "Avance subido y notificado" });

    } catch (err) {
        console.error("Error subiendo avance:", err);
        res.status(500).json({ error: "Error procesando el avance" });
    }
});

// 4. OBTENER DOCUMENTOS DE UNA TAREA
router.get("/tareas/:idTarea/documentos", async (req, res) => {
    const { idTarea } = req.params;

    const query = `
        SELECT 
            d.id_doc,
            d.nombre_archivo,
            d.url,
            d.fecha_subida,
            d.comentario,
            u.nombre as usuario_nombre,
            u.apellido as usuario_apellido
        FROM Documentos d
        JOIN Documento_Tarea dt ON d.id_doc = dt.id_doc
        JOIN Usuarios u ON d.id_usuario_subida = u.id_usuario
        WHERE dt.id_tarea = ?
        ORDER BY d.fecha_subida DESC
    `;

    try {
        const [results] = await db.query(query, [idTarea]);
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error obteniendo documentos" });
    }
});

// 5. OBTENER DETALLES DE UNA SOLA TAREA
router.get("/tarea/:id", async (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT id_tarea, titulo, descripcion, id_responsable 
        FROM Tareas WHERE id_tarea = ?
    `;
    
    try {
        const [result] = await db.query<RowDataPacket[]>(query, [id]);
        if (result.length === 0) return res.status(404).json({ error: "No encontrada" });
        res.json(result[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error buscando tarea" });
    }
});

export default router;