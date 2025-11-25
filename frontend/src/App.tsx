import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";

// --- COMPONENTES DEL LÍDER (Auth y Landing) ---
import Login from "./pages/Login/Login";
import Register from "./pages/Registro/Register";
import GestUser from "./pages/Gest_user/Gest_user";

// --- TUS COMPONENTES (Gestión de Proyectos) ---
import { UserProvider } from './context/UserContext'; // Importante: Tu contexto
import MisProyectos from "./components/organisms/MisProyectos";
import Planificacion from "./components/organisms/Planificacion";
import ContPlanificacion from "./components/templates/ContPlanificacion";
import Inicio from "./components/templates/Inicio";
import Contenido from "./components/templates/Contenido";
// Nota: Asegúrate de que la ruta de importación sea correcta según donde guardaste los archivos



function App() {
  return (
    /* 1. Envolvemos TODO en el UserProvider para que funcione el usuario global */
    <UserProvider>
      <div className="principal">
        <Router>
          <Routes>

            {/* ======================================================= */}
            {/* PARTE DEL LÍDER: LANDING PAGE, LOGIN Y REGISTRO         */}
            {/* ======================================================= */}
            <Route path="/" element={
              <div className="landing-container">
                {/* NAVBAR */}
                <nav className="navbar">
                  <ul>
                    <li><Link to="/">Inicio</Link></li>
                    <li><Link to="/nosotros">Nosotros</Link></li>
                    {/* Enlace a TU módulo */}
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
                      Future Plan es una plataforma de planificación y gestión de proyectos
                      que integra Inteligencia Artificial para recomendar metodologías, estimar
                      tiempos y mejorar la productividad de los equipos.
                    </p>
                  </div>
                  <div className="main-image">
                    <div className="parent">
                      <div className="card">
                        <img className="imgmain" src="/Images/prinimg.png" alt="Imagen principal" />
                      </div>
                    </div>
                  </div>
                </section>

                {/* FEATURES */}
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

                {/* CÓMO FUNCIONA */}
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

                {/* CALL TO ACTION */}
                <section className="cta">
                  <h3>¿Listo Para Transformar tu Proyecto?</h3>
                  <p>Únete a miles de equipos que están planificando su futuro con inteligencia.</p>
                  <Link to="/register" className="btn-gradient">Empezar</Link>
                </section>
              </div>
            }
            />

            {/* Rutas de Autenticación del Líder */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/gest_user" element={<GestUser />} />

            {/* ======================================================= */}
            {/* TU PARTE: GESTIÓN DE PROYECTOS Y PLANIFICACIÓN          */}
            {/* ======================================================= */}

            {/* ... Rutas públicas ... */}

            {/* --- AQUÍ ESTÁ LA CORRECCIÓN CLAVE --- */}
            {/* Usamos <Contenido /> porque este YA TIENE Header, Sidebar y MisProyectos dentro */}

            {/* Ruta individual de planificación */}
            <Route path="/proyecto/:id" element={<ContPlanificacion />} />

            {/* Rutas extra si las necesitas */}
            <Route path="/inicio" element={<Inicio />} />

            {/* Ruta de Proyectos (donde está la tabla) */}
            <Route path="/mis-proyectos" element={<Contenido />} />
          </Routes>
        </Router>
      </div>
    </UserProvider>
  );
}

// Pequeño componente auxiliar para extraer el ID de la URL y pasarlo a Planificacion
import { useParams } from 'react-router-dom';
const RutaPlanificacion = () => {
  const { id } = useParams();
  // Si id existe, renderizamos Planificacion pasando el ID
  return id ? <Planificacion idProyecto={id} /> : <div>Error: ID de proyecto no válido</div>;
};

export default App;