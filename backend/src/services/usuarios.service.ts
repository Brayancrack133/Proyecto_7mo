import { db } from "../config/db.js";
import bcrypt from "bcrypt";

export const obtenerUsuarios = async () => {
  const [rows] = await db.query(`
    SELECT u.id_usuario AS id, u.nombre, u.apellido, u.correo,
           '******' AS contraseña, u.estado, r.nombre_rol AS rol, u.fecha_creacion
    FROM usuarios u
    LEFT JOIN usuario_rol ur ON u.id_usuario = ur.id_usuario
    LEFT JOIN roles r ON ur.id_rol = r.id_rol
  `);
  return rows;
};

export const buscarUsuarios = async (q: string) => {
  const [rows] = await db.query(`
    SELECT u.id_usuario AS id, u.nombre, u.apellido, u.correo,
           '******' AS contraseña, u.estado, r.nombre_rol AS rol
    FROM usuarios u
    LEFT JOIN usuario_rol ur ON u.id_usuario = ur.id_usuario
    LEFT JOIN roles r ON ur.id_rol = r.id_rol
    WHERE u.nombre LIKE ? OR u.apellido LIKE ? OR u.correo LIKE ? OR r.nombre_rol LIKE ?
  `, [`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`]);

  return rows;
};

export const crearUsuario = async (data: any) => {
 const { nombre, apellido, correo, contraseña, id_rol } = data;


  const hash = await bcrypt.hash(contraseña, 10);

  const [result]: any = await db.query(`
    INSERT INTO usuarios (nombre, apellido, correo, contraseña, estado, fecha_creacion)
    VALUES (?, ?, ?, ?, 'Habilitado', NOW())
  `, [nombre, apellido, correo, hash]);

  await db.query(`INSERT INTO usuario_rol (id_usuario, id_rol) VALUES (?, ?)`, [
    result.insertId,
    id_rol
  ]);

  return { id: result.insertId, nombre, apellido, correo, id_rol };
};

export const editarUsuario = async (id: number, data: any) => {
  const { nombre, apellido, correo, rol } = data;

  await db.query(`
    UPDATE usuarios SET nombre=?, apellido=?, correo=? WHERE id_usuario=?
  `, [nombre, apellido, correo, id]);

  await db.query(`
    UPDATE usuario_rol SET id_rol=? WHERE id_usuario=?
  `, [rol, id]);

  return { id, nombre, apellido, correo, rol };
};

export const cambiarEstadoUsuario = async (id: number) => {
  await db.query(`
    UPDATE usuarios
    SET estado = IF(estado='Habilitado','Deshabilitado','Habilitado')
    WHERE id_usuario=?
  `, [id]);

  return { id };
};
