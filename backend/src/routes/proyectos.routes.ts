// src/routes/proyectos.routes.ts
import { Router } from "express";
// Importación por defecto, asumiendo que db.ts exporta el pool por defecto
import db from "../config/db.js"; 

const router = Router();

// **IMPORTANTE: Hacemos la función del manejador de ruta ASÍNCRONA**
router.get("/mis-proyectos/:idUsuario", async (req, res) => {
    const { idUsuario } = req.params;

    const query = `
        SELECT 
            p.id_proyecto,
            p.nombre, 
            p.descripcion,
            p.fecha_inicio,
            p.fecha_fin,
            me.rol_en_equipo AS rol, 
            e.nombre_equipo
        FROM Proyectos p
        JOIN Equipos e ON p.id_equipo = e.id_equipo
        JOIN Miembros_Equipo me ON me.id_equipo = e.id_equipo
        WHERE me.id_usuario = ?
    `;

    try {
        // **1. Usamos await para ejecutar la consulta.**
        // db.query devuelve [rows, fields]. Usamos desestructuración para obtener solo las filas.
        const [results] = await db.query(query, [idUsuario]); 
        
        // **2. Respondemos con los resultados**
        res.json(results);
    
    } catch (err) {
        // **3. Capturamos errores de la base de datos**
        console.error("❌ Error DB al obtener proyectos:", err);
        return res.status(500).json({ error: "Error al obtener proyectos" });
    }
});

export default router;