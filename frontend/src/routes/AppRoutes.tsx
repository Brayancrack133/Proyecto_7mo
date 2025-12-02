import { Routes, Route, Navigate } from "react-router-dom";
// Si mantuviste "export const" en el layout, usa llaves { }. Si es "export default", quítalas.
import { DashboardLayout } from "../components/templates/DashboardLayout/DashboardLayout";

import ProjectManagementPage from "../pages/gestion_proyectos/ProjectManagementPage";
import ProjectCreationForm from "../pages/gestion_proyectos/ProjectCreationForm";
import { Repository } from "../pages/Repository/Repository";

// 👇 1. IMPORTAR EL COMPONENTE DASHBOARD (Donde está el Riesgo IA)
import Dashboard from "../components/organisms/Dashboard";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Redirección inicial: Puedes cambiar a "/panel" si quieres ver las gráficas al entrar */}
      <Route path="/" element={<Navigate to="/panel" replace />} />

      {/* Rutas dentro del DashboardLayout (Incluye Sidebar y Chat Flotante) */}
      <Route element={<DashboardLayout />}>
        
        {/* 👇 2. CONECTAR LA RUTA AL COMPONENTE REAL */}
        <Route path="/panel" element={<Dashboard />} />

        <Route path="/proyectos" element={<ProjectManagementPage />} />
        <Route path="/proyectos/crear" element={<ProjectCreationForm />} />
        <Route path="/repositorio" element={<Repository />} />
        
        {/* Placeholders para futuros módulos */}
        <Route path="/planificacion" element={<h1>Módulo: Planificación</h1>} />
        <Route path="/colaboracion" element={<h1>Módulo: Colaboración</h1>} />
        <Route path="/ia" element={<h1>Módulo: IA Predictiva</h1>} />
        <Route path="/configuracion" element={<h1>Módulo: Configuración</h1>} />
      </Route>

      {/* Página 404 */}
      <Route path="*" element={<h1>404 | Página No Encontrada</h1>} />
    </Routes>
  );
};