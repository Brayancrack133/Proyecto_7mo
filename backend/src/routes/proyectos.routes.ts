// src/routes/proyectos.routes.ts
import { Router } from "express";
import { db } from "../config/db.js";

const router = Router();

router.get("/mis-proyectos/:idUsuario", (req, res) => {
    const { idUsuario } = req.params;

    const query = `
        SELECT 
            p.id_proyecto,
            p.nombre AS nombre_proyecto,
            p.descripcion,
            p.fecha_inicio,
            p.fecha_fin,
            me.rol_en_equipo,
            e.nombre_equipo
        FROM proyectos p
        JOIN equipos e ON p.id_equipo = e.id_equipo
        JOIN miembros_equipo me ON me.id_equipo = e.id_equipo
        WHERE me.id_usuario = ?;
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
