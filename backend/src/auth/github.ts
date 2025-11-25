import passport from "passport";
// @ts-ignore: no type declarations for 'passport-github2'
import { Strategy as GitHubStrategy } from "passport-github2";
import { db } from "../config/db.js";

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: process.env.GITHUB_CALLBACK_URL!,
      scope: ["user:email"],
    },
    async (_accessToken: any, _refreshToken: any, profile: { emails: { value: string; }[]; username: any; displayName: any; photos: { value: string; }[]; }, done: (arg0: unknown, arg1: { id_usuario: any; nombre: any; apellido: string; correo: any; foto: any; } | undefined) => any) => {
      try {
        const email =
          profile.emails?.[0]?.value || `${profile.username}@github_nocorreo.com`;

        // Buscar usuario
        const [rows]: any = await db.query(
          "SELECT * FROM usuarios WHERE correo=?",
          [email]
        );

        if (rows.length > 0) {
          return done(null, rows[0]);
        }

        // Crear usuario nuevo
        const nombre = profile.displayName || profile.username;
        const foto = profile.photos?.[0]?.value || "";

        const [result]: any = await db.query(
          `INSERT INTO usuarios (nombre, apellido, correo, contraseña, estado, fecha_creacion)
           VALUES (?, '', ?, 'GITHUB_LOGIN', '1', NOW())`,
          [nombre, email]
        );

        // Rol por defecto = Cliente
        await db.query(
          `INSERT INTO usuario_rol (id_usuario, id_rol) VALUES (?, ?)`,
          [result.insertId, 4]
        );

        return done(null, {
          id_usuario: result.insertId,
          nombre,
          apellido: "",
          correo: email,
          foto,
        });
      } catch (error) {
        console.error("Error GitHubStrategy:", error);
        return done(error, undefined);
      }
    }
  )
);

export default passport;
