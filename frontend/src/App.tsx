import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom"
import React from 'react';

// Contexto
import { UserProvider } from './context/UserContext'; 

// Páginas
import Login from "./pages/Login/Login";
import Register from "./pages/Registro/Register";
import CrearProyecto from "./pages/CrearProyecto"; // <--- 1. IMPORTAMOS LA NUEVA PÁGINA

// Rutas internas
import { AppRoutes } from './routes/AppRoutes'; 

// Estilos
import "./App.css"; 

interface AuthWrapperProps {
    children: React.ReactNode;
    isAuthenticated: boolean;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children, isAuthenticated }) => {
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />; 
    }
    return <>{children}</>;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);



  return (
    <div className="principal">
      <BrowserRouter>
        <UserProvider>
          <Routes>
            
            {/* ========== LANDING PAGE ========== */}
            <Route
              path="/"
              element={
                <div className="landing-container">
                  <nav className="navbar">
                    <ul>
                      <li><Link to="/">Inicio</Link></li>
                      <li><Link to="/nosotros">Nosotros</Link></li>
                      <li>
                        <Link to={isAuthenticated ? "/dashboard/proyectos" : "/login"}>
                          Mis Proyectos
                        </Link>
                      </li> 
                      
                      {/* 2. BOTÓN NUEVO: CREAR PROYECTO */}
                      <li>
                        <Link 
                           to="/dashboard/crear-proyecto"
                           style={{ 
                             backgroundColor: '#dd9d52', 
                             color: '#000', 
                             padding: '8px 15px', 
                             borderRadius: '20px',
                             fontWeight: 'bold' 
                           }}
                        >
                          + Nuevo Proyecto
                        </Link>
                      </li>

                      <li><Link to="/contacto">Contacto</Link></li>
                      <li>
                        {isAuthenticated ? (
                          <Link to="/dashboard">Dashboard</Link>
                        ) : (
                          <Link to="/login">Iniciar Sesión</Link>
                        )}
                      </li>
                    </ul>
                  </nav>

                  <section className="hero">
                    <div className="hero-text">
                      <h1 className="logo">FUTURE PLAN</h1>
                      <p className="slogan">"La forma inteligente de organizar tus proyectos"</p>
                      <Link 
                        to={isAuthenticated ? "/dashboard/crear-proyecto" : "/login"} 
                        className="btn-main"
                      >
                        Empezar
                      </Link>
                    </div>
                    <div className="main-image">
                      {/* Aquí va tu imagen del dashboard o robot */}
                    </div>
                  </section>
                </div>
              }
            />

            {/* ========== RUTAS AUTH ========== */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ========== RUTAS DASHBOARD ========== */}
            
            {/* 3. RUTA NUEVA PARA CREAR PROYECTO */}
            {/* La ponemos fuera de AppRoutes si quieres que tenga el Layout específico que creamos */}
            <Route 
              path="/dashboard/crear-proyecto" 
              element={
                <AuthWrapper isAuthenticated={isAuthenticated}>
                   <CrearProyecto />
                </AuthWrapper>
              } 
            />

            {/* Rutas generales del dashboard */}
            <Route 
              path="/dashboard/*" 
              element={
                <AuthWrapper isAuthenticated={isAuthenticated}>
                  <AppRoutes /> 
                </AuthWrapper>
              } 
            />

            {/* 404 */}
            <Route path="*" element={<h1>404 - No encontrado</h1>} />
          
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;