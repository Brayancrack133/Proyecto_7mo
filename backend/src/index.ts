import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session"; // <--- Necesario para Passport
import passport from "passport";       // <--- Necesario para Passport
import path from "path";
import { fileURLToPath } from 'url';

// Cargar variables de entorno
dotenv.config();

// Inicializar DB (Importar el pool configurado)
// NOTA: Asegúrate de que en db.ts hayas aceptado TU versión (con SSL/TiDB)
import { db } from "./config/db.js";

// 1. Configuración de Estrategias de Passport (Del MAIN)
import "./auth/google.js"; 
import "./auth/github.js";

// 2. Importar rutas (Combinación de ambas ramas)
import authRoutes from "./routes/auth.routes.js";
import proyectosRoutes from "./routes/proyectos.routes.js";
import tareasRoutes from "./routes/tareas.routes.js";
import documentosRoutes from "./routes/documentos.routes.js";
import notificacionesRoutes from "./routes/notificaciones.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import userRoutes from "./routes/usuarios.routes.js";
import roleRoutes from "./routes/roles.routes.js";

// Rutas de Autenticación Social (Del MAIN)
import authGoogleRoutes from "./routes/googleauth.routes.js"; 
import githubAuthRoutes from "./routes/githubaunth.js";       

// Rutas de IA (TUYAS)
import proyectosiaRoutes from "./routes/proyectosia.routes.js";

const app = express();

// ==========================================
// MIDDLEWARES
// ==========================================
// CORS: Es vital dejarlo al principio para que el Frontend no falle
app.use(cors({
    origin: 'http://localhost:5173', // Ajusta si es necesario
    credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Configuración de Sesión (Requerida por Passport - Del MAIN)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mi_super_secreto_123", // Mejor usar .env
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Poner true si usas HTTPS en producción
  })
);

// Inicializar Passport (Del MAIN)
app.use(passport.initialize());
app.use(passport.session());


// ==========================================
// DEFINICIÓN DE RUTAS
// ==========================================

// 1. Rutas de Autenticación
app.use("/api/auth", authRoutes);
app.use("/auth", authGoogleRoutes); // <--- Habilita /auth/google
app.use("/auth", githubAuthRoutes); // <--- Habilita /auth/github

// 2. Rutas del Sistema Base
app.use("/api/usuarios", userRoutes);
app.use("/api/roles", roleRoutes);

// 3. Rutas funcionales (Montadas en /api)
app.use("/api", proyectosRoutes); 
app.use("/api", tareasRoutes);    
app.use("/api", notificacionesRoutes);
app.use("/api", chatRoutes);
app.use("/api", documentosRoutes);

// 4. Rutas de IA (TUYAS - Con el prefijo correcto que definimos hoy)
app.use("/api/proyectos-ia", proyectosiaRoutes);


// Ruta de prueba
app.get("/", (req, res) => {
  res.send("🚀 Backend funcionando y DB conectada");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔥 Servidor escuchando en puerto ${PORT}`);
});