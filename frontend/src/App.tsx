import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProjectManagementPage from "./pages/ProjectManagementPage";

// 1. Necesitas BrowserRouter para que React Router funcione
import { BrowserRouter } from 'react-router-dom'; 
// 2. Importas el archivo de rutas que acabamos de completar
import { AppRoutes } from './routes/AppRoutes'; 

function App() {
  return (
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/proyectos" replace />} />
        <Route path="/proyectos" element={<ProjectManagementPage />} />
      </Routes>
    </BrowserRouter>
  );
    // BrowserRouter debe envolver toda la aplicación para manejar las URLs
    <BrowserRouter> 
      {/* AppRoutes contiene todas las definiciones de <Route path="..."> */}
      <AppRoutes /> 
    </BrowserRouter>
  );
}

export default App;

// 3. Exportación por defecto, como exige main.tsx
export default App;