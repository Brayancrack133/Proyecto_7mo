import "dotenv/config";
import express from "express";
// import cors from "cors"; // YA NO NECESITAS LA LIBRERÍA DE CORS
import session from "express-session"; 
import passport from "passport";       
import path from "path";
import { fileURLToPath } from 'url';
import riesgosRoutes from "./routes/riesgos.routes.js";

import { db } from "./config/db.js";

// 1. Configuración de Estrategias de Passport (Del MAIN)
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
import authGoogleRoutes from "./routes/googleauth.routes.js"; 
import githubAuthRoutes from "./routes/githubaunth.js";       
import proyectosiaRoutes from "./routes/proyectosia.routes.js";
import proyecto_principal_routes from "./routes/proyectoPrincipal.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js"; 
import asistenteRoutes from "./routes/asistente.routes.js"; // TU RUTA DE CHAT

const app = express();

// ==========================================
// MIDDLEWARES (EL ORDEN ES CRÍTICO AQUÍ)
// ==========================================

// 👇 1. CORS MANUAL ROBUSTO (Debe ir primero para atrapar OPTIONS)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    // Manejar la petición OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    
    next();
});

// 👇 2. BODY PARSER (Debe ir después de CORS para leer JSON)
app.use(express.json());
// Eliminamos la línea duplicada app.use(express.json()); que tenías abajo.

// 3. CONFIGURACIÓN DE SESIÓN Y AUTENTICACIÓN (Passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mi_super_secreto_123",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, 
  })
);
app.use(passport.initialize());
app.use(passport.session());

// 4. ARCHIVOS ESTÁTICOS (Para subir documentos)
app.use('/uploads', express.static('uploads'));


// ==========================================
// DEFINICIÓN DE RUTAS (Debe ir al final)
// ==========================================

// Rutas de IA y Riesgos
app.use("/api/asistente", asistenteRoutes); // 👈 TU CHAT
app.use("/api/riesgos", riesgosRoutes); // 👈 TU DETECTOR DE RIESGOS

// Rutas de Autenticación
app.use("/api/auth", authRoutes);
app.use("/auth", authGoogleRoutes);
app.use("/auth", githubAuthRoutes);

// Rutas del Sistema Base
app.use("/api/usuarios", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api", proyectosRoutes); 
app.use("/api", tareasRoutes);    
app.use("/api", notificacionesRoutes);
app.use("/api", chatRoutes);

// Rutas explícitas
app.use("/api/documentos", documentosRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/proyecto-principal", proyecto_principal_routes);
app.use("/api/proyectos-ia", proyectosiaRoutes);


// Ruta de prueba
app.get("/", (req, res) => {
  res.send("🚀 Backend funcionando y DB conectada");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔥 Servidor escuchando en puerto ${PORT}`);
});