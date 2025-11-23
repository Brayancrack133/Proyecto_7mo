// src/routes/tareas.routes.ts
import { Router } from "express";
import db from "../config/db.js"; // 'db' es el pool de mysql2/promise

const router = Router();

// Obtener tareas de un proyecto específico
// **IMPORTANTE: Hacemos la función del manejador de ruta ASÍNCRONA**
router.get("/tareas/:idProyecto", async (req, res) => {
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

    try {
        // **1. Usamos await para esperar la promesa**
        // db.query devuelve un array donde el primer elemento son las filas (rows)
        const [results] = await db.query(query, [idProyecto]); 
        
        // **2. Enviamos las filas al cliente**
        res.json(results);

    } catch (err) {
        // **3. Capturamos cualquier error en el catch**
        console.error("❌ Error al obtener tareas:", err);
        return res.status(500).json({ error: "Error al obtener tareas" });
    }
});

export default router;