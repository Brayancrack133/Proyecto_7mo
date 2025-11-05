import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Registro/Register";
import GestUser from "./pages/Gest_user/Gest_user";
import "./App.css"; // Aquí van los estilos

function App() {
  return (
    <Router>
      <Routes>
        {/* Página principal */}
        <Route
          path="/"
          element={
            <div className="landing">
              <header className="header">
                <h1 className="title">🌱 FuturePlan</h1>
                <p className="subtitle">"La forma inteligente de organizar tus proyectos"</p>
                <Link to="/start" className="btn-start">Empezar</Link>
              </header>

              <section className="main-section">
                <div className="main-image">
                  <img src="path_to_main_image" alt="Main" />
                </div>

                <div className="description">
                  <p>
                    Future Plan es una plataforma de planificación y gestión de proyectos que integra
                    Inteligencia Artificial para recomendar metodologías, estimar tiempos y mejorar la
                    productividad de los equipos.
                  </p>
                </div>

                <div className="features">
                  <div className="feature">
                    <img src="path_to_ai_image" alt="IA" />
                    <p>Planificación inteligente</p>
                  </div>
                  <div className="feature">
                    <img src="path_to_productivity_image" alt="Productividad" />
                    <p>Productividad optimizada</p>
                  </div>
                  <div className="feature">
                    <img src="path_to_team_image" alt="Equipo" />
                    <p>Colaboración en equipo</p>
                  </div>
                  <div className="feature">
                    <img src="path_to_central_image" alt="Centralización" />
                    <p>Gestión centralizada</p>
                  </div>
                </div>

                <div className="how-it-works">
                  <h2>¿Cómo Funciona?</h2>
                  <div className="steps">
                    <div className="step">
                      <h3>1. Crea tu Proyecto</h3>
                      <p>Define objetivos, plazos y recursos. La IA sugerirá la mejor metodología.</p>
                    </div>
                    <div className="step">
                      <h3>2. Organiza tu Equipo</h3>
                      <p>Invita colaboradores, asigna roles y tareas, todo de forma inteligente.</p>
                    </div>
                    <div className="step">
                      <h3>3. Supervisa con IA</h3>
                      <p>Monitorea avances en tiempo real y recibe alertas y reportes automáticos.</p>
                    </div>
                  </div>
                </div>

                <div className="call-to-action">
                  <h3>¿Listo Para Transformar tu Proyecto?</h3>
                  <p>Únete a miles de equipos que están planificando su futuro con inteligencia.</p>

                  {/* 🔹 BOTONES DE NAVEGACIÓN */}
                  <div className="nav-buttons">
                    <Link to="/login" className="btn-login">Login</Link>
                    <Link to="/register" className="btn-register">Registro</Link>
                    <Link to="/gest_user" className="btn-gest">Gestión de Usuarios</Link>
                  </div>
                </div>
              </section>
            </div>
          }
        />

        {/* Rutas de páginas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/gest_user" element={<GestUser />} />
      </Routes>
    </Router>
  );
}

export default App;
