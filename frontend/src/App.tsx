import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProjectManagementPage from "./pages/ProjectManagementPage";

function App() {
  return (
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/proyectos" replace />} />
        <Route path="/proyectos" element={<ProjectManagementPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
