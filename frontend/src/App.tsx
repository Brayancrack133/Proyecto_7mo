import React, { ReactNode } from 'react'; // Importamos ReactNode para el tipado de 'children'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
// Componentes de Autenticación/Usuarios
import Login from "./pages/Login/Login";
import Register from "./pages/Registro/Register";
import GestUser from "./pages/Gest_user/Gest_user";
// Rutas internas del Dashboard
import { AppRoutes } from './routes/AppRoutes'; 
// Importar estilos si son necesarios para la Landing Page
import "./App.css"; 

// 1. DEFINICIÓN DE INTERFAZ PARA LAS PROPIEDADES DE AuthWrapper
interface AuthWrapperProps {
    children: ReactNode; // El contenido que envuelve (las rutas)
    isAuthenticated: boolean; // El estado de autenticación
}

// Componente Wrapper para proteger rutas que requieren autenticación
// Se usa React.FC<AuthWrapperProps> para tipar las propiedades de forma explícita.
const AuthWrapper: React.FC<AuthWrapperProps> = ({ children, isAuthenticated }) => {
    // **NOTA**: Aquí debes implementar la lógica de estado de sesión real.
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />; 
    }
    // Si está autenticado, renderiza las rutas hijas (AppRoutes)
    return <>{children}</>;
};


function App() {
  // Aquí puedes agregar la lógica para verificar si el usuario está logueado
  // **CAMBIA ESTO** por tu estado de autenticación real (ej: useState o Context)
  const isAuthenticated = false; 

  return (
    <div className="principal">
      <Router>
        <Routes>
          
          {/* 1. RUTA DE ATERRIZAJE (LANDING PAGE) - path="/" */}
          <Route
            path="/"
            element={
              <div className="landing-container">
                {/* 🔹 NAVBAR SUPERIOR */}
                <nav className="navbar">
                  <ul>
                    <li><Link to="/">Inicio</Link></li>
                    <li><Link to="/nosotros">Nosotros</Link></li>
                    {/* El link lleva a /proyectos si está auth, sino a /login */}
                    <li><Link to={isAuthenticated ? "/proyectos" : "/login"}>Mis Proyectos</Link></li> 
                    <li><Link to="/Login">Administración</Link></li>
                    <li><Link to="/contacto">Contacto</Link></li>
                  </ul>
                </nav>

                {/* 🔹 SECCIÓN HERO y demás contenido de la Landing Page */}
                <section className="hero">
                  <div className="hero-text">
                    <h1 className="logo">FUTURE PLAN</h1>
                    <p className="slogan">“La forma inteligente de organizar tus proyectos”</p>
                    {/* Botón Empezar */}
                    <Link to={isAuthenticated ? "/proyectos" : "/login"} className="btn-main">Empezar</Link>
                    <p className="descripcion">
                      Future Plan es una plataforma de planificación y gestión de proyectos 
                      que integra Inteligencia Artificial para recomendar metodologías, estimar 
                      tiempos y mejorar la productividad de los equipos.
                    </p>
                  </div>
                  {/* Se reemplaza la ruta local de la imagen por un placeholder para evitar fallos */}
                  <div className="main-image"> <div className="parent"> <div className="card"> <img className="imgmain" src="https://placehold.co/400x300/e0e0e0/000000?text=Project+App" alt="Imagen principal" /> </div> </div> </div>
                </section>
                
                {/* 🔹 SECCIÓN DE FEATURES */}
                <section className="features">
                  <div className="feature">
                    <img src="https://placehold.co/100x100/f0f0f0/333333?text=IA" alt="IA" />
                    <h3>Planificación inteligente</h3>
                    <p>La IA sugiere metodologías y etapas según tu proyecto.</p>
                  </div>
                  <div className="feature">
                    <img src="https://placehold.co/100x100/f0f0f0/333333?text=Prod" alt="Productividad" />
                    <h3>Productividad optimizada</h3>
                    <p>Panel de control con KPIs, alertas tempranas y reportes automáticos.</p>
                  </div>
                  <div className="feature">
                    <img src="https://placehold.co/100x100/f0f0f0/333333?text=Team" alt="Colaboración" />
                    <h3>Colaboración en equipo</h3>
                    <p>Chat, videollamadas y notificaciones en un solo lugar.</p>
                  </div>
                  <div className="feature">
                    <img src="https://placehold.co/100x100/f0f0f0/333333?text=Gest" alt="Gestión centralizada" />
                    <h3>Gestión centralizada</h3>
                    <p>Documentos, repositorios y tareas organizadas en una plataforma.</p>
                  </div>
                </section>

                {/* 🔹 SECCIÓN “CÓMO FUNCIONA” */}
                <section className="how-it-works">
                  <h2>¿Cómo Funciona?</h2>
                  <div className="steps">
                    <div className="step">
                      <div className="circle-num">1</div>
                      <h3>Crea tu Proyecto</h3>
                      <p>Define objetivos, plazos y recursos. La IA sugerirá la mejor metodología.</p>
                    </div>
                    <div className="step">
                      <div className="circle-num">2</div>
                      <h3>Organiza tu Equipo</h3>
                      <p>Invita colaboradores, asigna roles y tareas, todo de forma inteligente.</p>
                    </div>
                    <div className="step">
                      <div className="circle-num">3</div>
                      <h3>Supervisa con IA</h3>
                      <p>Monitorea avances en tiempo real y recibe alertas predictivas.</p>
                    </div>
                  </div>
                </section>

                {/* 🔹 CALL TO ACTION FINAL */}
                <section className="cta">
                  <h3>¿Listo Para Transformar tu Proyecto?</h3>
                  <p>Únete a miles de equipos que están planificando su futuro con inteligencia.</p>
                  <Link to="/register" className="btn-gradient">Empezar</Link>
                </section>
                
                {/* 🔹 FOOTER */}
                <footer className="footer-landing">
                  <p>&copy; {new Date().getFullYear()} FUTURE PLAN. Todos los derechos reservados.</p>
                </footer>
                
              </div>
            }
          />

          {/* 2. RUTAS DE AUTENTICACIÓN (Login, Register) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* 3. RUTA DE GESTIÓN DE USUARIOS (Si debe ser accesible sin dashboard) */}
          <Route path="/gest_user" element={<GestUser />} />
          
          {/* 4. RUTAS PROTEGIDAS DEL DASHBOARD (Usamos AuthWrapper) */}
          <Route 
              path="/*" 
              element={
                  <AuthWrapper isAuthenticated={isAuthenticated}>
                      {/* AppRoutes contiene /proyectos, /repositorio, etc. y el 404 final */}
                      <AppRoutes /> 
                  </AuthWrapper>
              } 
          />
        
        </Routes>
      </Router>
    </div>
  );
}

export default App;