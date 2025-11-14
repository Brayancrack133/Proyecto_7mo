import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Repository } from '../pages/Repository/Repository';
// Asumimos que has creado index.ts para Repository.
// Para Home y Login, usaremos placeholders si no existen aún:
// import { Home } from '../pages/Home'; 
// import { Login } from '../pages/Login'; 

export const AppRoutes: React.FC = () => {
    return (
        <Routes>

            {/* 🛑 RUTA RAÍZ (/) - AÑADIDA 🛑 */}
            {/* Cuando el usuario va a '/', lo redirigimos a /repositorio temporalmente */}
            <Route path="/" element={<Navigate to="/repositorio" replace />} />

            {/* RUTA DE LOGIN (Si existe) */}
            <Route path="/login" element={<h1>Página de Login (Pendiente)</h1>} />

            {/* Rutas del Sistema (Dashboard) */}

            {/* Ruta para ver el Repositorio (Módulo de Documentos) */}
            <Route path="/repositorio" element={<Repository />} />

            {/* Rutas de Módulos (Temporalmente con texto placeholder) */}
            <Route path="/proyectos" element={<h1>Módulo: Mis Proyectos</h1>} />
            <Route path="/planificacion" element={<h1>Módulo: Planificación</h1>} />
            <Route path="/ia" element={<h1>Módulo: IA Predictiva</h1>} />
            <Route path="/configuracion" element={<h1>Módulo: Configuración</h1>} />

            {/* Ruta para errores (404) */}
            <Route path="*" element={<h1>404 | Página No Encontrada</h1>} />
        </Routes>
    );
};