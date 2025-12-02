import { db } from "../config/db.js";
import bcrypt from "bcrypt";

export const obtenerUsuarios = async () => {
  const [rows] = await db.query(`
    SELECT u.id_usuario AS id, u.nombre, u.apellido, u.correo,
           '******' AS contraseña, u.estado, r.nombre_rol AS rol,ur.id_rol, u.fecha_creacion
    FROM usuarios u
    LEFT JOIN usuario_rol ur ON u.id_usuario = ur.id_usuario
    LEFT JOIN roles r ON ur.id_rol = r.id_rol
  `);
  return rows;
};

export const buscarUsuarios = async (q: string) => {
  const [rows] = await db.query(
    `
    SELECT u.id_usuario AS id, u.nombre, u.apellido, u.correo,
           '******' AS contraseña, u.estado, r.nombre_rol AS rol
    FROM usuarios u
    LEFT JOIN usuario_rol ur ON u.id_usuario = ur.id_usuario
    LEFT JOIN roles r ON ur.id_rol = r.id_rol
    WHERE u.nombre LIKE ? OR u.apellido LIKE ? OR u.correo LIKE ? OR r.nombre_rol LIKE ?
  `,
    [`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`]
  );

  return rows;
};

// Función para crear un usuario
export const crearUsuario = async (data: any) => {
  const { nombre, apellido, correo, contraseña, id_rol } = data;

  const hash = await bcrypt.hash(contraseña, 10);

  // Insertamos el usuario en la tabla `usuarios`
  const [result]: any = await db.query(
    `
    INSERT INTO usuarios (nombre, apellido, correo, contraseña, estado, fecha_creacion)
    VALUES (?, ?, ?, ?, 1, NOW()) 
  `,
    [nombre, apellido, correo, hash]
  );

  // Insertamos la relación con el rol en la tabla `usuario_rol`
  await db.query(
    `
    INSERT INTO usuario_rol (id_usuario, id_rol)
    VALUES (?, ?)
  `,
    [result.insertId, id_rol]
  );

  return { id: result.insertId, nombre, apellido, correo, id_rol };
};

// Función para editar un usuario
// ... (dentro de usuarios.service.ts)

export const editarUsuario = async (id: number, data: any) => {
  const { nombre, apellido, correo, id_rol, foto } = data;

  // VALIDACIÓN DE SEGURIDAD:
  // Si los datos llegan vacíos, no ejecutamos la actualización para evitar corromper el usuario.
  if (!nombre && !apellido && !correo && !foto) {
     throw new Error("No se enviaron datos para actualizar");
  }

  // Construcción dinámica de la consulta para solo actualizar lo que se envía
  let campos = [];
  let params = [];

  if (nombre) { campos.push("nombre=?"); params.push(nombre); }
  if (apellido) { campos.push("apellido=?"); params.push(apellido); }
  if (correo) { campos.push("correo=?"); params.push(correo); }
  if (foto) { campos.push("foto=?"); params.push(foto); }

  // Si no hay nada que actualizar, salimos
  if (campos.length === 0 && !id_rol) return;

  if (campos.length > 0) {
    const query = `UPDATE usuarios SET ${campos.join(", ")} WHERE id_usuario=?`;
    params.push(id);
    await db.query(query, params);
  }

  // 2. Actualizar rol (solo si viene id_rol)
  if (id_rol) {
    await db.query(`UPDATE usuario_rol SET id_rol=? WHERE id_usuario=?`, [
      id_rol,
      id,
    ]);
  }

  // Devolvemos los datos combinados para el frontend
  return { id, nombre, apellido, correo, id_rol, foto };
};
// Función para cambiar el estado de un usuario
export const cambiarEstadoUsuario = async (id: number) => {
  await db.query(
    `
    UPDATE usuarios
    SET estado = NOT estado
    WHERE id_usuario = ?
  `,
    [id]
  );

  return { id, mensaje: "Estado actualizado" };
};
