// index.ts

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";

dotenv.config();
import "./config/db.js";
import "./auth/google.js"; // <-- IMPORTANTE
import "./auth/github.js";

import authRoutes from "./routes/auth.routes.js";
import proyectosRoutes from "./routes/proyectos.routes.js"; // <-- La ruta que necesitamos
import tareasRoutes from "./routes/tareas.routes.js";
import userRoutes from "./routes/usuarios.routes.js";
import roleRoutes from "./routes/roles.routes.js";
import authGoogleRoutes from "./routes/googleauth.routes.js";
import githubAuthRoutes from "./routes/githubaunth.js";

const app = express();

// 1️⃣ Sesión
app.use(
  session({
    secret: "mi_super_secreto_123",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// 2️⃣ Passport
app.use(passport.initialize());
app.use(passport.session());

// 3️⃣ Middlewares normales
app.use(cors());
app.use(express.json());

// 4️⃣ Rutas
app.use("/api/auth", authRoutes);
// AÑADIR ESTA LÍNEA PARA MONTAR TODAS las rutas de proyectos:
app.use("/api", proyectosRoutes); // 🔥 CORRECCIÓN: Esto mapea /proyectos y /mis-proyectos a /api/...
app.use("/api/tareas", tareasRoutes);
app.use("/api/usuarios", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/auth", authGoogleRoutes);
app.use("/auth", githubAuthRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Backend funcionando y DB conectada");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔥 Servidor escuchando en puerto ${PORT}`);
});
