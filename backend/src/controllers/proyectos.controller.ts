// src/controllers/proyectos.controller.js
import { Request, Response } from "express";
import * as proyectosService from "../services/proyecto.service";
// Importamos la base de datos (asumimos que está importada)
import { db } from "../config/db.js"; 

export const crearProyecto = async (req: Request, res: Response) => {
    // ... (Tu código existente de crearProyecto) ...
};

// 👇 NUEVA FUNCIÓN: Lista TODOS los proyectos (Acceso Global para el Asistente)
export const listarProyectosDelUsuario = async (req: Request, res: Response) => {
    
    // Ya no necesitamos el userId, pero lo mantenemos en el 'try/catch'
    try {
        // Consulta simplificada para obtener TODOS los proyectos
        // Eliminamos los JOINS a Equipos y la cláusula WHERE.
        const query = `
            SELECT 
                id_proyecto,
                nombre
            FROM Proyectos
            ORDER BY nombre ASC
        `;

        // Ejecutamos la consulta. Ya no pasamos el userId al query.
        const [proyectos]: any[] = await db.query(query, []);
        
        // Devolver el ID y Nombre de todos los proyectos
        res.json(proyectos);

    } catch (error) {
        console.error("Error al listar TODOS los proyectos:", error);
        // Devolvemos el error si la conexión a la base de datos falla
        res.status(500).json({ error: "Error interno del servidor al cargar la lista de proyectos." });
    }
};