import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProjectManagementPage from "./pages/gestion_proyectos/ProjectManagementPage";
import Project from "./pages/gestion_proyectos/Project";


function App() {
  return (
   <BrowserRouter>
      <Routes>
       
        <Route path="/" element={<Project />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
