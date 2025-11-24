import type { Request, Response } from "express";
import { db } from "../config/db.js";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";

// ----------------------- REGISTRO -----------------------
export const register = async (req: Request, res: Response) => {
  const { nombre, apellido, correo, password, contraseña } = req.body;
  
  // Aceptamos cualquiera de los dos nombres
  const passFinal = password || contraseña;

  try {
    const [user]: any = await db.query(
      "SELECT * FROM Usuarios WHERE correo = ?",
      [correo]
    );

    if (user.length > 0) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }

    const hashedPassword = await hashPassword(passFinal);

    const [result]: any = await db.query(
      "INSERT INTO Usuarios (nombre, apellido, correo, contraseña, estado) VALUES (?, ?, ?, ?, 1)",
      [nombre, apellido, correo, hashedPassword]
    );

    const userId = result.insertId;

    // Asignar rol por defecto (Usuario = 2)
    await db.query(
      "INSERT INTO Usuario_Rol (id_usuario, id_rol) VALUES (?, ?)",
      [userId, 2] 
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
  // 1. RECIBIMOS AMBOS POR SI ACASO
  const { correo, password, contraseña } = req.body;

  // 2. USAMOS EL QUE VENGA DEFINIDO (Igual que en registro)
  const passFinal = password || contraseña;

  console.log("------------------------------------------------");
  console.log("📩 Login recibido para:", correo);
  // Verificamos si llegó la contraseña
  console.log("🔑 Contraseña recibida:", passFinal ? "****** (OK)" : "UNDEFINED ❌"); 
  console.log("------------------------------------------------");

  // Validación de seguridad
  if (!passFinal) {
      return res.status(400).json({ mensaje: "Falta la contraseña" });
  }

  try {
    const [rows]: any = await db.query(
      "SELECT * FROM Usuarios WHERE correo = ?",
      [correo]
    );

    if (rows.length === 0) {
      console.log("❌ Usuario no encontrado");
      return res.status(401).json({ mensaje: "Credenciales incorrectas" });
    }

    const usuario = rows[0];
    console.log("✅ Usuario encontrado:", usuario.correo);

    // 3. Comparar usando 'passFinal'
    const passwordMatch = await comparePassword(
      passFinal,
      usuario.contraseña
    );

    // --- PARCHE: Permitir login si es texto plano (para tu usuario Admin manual) ---
    let esValido = passwordMatch;
    if (!esValido && passFinal === usuario.contraseña) {
        console.log("⚠️ Advertencia: Login con texto plano permitido temporalmente.");
        esValido = true;
    }
    // -----------------------------------------------------------------------------

    if (!esValido) {
      console.log("❌ Contraseña incorrecta");
      return res.status(401).json({ mensaje: "Credenciales incorrectas" });
    }

    // 4. Obtener rol
    const [roles]: any = await db.query(
      `SELECT r.nombre_rol 
       FROM Roles r
       JOIN Usuario_Rol ur ON ur.id_rol = r.id_rol
       WHERE ur.id_usuario = ?`,
      [usuario.id_usuario]
    );

    const rol = roles.length > 0 ? roles[0].nombre_rol : "Sin rol";
    console.log("🚀 Login exitoso. Rol:", rol);

    res.json({
      mensaje: "Login exitoso",
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        rol: rol
      }
    });

  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ error: err });
  }
};