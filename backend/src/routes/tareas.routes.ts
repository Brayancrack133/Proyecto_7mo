import { Router } from "express";
// Importamos dbRaw (la que acepta callbacks) y la renombramos a 'db'
import { dbRaw } from "../config/db.js";
const db: any = dbRaw; import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// --- CORRECCIÓN 1: Tipos en los callbacks (req: any, file: any, cb: any) ---
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

// RUTA GET TAREAS
// GET: Obtener tareas de un proyecto
router.get("/tareas/:idProyecto", (req, res) => {
    const { idProyecto } = req.params;

    const query = `
        SELECT 
            t.id_tarea,
            t.titulo,
            t.descripcion,
            t.fecha_inicio,
            t.fecha_fin,
            t.id_responsable,
            t.id_tarea_padre, /* <--- ¡NUEVO CAMPO! Vital para el árbol */
            u.nombre AS nombre_responsable,
            u.apellido AS apellido_responsable
        FROM Tareas t
        LEFT JOIN Usuarios u ON t.id_responsable = u.id_usuario
        WHERE t.id_proyecto = ?
        ORDER BY t.id_tarea ASC 
    `;

    db.query(query, [idProyecto], (err: any, results: any) => {
        if (err) {
            console.error("Error al obtener tareas:", err);
            return res.status(500).json({ error: "Error al obtener tareas" });
        }
        res.json(results);
    });
});


// POST: Crear nueva tarea (Manual o IA)
router.post("/tareas", (req, res) => {
    // 1. Recibimos 'id_tarea_padre' del cuerpo de la petición
    const { id_proyecto, titulo, descripcion, fecha_inicio, fecha_fin, id_responsable, id_tarea_padre } = req.body;

    // 2. Actualizamos el query para incluir la columna nueva
    const query = `
        INSERT INTO Tareas (id_proyecto, titulo, descripcion, fecha_inicio, fecha_fin, id_responsable, id_tarea_padre)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    // 3. Pasamos los valores (usando '|| null' por si viene undefined)
    db.query(query, [id_proyecto, titulo, descripcion, fecha_inicio, fecha_fin, id_responsable, id_tarea_padre || null], (err: any, result: any) => {
        if (err) {
            console.error("Error creando tarea:", err);
            return res.status(500).json({ error: "Error al crear la tarea" });
        }

        const idTarea = result.insertId;

        // Notificación (Tu lógica existente, se mantiene igual)
        if (id_responsable) {
            const notiQuery = `
                INSERT INTO Notificaciones (id_usuario_destino, id_tipo_notificacion, contenido, id_tarea)
                VALUES (?, 1, ?, ?)
            `;
            const contenido = `Se te ha asignado una nueva tarea: "${titulo}"`;
            db.query(notiQuery, [id_responsable, contenido, idTarea], (errNoti: any) => {
                if (errNoti) console.error("Error notificación:", errNoti);
            });
        }
        
        res.json({ message: "Tarea creada", id: idTarea });
    });
});

// RUTA SUBIR AVANCE
// --- CORRECCIÓN 3: (req as any) para que detecte .file ---
router.post("/tareas/subir-avance", upload.single('archivo'), (req, res) => {
    const file = (req as any).file;
    const { id_tarea, id_usuario, comentario } = req.body;

    if (!file) return res.status(400).json({ error: "Sin archivo" });

    // 1. Guardar documento (IGUAL QUE ANTES)
    const queryDoc = `
        INSERT INTO Documentos (id_proyecto, nombre_archivo, url, id_tipo_doc, id_usuario_subida, comentario)
        SELECT id_proyecto, ?, ?, 1, ?, ? FROM Tareas WHERE id_tarea = ?
    `;

    db.query(queryDoc, [file.originalname, file.path, id_usuario, comentario, id_tarea], (err:any, result: any) => {
        if (err) return res.status(500).json({ error: "Error guardando documento" });

        const idDoc = result.insertId;

        // 2. Relacionar documento (IGUAL QUE ANTES)
        db.query("INSERT INTO Documento_Tarea (id_doc, id_tarea) VALUES (?, ?)", [idDoc, id_tarea], (errRel:any) => {
            if (errRel) return res.status(500).json({ error: "Error relacionando" });

            // --- NUEVO: AVISAR AL LÍDER ---
            // Primero: Averiguamos quién es el jefe del proyecto de esta tarea
            const queryJefe = `
                SELECT p.id_jefe, t.titulo 
                FROM Proyectos p 
                JOIN Tareas t ON p.id_proyecto = t.id_proyecto 
                WHERE t.id_tarea = ?
            `;

            db.query(queryJefe, [id_tarea], (errJefe:any, rows: any) => {
                if (!errJefe && rows.length > 0) {
                    const { id_jefe, titulo } = rows[0];

                    // Solo notificamos si el que sube NO es el mismo jefe (para no auto-notificarse)
                    if (id_jefe != id_usuario) {
                        // CAMBIO AQUÍ: Agregamos id_tarea
                        const notiQuery = `
                        INSERT INTO Notificaciones (id_usuario_destino, id_tipo_notificacion, contenido, id_tarea)
                        VALUES (?, 2, ?, ?)
                    `;
                        const msg = `El usuario ha subido un avance en la tarea: "${titulo}"`;

                        // Pasamos id_tarea como 4to parámetro
                        db.query(notiQuery, [id_jefe, msg, id_tarea]);
                    }
                }
                res.json({ message: "Avance subido y notificado" });
            });
        });
    });
});

// RUTA 4: Obtener documentos de una tarea
router.get("/tareas/:idTarea/documentos", (req, res) => {
    const { idTarea } = req.params;

    const query = `
        SELECT 
            d.id_doc,
            d.nombre_archivo,
            d.url,
            d.fecha_subida,
            d.comentario,  /* <--- AGREGAMOS ESTO */
            u.nombre as usuario_nombre,
            u.apellido as usuario_apellido
        FROM Documentos d
        JOIN Documento_Tarea dt ON d.id_doc = dt.id_doc
        JOIN Usuarios u ON d.id_usuario_subida = u.id_usuario
        WHERE dt.id_tarea = ?
        ORDER BY d.fecha_subida DESC
    `;

    db.query(query, [idTarea], (err:any, results:any) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error obteniendo documentos" });
        }
        res.json(results);
    });
});
// RUTA 5: Obtener detalles de UNA sola tarea (Para el Modal independiente)
router.get("/tarea/:id", (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT id_tarea, titulo, descripcion, id_responsable 
        FROM Tareas WHERE id_tarea = ?
    `;
    db.query(query, [id], (err:any, result: any) => {
        if (err || result.length === 0) return res.status(404).json({ error: "No encontrada" });
        res.json(result[0]);
    });
});
router.delete("/tareas/:id", (req, res) => {
    const { id } = req.params;
    
    // Gracias al "ON DELETE CASCADE" que configuramos en la BD, 
    // si borras un padre, se borran sus hijos automáticamente.
    const query = "DELETE FROM Tareas WHERE id_tarea = ?";

    db.query(query, [id], (err: any, result: any) => {
        if (err) {
            console.error("Error eliminando tarea:", err);
            return res.status(500).json({ error: "Error al eliminar" });
        }
        res.json({ message: "Tarea eliminada" });
    });
});

export default router;