// src/routes/AppRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../components/templates/DashboardLayout/DashboardLayout';

// Importar páginas
import { Repository } from '../pages/Repository/Repository'; 
import ProjectManagementPage from "../pages/ProjectManagementPage";

export const AppRoutes: React.FC = () => {
  return (
    <DashboardLayout>
      <Routes>
        {/* Ruta raíz del dashboard - redirige a proyectos */}
        <Route path="/" element={<Navigate to="/proyectos" replace />} />

        {/* Módulos del sistema */}
        <Route path="/proyectos" element={<ProjectManagementPage />} />
        <Route path="/repositorio" element={<Repository />} />
        <Route path="/planificacion" element={<h1>Módulo: Planificación</h1>} />
        <Route path="/colaboracion" element={<h1>Módulo: Colaboración</h1>} />
        <Route path="/ia" element={<h1>Módulo: IA Predictiva</h1>} />
        <Route path="/panel" element={<h1>Módulo: Panel Analítico</h1>} />
        <Route path="/configuracion" element={<h1>Módulo: Configuración</h1>} />

        {/* 404 dentro del dashboard */}
        <Route path="*" element={<h1>404 | Página No Encontrada</h1>} />
      </Routes>
    </DashboardLayout>
  );
};