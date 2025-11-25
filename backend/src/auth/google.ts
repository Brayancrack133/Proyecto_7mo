// backend/src/auth/google.ts
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { db } from "../config/db.js";

// ====================================================
// 🔹 SERIALIZAR → Guarda solo el ID del usuario en la sesión
// ====================================================
passport.serializeUser((user: any, done) => {
  done(null, user.id_usuario);
});

// ====================================================
// 🔹 DESERIALIZAR → Usa el ID para obtener el usuario real
// ====================================================
passport.deserializeUser(async (id: number, done) => {
  try {
    const [rows]: any = await db.query(
      "SELECT * FROM usuarios WHERE id_usuario = ?",
      [id]
    );
    done(null, rows[0]);
  } catch (err) {
    done(err, null);
  }
});

// ====================================================
// 🔹 ESTRATEGIA GOOGLE OAUTH
// ====================================================
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!, // http://localhost:3000/auth/google/callback
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;

        // Buscar si ya existe
        const [rows]: any = await db.query(
          "SELECT * FROM usuarios WHERE correo = ?",
          [email]
        );

        if (rows.length > 0) {
          return done(null, rows[0]);
        }

        // Crear si no existe
        const nombre = profile.name?.givenName ?? "";
        const apellido = profile.name?.familyName ?? "";
        const foto = profile.photos?.[0].value ?? "";

        const [result]: any = await db.query(
          `INSERT INTO usuarios (nombre, apellido, correo, contraseña, estado, fecha_creacion)
           VALUES (?, ?, ?, 'GOOGLE_LOGIN', 1, NOW())`,
          [nombre, apellido, email]
        );

        // Rol por defecto = Cliente (id_rol = 4 según tu sistema)
        await db.query(
          `INSERT INTO usuario_rol (id_usuario, id_rol)
           VALUES (?, ?)`,
          [result.insertId, 4]
        );

        return done(null, {
          id_usuario: result.insertId,
          nombre,
          apellido,
          correo: email,
          foto,
        });
      } catch (error) {
        console.error("Error en GoogleStrategy:", error);
        return done(error);
      }
    }
  )
);

export default passport;
