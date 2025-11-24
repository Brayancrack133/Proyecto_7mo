// src/services/proyectos.service.ts
import { db } from "../config/db.js";

export const crearProyecto = async (data: any) => {
  const { nombre, descripcion, fecha_inicio, fecha_fin, id_jefe, metadata } = data;

  // 1️⃣ Insertar proyecto base
  const [result]: any = await db.query(
    `
      INSERT INTO Proyectos (nombre, descripcion, fecha_inicio, fecha_fin, id_jefe)
      VALUES (?, ?, ?, ?, ?)
    `,
    [nombre, descripcion, fecha_inicio, fecha_fin, id_jefe]
  );

  const id_proyecto = result.insertId;

  // 2️⃣ Insertar metadata (si existe)
  if (metadata) {
    await db.query(
      `
        INSERT INTO Proyectos_Metadata (id_proyecto, tipo, tamano, complejidad)
        VALUES (?, ?, ?, ?)
      `,
      [
        id_proyecto,
        metadata.tipo,
        metadata.tamano,
        metadata.complejidad,
      ]
    );
  }

  return {
    id_proyecto,
    nombre,
    descripcion,
    fecha_inicio,
    metadata,
  };
};
