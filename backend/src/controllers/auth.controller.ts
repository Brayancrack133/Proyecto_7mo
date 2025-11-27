import type { Request, Response } from "express";
import  {db}  from "../config/db.js";


import { hashPassword, comparePassword } from "../utils/bcrypt.js";

// ----------------------- REGISTRO -----------------------
export const register = async (req: Request, res: Response) => {
  const { nombre, apellido, correo, contraseña } = req.body;

  try {
    // 1. Verificar si el correo ya existe
    const [user]: any = await db.query(
      "SELECT * FROM usuarios WHERE correo = ?",
      [correo]
    );

    if (user.length > 0) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }

    // 2. Encriptar contraseña
    const hashedPassword = await hashPassword(contraseña);

    // 3. Registrar usuario
    const [result]: any = await db.query(
      "INSERT INTO usuarios (nombre, apellido, correo, contraseña, estado) VALUES (?, ?, ?, ?, 1)",
      [nombre, apellido, correo, hashedPassword]
    );

    const userId = result.insertId;

    // 4. Asignar rol por defecto → Cliente (4)
    await db.query(
      "INSERT INTO usuario_rol (id_usuario, id_rol) VALUES (?, ?)",
      [userId, 2] // <--- CAMBIADO: De 4 a 2
    );

    res.json({
      mensaje: "Usuario registrado correctamente",
      id_usuario: userId
    });

  } catch (err) {
    console.error("Error en registro:", err);
    res.status(500).json({ error: err });
  }
};

// ----------------------- LOGIN -----------------------
export const login = async (req: Request, res: Response) => {
  const { correo, contraseña } = req.body;

  try {
    const [rows]: any = await db.query(
      "SELECT * FROM usuarios WHERE correo = ?",
      [correo]
    );

    if (rows.length === 0) {
      return res.status(401).json({ mensaje: "Credenciales incorrectas" });
    }

    const usuario = rows[0];

    // 2. Comparar contraseña
    const passwordMatch = await comparePassword(
      contraseña,
      usuario.contraseña
    );

    if (!passwordMatch) {
      return res.status(401).json({ mensaje: "Credenciales incorrectas" });
    }

    // 3. Obtener rol
    const [roles]: any = await db.query(
      `SELECT r.nombre_rol 
       FROM roles r
       JOIN usuario_rol ur ON ur.id_rol = r.id_rol
       WHERE ur.id_usuario = ?`,
      [usuario.id_usuario]
    );

    res.json({
      mensaje: "Login exitoso",
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        rol: roles[0]?.nombre_rol || "Sin rol"
      }
    });

  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ error: err });
  }
};
