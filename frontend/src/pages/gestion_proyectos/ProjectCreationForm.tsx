import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import api from "../../services/api"; // ajusta la ruta a tu archivo axios
interface ProjectFormData {
  nombre: string;
  tipo: string;
  tamano: string;
  complejidad: string;
  descripcion: string;
}

const ProjectCreationForm: React.FC = () => {
  const [formData, setFormData] = useState<ProjectFormData>({
    nombre: '',
    tipo: '',
    tamano: '',
    complejidad: '',
    descripcion: ''
  });

  const tiposProyecto = [
    'Desarrollo Web',
    'Desarrollo Móvil',
    'Desarrollo Desktop',
    'DevOps',
    'Data Science',
    'Inteligencia Artificial',
    'Otro'
  ];

  const tamanos = [
    'Pequeño (1-3 meses)',
    'Mediano (3-6 meses)',
    'Grande (6-12 meses)',
    'Muy Grande (+12 meses)'
  ];

  const complejidades = [
    'Baja',
    'Media',
    'Alta',
    'Muy Alta'
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const projectData = {
    nombre: formData.nombre,
    descripcion: formData.descripcion,
    fecha_inicio: new Date().toISOString().split("T")[0],
    fecha_fin: null,
    id_jefe: 1,
    metadata: {
      tipo: formData.tipo,
      tamano: formData.tamano,
      complejidad: formData.complejidad,
    },
  };

  try {
    const response = await api.post("/proyectos", projectData);

    alert("Proyecto creado exitosamente!");

    // limpiar formulario
    setFormData({
      nombre: "",
      tipo: "",
      tamano: "",
      complejidad: "",
      descripcion: "",
    });
  } catch (error) {
    console.error("Error al crear proyecto:", error);
    alert("Error al registrar el proyecto");
  }
};

  const handleCancel = () => {
    setFormData({
      nombre: '',
      tipo: '',
      tamano: '',
      complejidad: '',
      descripcion: ''
    });
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-8 items-start">
          {/* Formulario Principal */}
          <div className="flex-1 bg-white rounded-xl shadow-lg p-8 border-2 border-dashed border-blue-400">
            <div className="space-y-5">
              {/* Nombre del Proyecto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Proyecto
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Ej: Desarrollo de App Móvil"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base"
                />
              </div>

              {/* Tipo de Proyecto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Proyecto
                </label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white text-base cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23666' d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center'
                  }}
                >
                  <option value="">Seleccionar tipo</option>
                  {tiposProyecto.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>

              {/* Tamaño y Complejidad */}
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tamaño
                  </label>
                  <select
                    name="tamano"
                    value={formData.tamano}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white text-base cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23666' d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 12px center'
                    }}
                  >
                    <option value="">Seleccionar tamaño</option>
                    {tamanos.map(tamano => (
                      <option key={tamano} value={tamano}>{tamano}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Complejidad
                  </label>
                  <select
                    name="complejidad"
                    value={formData.complejidad}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white text-base cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23666' d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 12px center'
                    }}
                  >
                    <option value="">Seleccionar complejidad</option>
                    {complejidades.map(comp => (
                      <option key={comp} value={comp}>{comp}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Descripción y Contexto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción y Contexto
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  placeholder="Describe los objetivos, requisitos y contexto del proyecto..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-base"
                />
              </div>

              {/* IA Recomendación */}
              <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="text-purple-600" size={20} />
                  <span className="text-sm font-semibold text-purple-800">IA recomendación</span>
                </div>
                <textarea
                  placeholder="Basado en tus datos te recomendaremos una Metodología para tu caso"
                  rows={3}
                  className="w-full px-3 py-2 border border-purple-200 rounded-md text-sm bg-white outline-none resize-none"
                  readOnly
                />
              </div>

              {/* Botones de Acción */}
              <div className="flex gap-4 pt-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-base"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition font-medium text-base"
                >
                  Crear Proyecto
                </button>
              </div>
            </div>
          </div>

          {/* Asistente DOUE */}
          <div className="w-96 flex-shrink-0">
            <div className="sticky top-6">
              <div className="bg-gradient-to-br from-purple-400 via-pink-400 to-purple-500 rounded-2xl p-8 shadow-2xl border-2 border-dashed border-purple-300 mb-8">
                <div className="text-white text-center">
                  <p className="text-xl font-light">Holaa, me llamo</p>
                  <p className="text-6xl font-bold my-2">DOUE</p>
                  <p className="text-xl font-light">déjame ayudarte</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center shadow-2xl">
                  <span className="text-5xl">💡</span>
                </div>
                
                <div className="w-40 h-40 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl flex items-center justify-center shadow-2xl">
                  <div className="text-white">
                    <div className="flex gap-3 justify-center mb-3">
                      <div className="w-4 h-4 bg-cyan-400 rounded-full"></div>
                      <div className="w-4 h-4 bg-cyan-400 rounded-full"></div>
                    </div>
                    <div className="w-20 h-2 bg-cyan-400 rounded-full mx-auto"></div>
                  </div>
                </div>
                
                <div className="w-24 h-24 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full flex items-center justify-center shadow-2xl">
                  <span className="text-5xl">🔧</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCreationForm;