import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import "./App.css";

// --- COMPONENTES DEL LÍDER (Auth y Landing) ---
import Login from "./pages/Login/Login";
import Register from "./pages/Registro/Register";
import GestUser from "./pages/Gest_user/Gest_user";

// --- TUS COMPONENTES (Gestión de Proyectos) ---
import { UserProvider } from './context/UserContext';
import MisProyectos from "./components/organisms/MisProyectos";
import Proyecto_Principal from "./pages/gestion_proyectos/ProjectCreationForm";
import Planificacion from "./components/organisms/Planificacion";
import ContInicio from "./components/organisms/ContInicio";
import Contenido from "./components/templates/Contenido";
import Cascada from "./pages/Metodologias/metCascada";
import Kanvan from "./pages/Metodologias/metKanvan";
import Scrum from "./pages/Metodologias/metScrum";
import XP from "./pages/Metodologias/metXP";
import Proyecto_vacio from "./components/templates/Proyecto_vacio/Proyecto_vacio";

// =======================================================
// COMPONENTE AUXILIAR (DEBE IR ANTES DE USARLO)
// =======================================================

const RutaPlanificacion = () => {
  const { id } = useParams();
  return id ? (
    <Planificacion idProyecto={id} />
  ) : (
    <div>Error: ID de proyecto no válido</div>
  );
};

// =======================================================
// APP PRINCIPAL
// =======================================================

function App() {
  return (
    <UserProvider>
      <div className="principal">
        <Router>
          <Routes>

            {/* ===================================================== */}
            {/* LANDING PAGE */}
            {/* ===================================================== */}

            <Route path="/" element={
              <div className="landing-container">

                <nav className="navbar">
                  <ul>
                    <li><Link to="/">Inicio</Link></li>
                    <li><Link to="/nosotros">Nosotros</Link></li>
                    <li><Link to="/mis-proyectos">Mis Proyectos</Link></li>
                    <li><Link to="/login">Administración</Link></li>
                    <li><Link to="/contacto">Contacto</Link></li>
                  </ul>
                </nav>

                {/* HERO */}
                <section className="hero">
                  <div className="hero-text">
                    <h1 className="logo">FUTURE PLAN</h1>
                    <p className="slogan">“La forma inteligente de organizar tus proyectos”</p>
                    <Link to="/login" className="btn-main">Empezar</Link>
                    <p className="descripcion">
                      Future Plan es una plataforma de planificación y gestión de proyectos.
                    </p>
                  </div>

                  <div className="main-image">
                    <div className="parent">
                      <div className="card">
                        <img className="imgmain" src="/Images/prinimg.png" alt="Imagen" />
                      </div>
                    </div>
                  </div>
                </section>

                {/* FEATURES */}
                <section className="features">
                  <div className="feature">
                    <img src="/Images/IAimagen.jpeg" alt="IA" />
                    <h3>Planificación inteligente</h3>
                  </div>

                  <div className="feature">
                    <img src="/Images/Produc.jpeg" alt="Productividad" />
                    <h3>Productividad optimizada</h3>
                  </div>

                  <div className="feature">
                    <img src="/Images/teams.jpg" alt="Colaboración" />
                    <h3>Colaboración en equipo</h3>
                  </div>

                  <div className="feature">
                    <img src="/Images/central.jpg" alt="Gestión" />
                    <h3>Gestión centralizada</h3>
                  </div>
                </section>

              </div>
            } />

            {/* ===================================================== */}
            {/* RUTAS DE AUTENTICACIÓN */}
            {/* ===================================================== */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/gest_user" element={<GestUser />} />

            {/* ===================================================== */}
            {/* RUTAS CON LAYOUT (HEADER + SIDEBAR) */}
            {/* ===================================================== */}

            <Route
              path="/mis-proyectos"
              element={
                <Contenido>
                  <MisProyectos />
                </Contenido>
              }
            />

            <Route
              path="/proyecto-vacio"
              element={
                <Contenido>
                  <Proyecto_vacio />
                </Contenido>
              }
            />
            <Route
              path="/proyecto-principal"
              element={
                <Contenido>
                  <Proyecto_Principal />
                </Contenido>
              }
            />

            <Route
              path="/inicio"
              element={
                <Contenido>
                  <ContInicio />
                </Contenido>
              }
            />
            <Route
              path="/cascada"
              element={
                <Contenido>
                  <Cascada />
                </Contenido>
              }
            />
            <Route
              path="/kanvan"
              element={
                <Contenido>
                  <Kanvan />
                </Contenido>
              }
            />
            <Route
              path="/scrum"
              element={
                <Contenido>
                  <Scrum />
                </Contenido>
              }
            />
            <Route
              path="/xp"
              element={
                <Contenido>
                  <XP />
                </Contenido>
              }
            />

            <Route
              path="/proyecto/:id"
              element={
                <Contenido>
                  <RutaPlanificacion />
                </Contenido>
              }
            />

          </Routes>
        </Router>
      </div>
    </UserProvider>
  );
}

export default App;
