import React, { useState } from "react";
import { Sparkles, Loader2, BrainCircuit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { crearProyectoEnBD, generarProyectoConIA } from "../../services/projectos_ia.service";

interface ProjectFormData {
  nombre: string;
  tipo: string;
  tamano: string;
  complejidad: string;
  descripcion: string;
}

const ProjectCreationForm: React.FC = () => {
  const navigate = useNavigate();
  
  // Estados del formulario
  const [formData, setFormData] = useState<ProjectFormData>({
    nombre: "",
    tipo: "",
    tamano: "",
    complejidad: "",
    descripcion: "",
  });

  const [recomendacionIA, setRecomendacionIA] = useState(""); 
  const [loadingIA, setLoadingIA] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const tiposProyecto = [
    "Desarrollo Web", "Desarrollo Móvil", "Desarrollo Desktop",
    "DevOps", "Data Science", "Inteligencia Artificial", "Otro",
  ];

  const tamanos = [
    "Pequeño (1-3 meses)", "Mediano (3-6 meses)",
    "Grande (6-12 meses)", "Muy Grande (+12 meses)",
  ];

  const complejidades = ["Baja", "Media", "Alta", "Muy Alta"];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- LÓGICA IA ---
  const handleGenerarIA = async () => {
    if (!formData.descripcion || formData.descripcion.length < 5) {
      alert("⚠️ Escribe una idea breve en la descripción para que la IA pueda ayudarte.");
      return;
    }

    setLoadingIA(true);
    try {
      const datosIA = await generarProyectoConIA(formData.descripcion);
      
      setFormData(prev => ({
        ...prev,
        nombre: datosIA.nombre_sugerido || prev.nombre,
        tipo: datosIA.tipo || "Otro",
        tamano: datosIA.tamano || "Mediano (3-6 meses)",
        complejidad: datosIA.complejidad || "Media",
        descripcion: datosIA.descripcion_tecnica || prev.descripcion 
      }));

      setRecomendacionIA(
        `💡 Metodología: ${datosIA.metodologia_recomendada}\n` +
        `🎯 Por qué: ${datosIA.justificacion_ia}\n` +
        `📋 Tareas Iniciales: ${datosIA.tareas_iniciales.join(", ")}`
      );

    } catch (error) {
      console.error(error);
      alert("❌ Error al consultar la IA. Verifica tu backend.");
    } finally {
      setLoadingIA(false);
    }
  };

  // --- GUARDAR ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const projectData = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      fecha_inicio: new Date().toISOString().split("T")[0],
      fecha_fin: null,
      id_jefe: 1, 
    };

    try {
      await crearProyectoEnBD(projectData);
      alert("✅ Proyecto creado exitosamente");
      navigate("/proyectos");
    } catch (error) {
      alert("❌ Error al guardar.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* CONTENEDOR PRINCIPAL FLEXIBLE (Columna en movil, Fila en PC) */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* --- IZQUIERDA: FORMULARIO --- */}
          <div className="flex-1 w-full bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-200 relative">
            
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
              Nuevo Proyecto
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* 1. CAMPO DESCRIPCIÓN CON BOTÓN DE IA INTEGRADO */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descripción y Contexto (Tu Idea)
                </label>
                <div className="relative group">
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      placeholder="Ej: Quiero un sistema para gestionar inventarios de una farmacia..."
                      rows={5}
                      className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-base transition-all text-gray-900"
                    />
                    
                    {/* BOTÓN IA DENTRO DEL TEXTAREA (Abajo derecha) */}
                    <button
                      type="button"
                      onClick={handleGenerarIA}
                      disabled={loadingIA}
                      className="absolute bottom-3 right-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-4 py-1.5 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 text-sm font-medium z-10"
                    >
                      {loadingIA ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                      {loadingIA ? "Analizando..." : "Auto-completar con IA"}
                    </button>
                </div>
                <p className="text-xs text-gray-400 mt-1 text-right">
                  *Escribe tu idea y presiona el botón morado para magia.
                </p>
              </div>

              {/* 2. CAMPO NOMBRE (Se rellena solo) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre del Proyecto
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Nombre sugerido por IA o manual..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* 3. SELECTORES */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select name="tipo" value={formData.tipo} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg bg-white">
                    <option value="">Seleccionar</option>
                    {tiposProyecto.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tamaño</label>
                  <select name="tamano" value={formData.tamano} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg bg-white">
                    <option value="">Seleccionar</option>
                    {tamanos.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Complejidad</label>
                  <select name="complejidad" value={formData.complejidad} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg bg-white">
                    <option value="">Seleccionar</option>
                    {complejidades.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* 4. RESULTADO IA (Se muestra si hay recomendación) */}
              {recomendacionIA && (
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200 animate-fade-in">
                  <div className="flex items-center gap-2 mb-2">
                    <BrainCircuit className="text-purple-600" size={20} />
                    <span className="text-sm font-bold text-purple-800">Análisis de IA</span>
                  </div>
                  <textarea
                    value={recomendacionIA}
                    readOnly
                    rows={5}
                    className="w-full bg-transparent text-sm text-gray-700 outline-none resize-none font-mono"
                  />
                </div>
              )}

              {/* 5. BOTONES FINALES */}
              <div className="flex gap-4 pt-4 border-t mt-4">
                <button
                  type="button"
                  onClick={() => navigate('/proyectos')}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition font-medium flex justify-center gap-2"
                >
                  {isSaving && <Loader2 className="animate-spin" />}
                  {isSaving ? "Guardando..." : "Crear Proyecto"}
                </button>
              </div>
            </form>
          </div>

          {/* --- DERECHA: PANEL DOUE (Oculto en móvil, Visible en PC) --- */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="sticky top-6">
              <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 shadow-2xl text-center text-white mb-6">
                <p className="text-lg font-light opacity-90">Hola, soy</p>
                <h1 className="text-5xl font-extrabold my-2 tracking-widest drop-shadow-md">DOUE</h1>
                <p className="text-sm font-medium bg-white/20 inline-block px-3 py-1 rounded-full">Tu Asistente IA</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow border border-gray-100 text-center">
                <div className="flex justify-center gap-4 mb-4">
                   <div className="p-3 bg-yellow-100 rounded-full text-yellow-600 text-2xl">💡</div>
                   <div className="p-3 bg-blue-100 rounded-full text-blue-600 text-2xl">🚀</div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  "No pierdas tiempo configurando. Cuéntame tu idea en el cuadro de texto y yo estructuraré el proyecto, elegiré la metodología y crearé las tareas iniciales por ti."
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProjectCreationForm;