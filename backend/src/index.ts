// backend/src/index.ts

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session"; // <--- Necesario para Passport
import passport from "passport";       // <--- Necesario para Passport
import path from "path";
import { fileURLToPath } from 'url';

// Inicializar DB e importar configuración
import { db } from "./config/db.js";
import "./config/db.js"; 

// 1. Configuración de Estrategias de Passport (IMPORTANTE)
import "./auth/google.js"; 
import "./auth/github.js";

// 2. Importar rutas
import authRoutes from "./routes/auth.routes.js";
import proyectosRoutes from "./routes/proyectos.routes.js";
import tareasRoutes from "./routes/tareas.routes.js";
import documentosRoutes from "./routes/documentos.routes.js";
import notificacionesRoutes from "./routes/notificaciones.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import userRoutes from "./routes/usuarios.routes.js";
import roleRoutes from "./routes/roles.routes.js";
// Rutas de Autenticación Social
import authGoogleRoutes from "./routes/googleauth.routes.js"; // <--- RESTAURADO
import githubAuthRoutes from "./routes/githubaunth.js";       // <--- RESTAURADO
// Rutas IA
import proyectosiaRoutes from "./routes/proyectosia.routes.js";

dotenv.config();

const app = express();

// ==========================================
// MIDDLEWARES
// ==========================================
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Configuración de Sesión (Requerida por Passport)
app.use(
  session({
    secret: "mi_super_secreto_123", // Cambia esto en producción
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // true si usas HTTPS
  })
);

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());


// ==========================================
// DEFINICIÓN DE RUTAS
// ==========================================

// 1. Rutas de Autenticación
app.use("/api/auth", authRoutes);
app.use("/auth", authGoogleRoutes); // <--- Habilita /auth/google
app.use("/auth", githubAuthRoutes); // <--- Habilita /auth/github

// 2. Rutas del Sistema
app.use("/api/usuarios", userRoutes);
app.use("/api/roles", roleRoutes);

// Rutas funcionales (Montadas en /api)
app.use("/api", proyectosRoutes); 
app.use("/api", tareasRoutes);    
app.use("/api", notificacionesRoutes);
app.use("/api", chatRoutes);
app.use("/api", documentosRoutes);

// 3. Rutas de IA
app.use("/api/proyectos", proyectosiaRoutes); 

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("🚀 Backend funcionando y DB conectada");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔥 Servidor escuchando en puerto ${PORT}`);
});