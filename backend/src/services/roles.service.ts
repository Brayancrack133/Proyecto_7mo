import { db } from "../config/db.js";

export const obtenerRoles = async () => {
  const [rows] = await db.query(`SELECT * FROM roles`);
  return rows;
};

export const crearRol = async (data: any) => {
  const [r]: any = await db.query(
    `INSERT INTO roles (nombre_rol) VALUES (?)`,
    [data.nombre_rol]
  );
  return { id: r.insertId, nombre_rol: data.nombre_rol };
};

export const editarRol = async (id: number, data: any) => {
  await db.query(`UPDATE roles SET nombre_rol=? WHERE id_rol=?`, [
    data.nombre_rol,
    id
  ]);
  return { id, nombre_rol: data.nombre_rol };
};

export const eliminarRol = async (id: number) => {
  await db.query(`DELETE FROM roles WHERE id_rol=?`, [id]);
  return { id };
};
