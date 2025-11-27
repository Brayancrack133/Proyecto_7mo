// src/services/metodologias.service.js
import { db } from "../config/db.js";

export const listarMetodologias = async () => {
  const [rows] = await db.query(
    `SELECT id, nombre, descripcion, tipo, activo FROM metodologias WHERE activo = 1 ORDER BY nombre`
  );
  return rows;
};
