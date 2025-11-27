import { Request, Response } from "express";
import { db } from "../config/db.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// Crear un nuevo análisis de proyecto
export const createProyectoPrincipal = async (req: Request, res: Response) => {
    const { 
        nombre_proyecto, 
        fecha_inicio, 
        fecha_fin, 
        metodologia_id, 
        tipo_proyecto, 
        tamano_complejidad, 
        descripcion, 
        sugerencia_ia 
    } = req.body;

    try {
        const [result] = await db.query<ResultSetHeader>(
            `INSERT INTO proyecto_principal 
            (nombre_proyecto, fecha_inicio, fecha_fin, metodologia_id, tipo_proyecto, tamano_complejidad, descripcion, sugerencia_ia)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [nombre_proyecto, fecha_inicio, fecha_fin || null, metodologia_id, tipo_proyecto, tamano_complejidad, descripcion, sugerencia_ia]
        );

        res.json({ 
            message: "Proyecto principal creado exitosamente",
            id_analisis: result.insertId,
            metodologia_id: metodologia_id
        });
    } catch (error) {
        console.error("Error creando proyecto principal:", error);
        res.status(500).json({ error: "Error al guardar el análisis del proyecto" });
    }
};

// Obtener datos de un proyecto por su ID (para mostrar en el Header de la metodología)
export const getProyectoPrincipalById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT p.*, m.nombre as nombre_metodologia 
             FROM proyecto_principal p
             LEFT JOIN metodologias m ON p.metodologia_id = m.id
             WHERE p.id_analisis = ?`,
            [id]
        );

        if (rows.length === 0) return res.status(404).json({ error: "Proyecto no encontrado" });
        res.json(rows[0]);
    } catch (error) {
        console.error("Error obteniendo proyecto:", error);
        res.status(500).json({ error: "Error del servidor" });
    }
};