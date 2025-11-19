// src/App.tsx
import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom"
import React from 'react';

// Importamos el contexto
import { UserProvider } from './context/UserContext'; 

// Componentes de Autenticación
import Login from "./pages/Login/Login";
import Register from "./pages/Registro/Register";

// Rutas internas del Dashboard
import { AppRoutes } from './routes/AppRoutes'; 

// Importar estilos
import "./App.css"; 

// ============================================================================
// AuthWrapper para proteger rutas
// ============================================================================
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

// ============================================================================
// COMPONENTE PRINCIPAL APP
// ============================================================================
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem('token')
  );

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
                        to={isAuthenticated ? "/dashboard/proyectos" : "/login"} 
                        className="btn-main"
                      >
                        Empezar
                      </Link>
                      <p className="descripcion">
                        Future Plan es una plataforma de planificación y gestión de proyectos 
                        que integra Inteligencia Artificial.
                      </p>
                    </div>
                    <div className="main-image">
                      <img 
                        src="https://placehold.co/400x300/e0e0e0/000000?text=Future+Plan" 
                        alt="Future Plan" 
                      />
                    </div>
                  </section>
                  
                  <section className="features">
                    <div className="feature">
                      <h3>Planificación inteligente</h3>
                      <p>La IA sugiere metodologías según tu proyecto.</p>
                    </div>
                    <div className="feature">
                      <h3>Productividad optimizada</h3>
                      <p>KPIs y alertas tempranas automáticas.</p>
                    </div>
                  </section>

                  <footer className="footer-landing">
                    <p>&copy; {new Date().getFullYear()} FUTURE PLAN.</p>
                  </footer>
                </div>
              }
            />

            {/* ========== AUTENTICACIÓN ========== */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ========== DASHBOARD PROTEGIDO ========== */}
            <Route 
              path="/dashboard/*" 
              element={
                <AuthWrapper isAuthenticated={isAuthenticated}>
                  <AppRoutes /> 
                </AuthWrapper>
              } 
            />

            {/* ========== 404 ========== */}
            <Route 
              path="*" 
              element={
                <div style={{ textAlign: 'center', padding: '50px' }}>
                  <h1>404 - Página no encontrada</h1>
                  <Link to="/">Volver al inicio</Link>
                </div>
              } 
            />
          
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;