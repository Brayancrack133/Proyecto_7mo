// src/routes/proyectos.routes.ts
import { Router } from "express";
import { db } from "../config/db.js"; // Asegúrate que sea .js si compilas, o ajusta según tu config

const router = Router();

router.get("/mis-proyectos/:idUsuario", (req, res) => {
    const { idUsuario } = req.params;

    // Esta consulta busca proyectos donde el usuario es miembro del equipo asignado
    const query = `
        SELECT 
            p.id_proyecto,
            p.nombre,            -- Antes era "AS nombre_proyecto", ahora déjalo así
            p.descripcion,
            p.fecha_inicio,
            p.fecha_fin,
            me.rol_en_equipo AS rol,  -- ALIAS CLAVE: renombramos esto a 'rol'
            e.nombre_equipo
        FROM Proyectos p
        JOIN Equipos e ON p.id_equipo = e.id_equipo
        JOIN Miembros_Equipo me ON me.id_equipo = e.id_equipo
        WHERE me.id_usuario = ?
    `;

    db.query(query, [idUsuario], (err, results) => {
        if (err) {
            console.error("Error DB:", err);
            return res.status(500).json({ error: "Error al obtener proyectos" });
        }
        res.json(results);
    });
});

export default router;