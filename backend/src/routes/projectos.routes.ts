import { Router } from "express";
import  {db}  from "../config/db.js";

const router = Router();

// Obtener todos los proyectos
router.get("/", async (req, res) => {
    const [rows] = await db.query(`
        SELECT 
            p.id_proyecto AS id,
            p.nombre,
            CONCAT(p.fecha_inicio, ' – ', COALESCE(p.fecha_fin, '')) AS fechas,
            u.nombre AS jefe,
            'Activo' AS estado,
            50 AS progreso,
            3 AS equipo
        FROM Proyectos p
        INNER JOIN Usuarios u ON u.id_usuario = p.id_jefe
    `);
    res.json(rows);
});

export default router;
