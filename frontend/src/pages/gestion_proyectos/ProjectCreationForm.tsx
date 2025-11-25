import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { useUser } from "../../context/UserContext"; // Asegúrate de que la ruta sea correcta
import { crearProyecto, listarMetodologias as apiListMetodologias } from "../../services/projectos_ia.service";

// El componente de creación de proyectos
const ProjectCreationForm: React.FC = () => {
  const { usuario, isLoading } = useUser(); // Accede al usuario desde el contexto

  // Muestra un mensaje mientras los datos se cargan
  if (isLoading) {
    return <div>Cargando...</div>;
  }

  // Si no hay usuario, muestra un mensaje
  if (!usuario) {
    return <div>❌ No estás autenticado. Por favor, inicia sesión.</div>;
  }

  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "",
    tamano: "",
    complejidad: "",
    descripcion: "",
    metodologia_id: "",
    fecha_inicio: "",
    fecha_fin: "",
  });

  const tiposProyecto = [
    "Desarrollo Web",
    "Desarrollo Móvil",
    "Desarrollo Desktop",
    "DevOps",
    "Data Science",
    "Inteligencia Artificial",
    "Otro",
  ];

  const tamanos = [
    "Pequeño (1-3 meses)",
    "Mediano (3-6 meses)",
    "Grande (6-12 meses)",
    "Muy Grande (+12 meses)",
  ];

  const complejidades = ["Baja", "Media", "Alta", "Muy Alta"];

  interface Metodologia {
    id: number;
    nombre: string;
    tipo?: string;
  }

  const [metodologias, setMetodologias] = useState<Metodologia[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Obtener las metodologías desde la API
  useEffect(() => {
    const fetchMetodologias = async () => {
      try {
        const data: Metodologia[] = await apiListMetodologias();
        setMetodologias(data);
      } catch (err) {
        console.error("No se pudieron cargar metodologías", err);
      }
    };
    fetchMetodologias();
  }, []);

  // Manejo de cambios en los inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejo del submit del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      fecha_inicio: formData.fecha_inicio || new Date().toISOString().split("T")[0],
      fecha_fin: formData.fecha_fin || null,
      id_jefe: usuario?.id_usuario || 1, // Usamos el ID del usuario autenticado (o 1 como valor por defecto)
      metodologia_id: formData.metodologia_id ? Number(formData.metodologia_id) : null,
    };

    try {
      await crearProyecto(payload); // Enviar el proyecto al backend
      setIsSubmitting(false);
      // Limpiar el formulario
      setFormData({
        nombre: "",
        tipo: "",
        tamano: "",
        complejidad: "",
        descripcion: "",
        metodologia_id: "",
        fecha_inicio: "",
        fecha_fin: "",
      });
      alert("✅ Proyecto creado correctamente");
    } catch (err) {
      console.error("Error creando proyecto:", err);
      setIsSubmitting(false);
      alert("❌ Error creando proyecto");
    }
  };

  // Manejo de cancelación del formulario
  const handleCancel = () => {
    setFormData({
      nombre: "",
      tipo: "",
      tamano: "",
      complejidad: "",
      descripcion: "",
      metodologia_id: "",
      fecha_inicio: "",
      fecha_fin: "",
    });
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-8 items-start">
          <div className="flex-1 bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <h1 className="text-3xl font-extrabold mb-6 text-gray-900 flex items-center gap-2">
              Crear Proyecto <span>🚀</span>
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2 tracking-wide">
                  Nombre del Proyecto
                </label>
                <input
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Ej: Desarrollo de App Móvil"
                  className="w-full px-4 py-3 border border-gray-300 bg-white rounded-xl shadow-sm text-gray-900
                    focus:ring-2 focus:ring-blue-600 focus:border-blue-600 hover:border-gray-400 transition-all duration-200"
                />
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 tracking-wide">
                    Fecha Inicio
                  </label>
                  <input
                    type="date"
                    name="fecha_inicio"
                    value={formData.fecha_inicio}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 bg-white rounded-xl shadow-sm text-gray-900
                      focus:ring-2 focus:ring-blue-600 hover:border-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 tracking-wide">
                    Fecha Fin
                  </label>
                  <input
                    type="date"
                    name="fecha_fin"
                    value={formData.fecha_fin}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 bg-white rounded-xl shadow-sm text-gray-900
                      focus:ring-2 focus:ring-blue-600 hover:border-gray-400"
                  />
                </div>
              </div>

              {/* Metodología */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2 tracking-wide">
                  Metodología
                </label>
                <select
                  name="metodologia_id"
                  value={formData.metodologia_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 bg-white rounded-xl shadow-sm text-gray-900 cursor-pointer hover:border-gray-400 focus:ring-2 focus:ring-blue-600 transition"
                >
                  <option value="">-- Seleccionar metodología --</option>
                  {metodologias.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre} {m.tipo ? `· ${m.tipo}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tipo */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2 tracking-wide">
                  Tipo de Proyecto
                </label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 bg-white rounded-xl shadow-sm text-gray-900 cursor-pointer hover:border-gray-400 focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Seleccionar tipo</option>
                  {tiposProyecto.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tamaño + Complejidad */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 tracking-wide">
                    Tamaño
                  </label>
                  <select
                    name="tamano"
                    value={formData.tamano}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white shadow-sm text-gray-900 cursor-pointer hover:border-gray-400 focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">Seleccionar tamaño</option>
                    {tamanos.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 tracking-wide">
                    Complejidad
                  </label>
                  <select
                    name="complejidad"
                    value={formData.complejidad}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white shadow-sm text-gray-900 cursor-pointer hover:border-gray-400 focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">Seleccionar complejidad</option>
                    {complejidades.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2 tracking-wide">
                  Descripción y Contexto
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Describe los objetivos..."
                  className="w-full px-4 py-3 border border-gray-300 bg-white rounded-xl shadow-sm text-gray-900 resize-none hover:border-gray-400 focus:ring-2 focus:ring-blue-600"
                ></textarea>
              </div>

              {/* BOTONES */}
              <div className="flex justify-end gap-4 pt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-5 py-3 rounded-xl bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition shadow-sm"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Sparkles className="animate-spin" size={18} />
                      Creando...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Crear Proyecto
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCreationForm;
