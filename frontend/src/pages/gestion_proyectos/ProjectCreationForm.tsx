import React, { useState } from "react";
import {
  Sparkles,
  Loader2,
  BrainCircuit,
  Rocket,
  Layout,
  Code2,
  Box,
  Ruler,
  Clock,
  Target,
  ListTodo,
  CheckSquare,
  CalendarDays
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// IMPORTAMOS EL CSS CREADO
import "./ProjectCreationForm.css";

// --- IMPORTACIONES DE SERVICIOS ---
import { useUser } from "../../context/UserContext";
import { crearProyecto } from "../../services/projectos_ia.service";
import { generarProyectoConIA } from "../../services/projectos_ia.service";

// --- INTERFACES ---
interface ProjectFormData {
  nombre: string;
  tipo: string;
  tamano: string;
  complejidad: string;
  descripcion: string;
  metodologia_id: string;
  fecha_inicio: string;
  fecha_fin: string;
}

interface IAResponse {
  nombre_sugerido: string;
  descripcion_tecnica: string;
  tipo: string;
  complejidad: string;
  tamano: string;
  metodologia_recomendada: string;
  justificacion_ia: string;
  duracion_dias: number;
  tareas_iniciales: string[];
}

const ProjectCreationForm: React.FC = () => {
  const navigate = useNavigate();
  const { usuario, isLoading: isLoadingUser } = useUser();

  // --- ESTADOS ---
  const [formData, setFormData] = useState<ProjectFormData>({
    nombre: "",
    tipo: "",
    tamano: "",
    complejidad: "",
    descripcion: "",
    metodologia_id: "",
    fecha_inicio: new Date().toISOString().split("T")[0],
    fecha_fin: "",
  });

  const [iaResult, setIaResult] = useState<IAResponse | null>(null);
  const [loadingIA, setLoadingIA] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tareasIA, setTareasIA] = useState<string[]>([]);

  // --- LISTAS ESTÁTICAS ---
  const tiposProyecto = [
    "Desarrollo Web", "Desarrollo Móvil", "Desarrollo Desktop",
    "DevOps", "Data Science", "Inteligencia Artificial", "Otro",
  ];

  const tamanos = [
    "Pequeño (1-3 meses)", "Mediano (3-6 meses)",
    "Grande (6-12 meses)", "Muy Grande (+12 meses)",
  ];

  const complejidades = ["Baja", "Media", "Alta", "Muy Alta"];

  const metodologias = [
    { id: 1, nombre: "Scrum", tipo: "Ágil" },
    { id: 2, nombre: "Kanban", tipo: "Ágil visual" },
    { id: 3, nombre: "XP – Extreme Programming", tipo: "Ágil técnico" },
    { id: 4, nombre: "Cascada", tipo: "Tradicional" },
  ];

  // --- HANDLERS ---
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- 🧠 LÓGICA IA ---
  const handleGenerarIA = async () => {
    if (!formData.descripcion || formData.descripcion.length < 10) {
      alert("⚠️ Por favor, describe tu idea con un poco más de detalle.");
      return;
    }

    setLoadingIA(true);
    setIaResult(null);

    try {
      const datosIA = await generarProyectoConIA(formData.descripcion);
      console.log("Respuesta IA:", datosIA);

      setTareasIA(datosIA.tareas_iniciales || []);
      setIaResult(datosIA);

      const metodologiaEncontrada = metodologias.find(
        (m) =>
          m.nombre.toLowerCase().includes(datosIA.metodologia_recomendada?.toLowerCase()) ||
          datosIA.metodologia_recomendada?.toLowerCase().includes(m.nombre.toLowerCase())
      );

      const tamanoSugeridoIA = datosIA.tamano || "Mediano";
      const tamanoEncontrado = tamanos.find((t) =>
          t.toLowerCase().includes(tamanoSugeridoIA.toLowerCase())
        ) || "Mediano (3-6 meses)";

      let diasAgregados = 0;
      if (datosIA.duracion_dias || datosIA.duracion_estimada_dias) {
        diasAgregados = datosIA.duracion_dias || datosIA.duracion_estimada_dias;
      } else {
        if (tamanoEncontrado.includes("Pequeño")) diasAgregados = 90;
        else if (tamanoEncontrado.includes("Mediano")) diasAgregados = 180;
        else if (tamanoEncontrado.includes("Grande")) diasAgregados = 360;
        else diasAgregados = 60;
      }

      const fechaInicioObj = new Date(formData.fecha_inicio);
      fechaInicioObj.setDate(fechaInicioObj.getDate() + diasAgregados);
      const fechaFinCalculada = fechaInicioObj.toISOString().split("T")[0];

      setFormData((prev) => ({
        ...prev,
        nombre: datosIA.nombre_sugerido || prev.nombre,
        tipo: datosIA.tipo || "Otro",
        tamano: tamanoEncontrado,
        complejidad: datosIA.complejidad || "Media",
        descripcion: datosIA.descripcion_tecnica || prev.descripcion,
        metodologia_id: metodologiaEncontrada ? String(metodologiaEncontrada.id) : prev.metodologia_id,
        fecha_fin: fechaFinCalculada || prev.fecha_fin,
      }));

    } catch (error) {
      console.error(error);
      alert("❌ Error al consultar la IA. Inténtalo de nuevo.");
    } finally {
      setLoadingIA(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const idReal = (usuario as any)?.id || (usuario as any)?.id_usuario || 1;

    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      fecha_inicio: formData.fecha_inicio,
      fecha_fin: formData.fecha_fin || null,
      id_jefe: idReal,
      metodologia_id: formData.metodologia_id ? Number(formData.metodologia_id) : null,
      tipo: formData.tipo,
      tamano: formData.tamano,
      tareas: tareasIA,
      complejidad: formData.complejidad,
    };

    try {
      await crearProyecto(payload);
      alert("✅ Proyecto creado exitosamente");
      navigate("/mis-proyectos");
    } catch (error) {
      alert("❌ Error al guardar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingUser)
    return (
      <div className="pcf-page">
        <Loader2 className="animate-spin" style={{color: 'var(--pcf-primary)'}} />
      </div>
    );

  return (
    <div className="pcf-page">
      <div className="pcf-container">
        
        {/* ENCABEZADO */}
        <div className="pcf-header">
          <div className="pcf-icon-wrapper">
            <Rocket size={32} />
          </div>
          <h2 className="pcf-title">Nuevo Proyecto</h2>
          <p className="pcf-subtitle">
            Define la visión y deja que el <span className="pcf-highlight">Arquitecto IA</span> estructure el plan técnico por ti.
          </p>
        </div>

        {/* LAYOUT PRINCIPAL (GRID) */}
        <div className="pcf-layout">
          
          {/* COLUMNA IZQUIERDA */}
          <div className="pcf-left-column">
            
            {/* 1. TARJETA IA */}
            <div className="pcf-card pcf-card-ia">
              <div className="pcf-card-header">
                <label className="pcf-label-lg">
                  <BrainCircuit size={24} color="var(--pcf-primary)" />
                  Visión del Proyecto
                </label>
                <span className="pcf-badge">Motor IA Activo</span>
              </div>

              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                placeholder="Ej: Necesito una aplicación de gestión de inventario para una ferretería con backend en Node.js, que use la metodología Kanban y que me avise de riesgos de retraso."
                rows={6}
                className="pcf-textarea"
              />
              
              <div className="pcf-actions-right">
                <button
                  type="button"
                  onClick={handleGenerarIA}
                  disabled={loadingIA}
                  className="btn-ia"
                >
                  {loadingIA ? (
                    <> <Loader2 className="animate-spin" size={18} /> Diseñando... </>
                  ) : (
                    <> <Sparkles size={18} /> Generar Estructura </>
                  )}
                </button>
              </div>
            </div>

            {/* 2. TARJETA MANUAL */}
            <div className="pcf-card">
              <div className="pcf-card-header">
                <h3 className="pcf-label-lg" style={{fontSize: '1.1rem'}}>
                  <Layout size={20} color="#94a3b8"/> Configuración Manual
                </h3>
              </div>
              
              <div className="pcf-form-grid">
                <div className="pcf-input-group">
                  <label>Nombre del Proyecto</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="pcf-input"
                  />
                </div>

                <div className="pcf-row">
                  <div className="pcf-input-group">
                    <label>Tipo</label>
                    <select name="tipo" value={formData.tipo} onChange={handleInputChange} className="pcf-select">
                      <option value="">Seleccionar...</option>
                      {tiposProyecto.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="pcf-input-group">
                    <label>Metodología</label>
                    <select name="metodologia_id" value={formData.metodologia_id} onChange={handleInputChange} className="pcf-select">
                      <option value="">Seleccionar...</option>
                      {metodologias.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                    </select>
                  </div>
                </div>

                <div className="pcf-row">
                   <div className="pcf-input-group">
                    <label style={{display:'flex', gap:'5px', alignItems:'center'}}>
                       <CalendarDays size={14}/> Inicio
                    </label>
                    <input type="date" name="fecha_inicio" value={formData.fecha_inicio} onChange={handleInputChange} className="pcf-input" />
                  </div>
                  <div className="pcf-input-group">
                    <label style={{display:'flex', gap:'5px', alignItems:'center'}}>
                       <CalendarDays size={14}/> Fin Estimado
                    </label>
                    <input type="date" name="fecha_fin" value={formData.fecha_fin} onChange={handleInputChange} className="pcf-input" />
                  </div>
                </div>
              </div>

              {/* ACCIONES FINALES */}
              <div className="pcf-actions-right" style={{marginTop:'2rem', gap:'1rem'}}>
                 <button type="button" onClick={() => navigate("/mis-proyectos")} className="btn-secondary">
                  Cancelar
                </button>
                <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="btn-primary">
                  {isSubmitting ? "Guardando..." : "Confirmar Proyecto"}
                </button>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA (RESULTADO IA) */}
          <div className="pcf-right-column">
            {iaResult ? (
              <div className="blueprint-card">
                
                {/* Header Blueprint */}
                <div className="blueprint-header">
                  <div>
                    <span className="blueprint-label">Blueprint Generado</span>
                    <h3 className="blueprint-title">{iaResult.nombre_sugerido}</h3>
                  </div>
                  <Code2 size={28} style={{opacity: 0.5}} />
                </div>

                {/* Métricas */}
                <div className="blueprint-metrics">
                  <div className="metric-item">
                    <span className="metric-label"><Box size={14}/> Complejidad</span>
                    <p className="metric-value">{iaResult.complejidad}</p>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label"><Clock size={14}/> Duración</span>
                    <p className="metric-value">~{iaResult.duracion_dias} días</p>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label"><Ruler size={14}/> Tamaño</span>
                    <p className="metric-value" title={iaResult.tamano}>{iaResult.tamano.split(' ')[0]}</p>
                  </div>
                  <div className="metric-item" style={{backgroundColor: '#eef2ff'}}>
                    <span className="metric-label" style={{color: 'var(--pcf-primary)'}}><Target size={14}/> Enfoque</span>
                    <p className="metric-value metric-value-highlight">{iaResult.metodologia_recomendada}</p>
                  </div>
                </div>

                {/* Cuerpo del Blueprint */}
                <div className="blueprint-body">
                  <h5 className="section-title">
                    <Sparkles size={16} color="var(--pcf-accent-amber)" fill="var(--pcf-accent-amber)" /> Estrategia
                  </h5>
                  <div className="strategy-box">
                    {iaResult.justificacion_ia}
                  </div>

                  <h5 className="section-title">
                    <ListTodo size={16} color="var(--pcf-primary)" /> Hoja de Ruta
                  </h5>
                  <ul className="task-list">
                    {iaResult.tareas_iniciales.slice(0, 6).map((tarea, idx) => (
                      <li key={idx} className="task-item">
                        <CheckSquare size={18} />
                        <span>{tarea}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              // Empty State
              <div className="empty-state">
                <div className="empty-icon-circle">
                  <BrainCircuit size={40} color="#cbd5e1" />
                </div>
                <p className="empty-title">Esquema de <br/> <span style={{color: 'var(--pcf-text-main)'}}>Planificación IA</span></p>
                <p className="empty-text">
                  Completa la descripción a la izquierda y deja que la IA haga su magia.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProjectCreationForm;