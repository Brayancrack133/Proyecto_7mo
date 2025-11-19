import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { Repository } from '../pages/Repository/Repository'; 
// Asegúrate de que este componente exista:
import ProjectManagementPage from "../pages/ProjectManagementPage";

// IMPORTANTE: Este componente ahora retorna directamente un Fragment con las <Route>
// y NO un componente <Routes> para poder ser usado en el archivo App.jsx
export const AppRoutes: React.FC = () => {
    return (
        <>
            {/* RUTA RAÍZ (/) - Redirige a /proyectos (Según tu App.jsx original) */}
            {/* Este path debe ser manejado en App.jsx, pero lo dejo aquí por si lo quieres mover: */}
            {/* <Route path="/" element={<Navigate to="/proyectos" replace />} /> */}

            {/* RUTA DE LOGIN (Si existe) */}
            <Route path="/login" element={<h1>Página de Login (Pendiente)</h1>} />

            {/* Rutas del Sistema (Dashboard) */}

            {/* Ruta para ver el Repositorio (Módulo de Documentos) */}
            <Route path="/repositorio" element={<Repository />} />

            {/* Rutas de Módulos (Temporalmente con texto placeholder) */}
            <Route path="/proyectos" element={<ProjectManagementPage />} />
            <Route path="/planificacion" element={<h1>Módulo: Planificación</h1>} />
            <Route path="/ia" element={<h1>Módulo: IA Predictiva</h1>} />
            <Route path="/configuracion" element={<h1>Módulo: Configuración</h1>} />

            {/* Ruta para errores (404) */}
            <Route path="*" element={<h1>404 | Página No Encontrada</h1>} />
        </>
    );
};