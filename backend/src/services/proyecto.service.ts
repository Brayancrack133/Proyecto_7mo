// src/services/proyectos.service.js

// 1. Importa el tipo ResultSetHeader de mysql2/promise
import type { ResultSetHeader } from 'mysql2/promise'; 
import { db } from "../config/db.js";

// 2. Define una interfaz o tipo para los datos de entrada (ProyectoData)
interface ProyectoMetadata {
  tipo?: string;
  tamano?: string;
  complejidad?: string;
}

interface ProyectoData {
  nombre: string;
  descripcion?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  id_jefe?: number; // Asumiendo que es un ID numérico
  metodologia_id?: number; // Asumiendo que es un ID numérico
  metadata?: ProyectoMetadata;
}

// 3. Aplica el tipado a la función
export const crearProyecto = async (data: ProyectoData) => { // ⬅️ Soluciona el error de 'any' implícito
  const { nombre, descripcion, fecha_inicio, fecha_fin, id_jefe, metodologia_id, metadata } = data;

  // Insert base proyecto
  // 4. Se usa la aserción 'as' para indicarle a TypeScript que el resultado es ResultSetHeader
  const [result] = await db.query(
    `INSERT INTO proyectos (nombre, descripcion, fecha_inicio, fecha_fin, id_jefe, metodologia_id)
      VALUES (?, ?, ?, ?, ?, ?)`,
    [nombre, descripcion, fecha_inicio || null, fecha_fin || null, id_jefe || null, metodologia_id || null]
  ) as [ResultSetHeader, any]; 

  const id_proyecto = result.insertId; // ⬅️ Ahora 'insertId' existe en el tipo

  // Si tienes metadata
  if (metadata) {
    await db.query(
      `INSERT INTO proyectos_metadata (id_proyecto, tipo, tamano, complejidad) VALUES (?, ?, ?, ?)`,
      [id_proyecto, metadata.tipo, metadata.tamano, metadata.complejidad]
    );
  }

  // Retornar el id y datos mínimos
  return { id_proyecto, nombre, descripcion, fecha_inicio, fecha_fin, metodologia_id };
};