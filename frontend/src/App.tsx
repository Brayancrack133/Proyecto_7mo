import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProjectManagementPage from "./pages/ProjectManagementPage";
import { AppRoutes } from './routes/AppRoutes'; 

function App() {
  return (
    <BrowserRouter>
      {/* ESTE ES EL ÚNICO COMPONENTE <Routes> PERMITIDO */}
      <Routes>
        {/* 1. Rutas definidas directamente en App */}
        <Route path="/" element={<Navigate to="/proyectos" replace />} />
        {/* Si /proyectos está definido en AppRoutes, puedes quitar esta línea de aquí: */}
        <Route path="/proyectos" element={<ProjectManagementPage />} /> 
        
        {/* 2. Carga todas las rutas definidas en AppRoutes (que ahora devuelve un Fragment con solo <Route>) */}
        <AppRoutes /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;