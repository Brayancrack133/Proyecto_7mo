import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import "./App.css";

// --- COMPONENTES DEL LÍDER (Auth y otros) ---
import Login from "./pages/Login/Login";
import Register from "./pages/Registro/Register";
import GestUser from "./pages/Gest_user/Gest_user";

// --- COMPONENTES DE GESTIÓN ---
import { UserProvider } from "./context/UserContext";
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
import ContPlanificacion from "./components/templates/ContPlanificacion";
import Dashboard_Proyecto from "./pages/gestion_proyectos/ProjectManagementPage";
import MisDocumentos from "./components/organisms/MisDocumentos";
import Dashboard from "./components/organisms/Dashboard";

// =======================================================
// COMPONENTE AUXILIAR PARA OBTENER ID DE PROYECTO
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
            {/* LANDING PAGE CON SCROLL SUAVE Y BURBUJAS */}
            {/* ===================================================== */}
            <Route
              path="/"
              element={
                <div className="landing-container">
                  {/* NAVBAR */}
                  <nav className="navbar-fancy">
                    <ul className="nav-links">
                      <li>
                        <button
                          onClick={() =>
                            document
                              .getElementById("inicio")
                              ?.scrollIntoView({ behavior: "smooth" })
                          }
                        >
                          Inicio
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() =>
                            document
                              .getElementById("nosotros")
                              ?.scrollIntoView({ behavior: "smooth" })
                          }
                        >
                          Nosotros
                        </button>
                      </li>
                      <li>
                        <Link to="/mis-proyectos">Mis Proyectos</Link>
                      </li>
                      <li>
                        <Link to="/login">Administración</Link>
                      </li>
                      <li>
                        <button
                          onClick={() =>
                            document
                              .getElementById("contacto")
                              ?.scrollIntoView({ behavior: "smooth" })
                          }
                        >
                          Contacto
                        </button>
                      </li>
                    </ul>
                  </nav>

                  {/* ============================ */}
                  {/* HERO / INICIO */}
                  {/* ============================ */}
                  <section id="inicio" className="hero section-bubbles">
                    <div className="hero-text">
                      <h1 className="logo">FUTURE PLAN</h1>
                      <p className="slogan">
                        “La forma inteligente de organizar tus proyectos”
                      </p>
                      <Link to="/login" className="btn-main">
                        Empezar
                      </Link>
                      <p className="descripcion">
                        Future Plan es una plataforma de planificación y gestión
                        de proyectos.
                      </p>
                    </div>

                    <div className="main-image">
                      <img
                        className="imgmain"
                        src="/Images/prinimg.png"
                        alt="Imagen principal"
                      />
                    </div>
                  </section>

                  {/* ================================ */}
                  {/*        NOSOTROS / EQUIPO         */}
                  {/* ================================ */}
                  <section
                    id="nosotros"
                    className="nosotros-section section-bubbles"
                  >
                    <div className="nosotros-header">
                      <h2>Nuestro Equipo</h2>
                      <p>
                        Creemos en construir herramientas inteligentes que
                        impulsen tus proyectos y te ayuden a lograr tus metas.
                      </p>
                    </div>

                    <div className="nosotros-grid">
                      <div className="nosotros-card">
                        <img src="/Images/innovacion.png" alt="Innovación" />
                        <h3>Innovación</h3>
                        <p>
                          Nos enfocamos en crear soluciones avanzadas con
                          experiencia real para simplificar lo complejo.
                        </p>
                      </div>

                      <div className="nosotros-card">
                        <img src="/Images/compromiso.png" alt="Compromiso" />
                        <h3>Compromiso</h3>
                        <p>
                          Acompañamos a nuestros usuarios en cada paso, desde la
                          planificación hasta la ejecución.
                        </p>
                      </div>

                      <div className="nosotros-card">
                        <img src="/Images/experiencia.png" alt="Experiencia" />
                        <h3>Experiencia</h3>
                        <p>
                          Nuestro equipo tiene amplia trayectoria en gestión,
                          diseño e ingeniería de software.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* ============================ */}
                  {/*        FEATURES / IA        */}
                  {/* ============================ */}
                  <section className="features section-bubbles">
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

                  {/* ============================ */}
                  {/*         CONTACTO             */}
                  {/* ============================ */}
                  <section
                    id="contacto"
                    className="contacto-section section-bubbles"
                  >
                    <h2 className="contacto-title">Contáctanos</h2>
                    <p className="contacto-sub">
                      ¿Tienes alguna duda, sugerencia o propuesta? Estamos para
                      ayudarte.
                    </p>

                    <div className="contact-card-glass">
                      <div className="contact-info">
                        <p>
                          <strong>Email:</strong> futureplan@soporte.com
                        </p>
                        <p>
                          <strong>Teléfono:</strong> +591 70000000
                        </p>
                      </div>

                      <form className="contact-form">
                        <input
                          type="text"
                          placeholder="Tu nombre"
                          className="contact-input"
                        />
                        <input
                          type="email"
                          placeholder="Tu correo"
                          className="contact-input"
                        />
                        <textarea
                          placeholder="Escribe tu mensaje..."
                          className="contact-textarea"
                        ></textarea>
                        <button type="submit" className="contact-btn">
                          Enviar Mensaje
                        </button>
                      </form>
                    </div>
                  </section>
                </div>
              }
            />

            {/* ===================================================== */}
            {/* RUTAS DE AUTENTICACIÓN */}
            {/* ===================================================== */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/gest_user" element={<GestUser />} />

            {/* ===================================================== */}
            {/* RUTAS CON LAYOUT */}
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
              path="/dashboard-proyecto"
              element={
                <Contenido>
                  <Dashboard_Proyecto />
                </Contenido>
              }
            />
            <Route
              path="/proyecto/:id/planificacion"
              element={
                <Contenido>
                  <ContPlanificacion />
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
            <Route
              path="/mis-documentos"
              element={
                <Contenido>
                  <MisDocumentos />
                </Contenido>
              }
            />
            <Route
              path="/dashboard"
              element={
                <Contenido>
                  <Dashboard />
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
