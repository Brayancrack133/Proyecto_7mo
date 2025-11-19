// src/routes/tareas.routes.ts
import { Router } from "express";
import { db } from "../config/db.js";

const router = Router();

// Obtener tareas de un proyecto específico
router.get("/tareas/:idProyecto", (req, res) => {
    const { idProyecto } = req.params;

    const query = `
        SELECT 
            t.id_tarea,
            t.titulo,
            t.descripcion,
            t.fecha_inicio,
            t.fecha_fin,
            u.nombre AS nombre_responsable,
            u.apellido AS apellido_responsable
        FROM Tareas t
        LEFT JOIN Usuarios u ON t.id_responsable = u.id_usuario
        WHERE t.id_proyecto = ?
    `;

    db.query(query, [idProyecto], (err, results) => {
        if (err) {
            console.error("Error al obtener tareas:", err);
            return res.status(500).json({ error: "Error al obtener tareas" });
        }
        res.json(results);
    });
});

export default router;