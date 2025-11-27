import { Router } from "express";
// Importamos dbRaw (la que acepta callbacks) y la renombramos a 'db'
import { dbRaw } from "../config/db.js";
const db: any = dbRaw; const router = Router();

// Obtener notificaciones de un usuario (Ordenadas por la más nueva primero)
router.get("/notificaciones/:idUsuario", (req, res) => {
    const { idUsuario } = req.params;

    const query = `
        SELECT 
            n.id_notificacion,
            n.contenido,
            n.fecha_creacion,
            n.es_leida,
            n.id_tarea,
            n.id_proyecto,           /* <--- NUEVO */
            n.id_usuario_remitente,  /* <--- NUEVO */
            nt.nombre_tipo as tipo
        FROM Notificaciones n
        JOIN Notificaciones_Tipo nt ON n.id_tipo_notificacion = nt.id_tipo_notificacion
        WHERE n.id_usuario_destino = ?
        ORDER BY n.fecha_creacion DESC
    `;

    db.query(query, [idUsuario], (err: any, results: any) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error server" });
        }
        res.json(results);
    });
});

router.get("/notificaciones/usuario/:idUsuario/proyecto/:idProyecto", (req, res) => {
    const { idUsuario, idProyecto } = req.params;

    const query = `
        SELECT 
            n.id_notificacion,
            n.contenido,
            n.fecha_creacion,
            n.es_leida,
            n.id_tarea,
            n.id_proyecto,
            n.id_usuario_remitente,
            nt.nombre_tipo as tipo
        FROM Notificaciones n
        JOIN Notificaciones_Tipo nt ON n.id_tipo_notificacion = nt.id_tipo_notificacion
        -- Hacemos LEFT JOIN con Tareas para saber a qué proyecto pertenece la tarea
        LEFT JOIN Tareas t ON n.id_tarea = t.id_tarea
        
        WHERE n.id_usuario_destino = ? 
        AND (
            -- CASO A: La notificación tiene el ID de proyecto directo (ej: Solicitud Unión)
            n.id_proyecto = ? 
            OR 
            -- CASO B: La notificación es de una tarea que pertenece a este proyecto
            t.id_proyecto = ?
        )
        ORDER BY n.fecha_creacion DESC
    `;

    db.query(query, [idUsuario, idProyecto, idProyecto], (err: any, results: any) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error server" });
        }
        res.json(results);
    });
});

export default router;