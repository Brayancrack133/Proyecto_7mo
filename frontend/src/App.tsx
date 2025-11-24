import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Registro/Register";
import GestUser from "./pages/Gest_user/Gest_user";
import { AppRoutes } from "./routes/AppRoutes";
import "./App.css";

function App() {
  return (
    <div className="principal">
      <Router>
        <Routes>
          {/* 🔹 Landing principal */}
          <Route
            path="/"
            element={
              <div className="landing-container">
                {/* 🔹 NAVBAR SUPERIOR */}
                <nav className="navbar">
                  <ul>
                    <li><Link to="/">Inicio</Link></li>
                    <li><Link to="/nosotros">Nosotros</Link></li>
                    <li><Link to="/mis_proyectos">Mis Proyectos</Link></li>
                    <li><Link to="/Login">Administración</Link></li>
                    <li><Link to="/contacto">Contacto</Link></li>
                  </ul>
                </nav>

                {/* 🔹 SECCIÓN HERO */}
                <section className="hero">
                  <div className="hero-text">
                    <h1 className="logo">FUTURE PLAN</h1>
                    <p className="slogan">“La forma inteligente de organizar tus proyectos”</p>
                    <Link to="/login" className="btn-main">Empezar</Link>
                    <p className="descripcion">
                      Future Plan es una plataforma de planificación y gestión de proyectos 
                      que integra Inteligencia Artificial para recomendar metodologías, estimar 
                      tiempos y mejorar la productividad de los equipos.
                    </p>
                  </div>

                  <div className="main-image"> <div className="parent"> <div className="card"> <img className="imgmain" src="/Images/prinimg.png" alt="Imagen principal" /> </div> </div> </div>
                </section>

                {/* 🔹 SECCIÓN DE FEATURES */}
                <section className="features">
                  <div className="feature">
                    <img src="/Images/IAimagen.jpeg" alt="IA" />
                    <h3>Planificación inteligente</h3>
                    <p>La IA sugiere metodologías y etapas según tu proyecto.</p>
                  </div>
                  <div className="feature">
                    <img src="/Images/Produc.jpeg" alt="Productividad" />
                    <h3>Productividad optimizada</h3>
                    <p>Panel de control con KPIs, alertas tempranas y reportes automáticos.</p>
                  </div>
                  <div className="feature">
                    <img src="/Images/teams.jpg" alt="Colaboración" />
                    <h3>Colaboración en equipo</h3>
                    <p>Chat, videollamadas y notificaciones en un solo lugar.</p>
                  </div>
                  <div className="feature">
                    <img src="/Images/central.jpg" alt="Gestión centralizada" />
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
              </div>
            }
          />

          {/* 🔹 RUTAS INTERNAS */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/gest_user" element={<GestUser />} />
          <Route path="/*" element={<AppRoutes />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;