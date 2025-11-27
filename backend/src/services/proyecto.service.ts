// src/services/proyectos.service.ts

import type { ResultSetHeader } from "mysql2/promise";
import { db } from "../config/db.js";

// Define la interfaz de los datos que recibimos para crear un proyecto
export interface ProyectoData {
  nombre: string;
  descripcion?: string;
  fecha_inicio: string; // obligatorio
  fecha_fin?: string;
  id_jefe: number; // obligatorio
  metodologia_id?: number;
}

// Función para crear el proyecto
export const crearProyecto = async (data: ProyectoData) => {
  try {
    // Validaciones
    if (!data.nombre?.trim()) {
      throw new Error("El nombre del proyecto es obligatorio.");
    }

    if (!data.fecha_inicio) {
      throw new Error("La fecha de inicio es obligatoria.");
    }

    if (!data.id_jefe) {
      throw new Error("El ID del jefe del proyecto es obligatorio.");
    }

    // Desestructuramos los datos recibidos
    const {
      nombre,
      descripcion,
      fecha_inicio,
      fecha_fin,
      id_jefe,
      metodologia_id,
    } = data;

    // Realizamos la inserción en la tabla `proyectos`
    const [result] = await db.query(
      `
      INSERT INTO proyectos 
      (nombre, descripcion, fecha_inicio, fecha_fin, id_jefe, metodologia_id)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        nombre,
        descripcion || null,
        fecha_inicio,
        fecha_fin || null,
        id_jefe,
        metodologia_id || null,
      ]
    ) as [ResultSetHeader, any];

    const id_proyecto = result.insertId;

    // Devolvemos los datos del proyecto creado (incluyendo el ID generado)
    return {
      id_proyecto,
      nombre,
      descripcion,
      fecha_inicio,
      fecha_fin,
      id_jefe,
      metodologia_id,
    };
  } catch (error: any) {
    console.error("❌ Error en crearProyecto:", error.message);
    throw new Error(error.message || "Error creando el proyecto.");
  }
};
