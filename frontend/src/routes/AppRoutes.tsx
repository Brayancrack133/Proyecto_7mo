import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// 1. Importar la plantilla y la ruta privada (que ya creamos)
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { PrivateRoute } from './PrivateRoute';

// 2. Importar las páginas que mostrará
import Dashboard from '../pages/Dashboard/Dashboard'; // Asumiendo la ruta
import TaskDetail from '../pages/Tasks/TaskDetail';   // Asumiendo la ruta
import { ProjectCreationPage } from '../pages/ProjectCreation';
export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Ruta principal que redirige al dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Rutas Privadas (dentro del Dashboard)
        Esto crea la "ruta anidada" que usa el <Outlet>
      */}
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        {/* La página "índice" del dashboard */}
        <Route index element={<Dashboard />} /> 

        {/* La página de detalle de tareas (para tu modal) */}
        <Route path="tasks/:taskId" element={<TaskDetail />} />
        <Route path="new-project" element={<ProjectCreationPage />} />
        {/* (Aquí irían las otras rutas: "users", "projects", etc.) */}
      </Route>

      {/* (Aquí irían tus rutas públicas si las tuvieras)
        <Route path="/login" element={<LoginPage />} />
      */}

      {/* (Opcional) Una ruta "catch-all" para 404 */}
      <Route path="*" element={<div><h2>404: Página No Encontrada</h2></div>} />

    </Routes>
  );
};