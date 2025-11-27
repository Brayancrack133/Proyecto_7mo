import React, { useState } from "react";
import { Sparkles, Loader2, BrainCircuit, Rocket, Layout, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

  const [recomendacionIA, setRecomendacionIA] = useState(""); 
  const [loadingIA, setLoadingIA] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tareasIA, setTareasIA] = useState<string[]>([]);
  // --- LISTAS ESTÁTICAS ---
  const tiposProyecto = [
    "Desarrollo Web", "Desarrollo Móvil", "Desarrollo Desktop",
    "DevOps", "Data Science", "Inteligencia Artificial", "Otro",
  ];

  const tamanos = [
    "Pequeño (1-3 meses)", 
    "Mediano (3-6 meses)",
    "Grande (6-12 meses)", 
    "Muy Grande (+12 meses)",
  ];

  const complejidades = ["Baja", "Media", "Alta", "Muy Alta"];

  // Lista estática de metodologías
  const metodologias = [
    { id: 1, nombre: "Scrum", tipo: "Ágil" },
    { id: 2, nombre: "Kanban", tipo: "Ágil visual" },
    { id: 3, nombre: "XP – Extreme Programming", tipo: "Ágil técnico" },
    { id: 4, nombre: "Cascada", tipo: "Tradicional" }
  ];

  // --- HANDLERS ---
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- 🧠 LÓGICA IA MEJORADA ---
  const handleGenerarIA = async () => {
    if (!formData.descripcion || formData.descripcion.length < 10) {
      alert("⚠️ Por favor, describe tu idea con un poco más de detalle.");
      return;
    }

    setLoadingIA(true);
    try {
      const datosIA = await generarProyectoConIA(formData.descripcion);
      console.log("Respuesta IA:", datosIA); // Para depuración
      // ✅ AQUÍ AGREGAS LA LÍNEA NUEVA (Paso 1.2):
      // Guardamos las tareas que devolvió la IA en el estado para enviarlas luego
      setTareasIA(datosIA.tareas_iniciales || []);
      // 1. MATCHING DE METODOLOGÍA
      const metodologiaEncontrada = metodologias.find(m => 
        m.nombre.toLowerCase().includes(datosIA.metodologia_recomendada?.toLowerCase()) ||
        datosIA.metodologia_recomendada?.toLowerCase().includes(m.nombre.toLowerCase())
      );

      // 2. MATCHING DE TAMAÑO (SOLUCIÓN AL PROBLEMA DE SELECCIÓN)
      // Buscamos qué opción de nuestra lista contiene la palabra clave que devolvió la IA
      const tamanoSugeridoIA = datosIA.tamano || "Mediano";
      const tamanoEncontrado = tamanos.find(t => 
        t.toLowerCase().includes(tamanoSugeridoIA.toLowerCase())
      ) || "Mediano (3-6 meses)"; // Fallback si no encuentra nada

      // 3. CÁLCULO DE FECHA FIN (SOLUCIÓN AL PROBLEMA DE FECHA)
      let fechaFinCalculada = "";
      let diasAgregados = 0;

      // Prioridad 1: Si la IA devuelve días exactos
      if (datosIA.duracion_dias || datosIA.duracion_estimada_dias) {
        diasAgregados = datosIA.duracion_dias || datosIA.duracion_estimada_dias;
      } 
      // Prioridad 2: Calcular basado en el tamaño detectado
      else {
        if (tamanoEncontrado.includes("Pequeño")) diasAgregados = 90;      // ~3 meses
        else if (tamanoEncontrado.includes("Mediano")) diasAgregados = 180; // ~6 meses
        else if (tamanoEncontrado.includes("Grande")) diasAgregados = 360;  // ~12 meses
        else diasAgregados = 60; // Default
      }

      const fechaInicioObj = new Date(formData.fecha_inicio);
      fechaInicioObj.setDate(fechaInicioObj.getDate() + diasAgregados);
      fechaFinCalculada = fechaInicioObj.toISOString().split("T")[0];

      // ACTUALIZAR ESTADO
      setFormData(prev => ({
        ...prev,
        nombre: datosIA.nombre_sugerido || prev.nombre,
        tipo: datosIA.tipo || "Otro",
        tamano: tamanoEncontrado, // Usamos el string exacto de nuestra lista
        complejidad: datosIA.complejidad || "Media",
        descripcion: datosIA.descripcion_tecnica || prev.descripcion,
        metodologia_id: metodologiaEncontrada ? String(metodologiaEncontrada.id) : prev.metodologia_id,
        fecha_fin: fechaFinCalculada || prev.fecha_fin
      }));

      setRecomendacionIA(
        `💡 IA Sugiere: ${datosIA.metodologia_recomendada}\n` +
        `🎯 Razón: ${datosIA.justificacion_ia}\n` +
        `✨ Tareas Clave: ${datosIA.tareas_iniciales ? datosIA.tareas_iniciales.slice(0, 3).join(", ") : "Planificación..."}...`
      );

    } catch (error) {
      console.error(error);
      alert("❌ Error al consultar la IA.");
    } finally {
      setLoadingIA(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // DEBUG: Para estar seguros, miremos qué tiene el usuario
    console.log("Datos del usuario:", usuario);

    // ⚠️ CORRECCIÓN CLAVE AQUÍ:
    // Antes buscábamos .id_usuario. Ahora buscamos .id (que es el que usa MisProyectos)
    // Usamos 'as any' para evitar peleas con TypeScript por ahora.
    const idReal = (usuario as any)?.id || (usuario as any)?.id_usuario || 1;

    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      fecha_inicio: formData.fecha_inicio,
      fecha_fin: formData.fecha_fin || null,
      id_jefe: idReal, // <--- Aquí enviamos el ID correcto
      metodologia_id: formData.metodologia_id ? Number(formData.metodologia_id) : null,
      tipo: formData.tipo,
      tamano: formData.tamano,
      tareas: tareasIA,
      complejidad: formData.complejidad
      
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

  if (isLoadingUser) return <div className="h-screen flex items-center justify-center bg-gray-50">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="max-w-4xl w-full space-y-8">
        
        {/* Encabezado */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
             <Rocket className="text-white h-8 w-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Crear Nuevo Proyecto
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Usa el asistente <span className="font-bold text-indigo-600">DOUE</span> para estructurar tu idea o llena los datos manualmente.
          </p>
        </div>

        {/* Tarjeta del Formulario */}
        <div className="bg-white py-8 px-4 shadow-2xl shadow-gray-200 sm:rounded-3xl sm:px-10 border border-gray-100 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-purple-100 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50"></div>

          <form className="space-y-8 relative z-10" onSubmit={handleSubmit}>
            
            {/* SECCIÓN 1: LA IDEA (IA) */}
            <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-base font-semibold text-indigo-900">
                  1. Cuéntame tu idea
                </label>
                <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-indigo-200 shadow-sm">
                  <BrainCircuit size={14} className="text-purple-600" />
                  <span className="text-xs font-bold text-purple-700 uppercase tracking-wide">Modo IA Activo</span>
                </div>
              </div>
              
              <div className="relative">
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  placeholder="Ej: Necesito un sistema para una biblioteca que controle préstamos y multas..."
                  rows={4}
                  className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 text-base p-4 resize-none bg-white"
                />
                <div className="absolute bottom-3 right-3">
                  <button
                    type="button"
                    onClick={handleGenerarIA}
                    disabled={loadingIA}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-md text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70"
                  >
                    {loadingIA ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    {loadingIA ? "Pensando..." : "Auto-completar"}
                  </button>
                </div>
              </div>
                <p className="mt-2 text-sm text-indigo-400 text-right pr-1">
                *Presiona el botón para generar estructura automática.
              </p>
            </div>

            {/* SECCIÓN 2: DETALLES TÉCNICOS */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Detalles Técnicos</h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
                
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Nombre del Proyecto</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                    />
                  </div>
                </div>

                {/* ✅ ARREGLO DEL ICONO SUPERPUESTO */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Metodología</label>
                  <div className="mt-1 relative">
                    {/* Icono a la izquierda */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        <Layout size={18} />
                    </div>
                    <select
                      name="metodologia_id"
                      value={formData.metodologia_id}
                      onChange={handleInputChange}
                      // Agregamos pl-10 para dar espacio al icono y evitar choque
                      className=" w-full pl-14 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-xl text-gray-900 bg-white"
                    >
                      <option value="">-- Seleccionar --</option>
                      {metodologias.map(m => (
                        <option key={m.id} value={m.id}>{m.nombre} ({m.tipo})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha Inicio</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="date"
                      name="fecha_inicio"
                      value={formData.fecha_inicio}
                      onChange={handleInputChange}
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-4 py-3 sm:text-sm border-gray-300 rounded-xl text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha Fin (Estimada)</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="date"
                      name="fecha_fin"
                      value={formData.fecha_fin}
                      onChange={handleInputChange}
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-4 py-3 sm:text-sm border-gray-300 rounded-xl text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Tipo</label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-xl text-gray-900 bg-white"
                  >
                    <option value="">Seleccionar</option>
                    {tiposProyecto.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Tamaño</label>
                  <select
                    name="tamano"
                    value={formData.tamano}
                    onChange={handleInputChange}
                    className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-xl text-gray-900 bg-white"
                  >
                    <option value="">Seleccionar</option>
                    {tamanos.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Complejidad</label>
                  <select
                    name="complejidad"
                    value={formData.complejidad}
                    onChange={handleInputChange}
                    className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-xl text-gray-900 bg-white"
                  >
                    <option value="">Seleccionar</option>
                    {complejidades.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

              </div>
            </div>

            {recomendacionIA && (
              <div className="rounded-xl bg-green-50 p-4 border border-green-200 animate-fade-in">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Análisis Completado</h3>
                    <div className="mt-2 text-sm text-green-700 whitespace-pre-wrap font-sans">
                      {recomendacionIA}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200 flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/proyectos')}
                className="w-1/3 flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-2/3 flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-transform transform hover:-translate-y-0.5 disabled:opacity-70"
              >
                {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : "Crear Proyecto"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectCreationForm;