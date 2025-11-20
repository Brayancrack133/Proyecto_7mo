import React, { useState, FormEvent, useCallback, useEffect } from 'react';

// --- 1. DEFINICIÓN DE TIPOS Y DATOS ---

// Definición de la estructura de un proyecto
interface Project {
  id: string;
  nombre: string;
  fechas: string;
  rol: 'Colaborador' | 'Líder';
  jefe: string;
  estado: 'Activo' | 'Finalizado';
  progreso: number;
  equipo: number;
}

// Definición de la estructura de los datos del formulario de nuevo proyecto
interface NewProjectData {
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  jefe: string;
  descripcion: string;
}


// --- 2. SUBCOMPONENTES DE UI ESPECÍFICAS ---

/**
 * Componente que representa una fila de proyecto en la tabla.
 */
const ProjectRow: React.FC<{ project: Project }> = ({ project }) => {
  // Uso de clases de Tailwind para los estilos visuales
  const rolClass = project.rol === 'Colaborador' 
    ? 'text-purple-700 bg-purple-100 px-2 py-1 rounded-full text-xs font-medium' 
    : 'text-blue-700 bg-blue-100 px-2 py-1 rounded-full text-xs font-medium';

  const estadoClass = project.estado === 'Activo' 
    ? 'text-green-700 bg-green-100 px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1' 
    : 'text-blue-700 bg-blue-100 px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1';

  // Usamos progreso 100 si está finalizado para el color de la barra
  const progressValue = project.estado === 'Finalizado' ? 100 : project.progreso;
  const progressColor = progressValue === 100 ? 'bg-blue-500 text-blue-500' : 'bg-orange-500 text-orange-500';

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition duration-150">
      <td className="p-4">
        <p className="font-semibold text-gray-800">{project.nombre}</p>
        <p className="text-xs text-gray-500">{project.fechas}</p>
      </td>
      <td className="p-4">
        <span className={rolClass}>{project.rol}</span>
      </td>
      <td className="p-4 text-gray-600">{project.jefe}</td>
      <td className="p-4">
        <span className={estadoClass}>
          {/* Icono de check (lucide-react check-circle) */}
          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></svg>
          <span>{project.estado}</span>
        </span>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-20 h-2 bg-gray-200 rounded-full">
            <div 
              className={`h-full rounded-full ${progressColor.split(' ')[0]}`}
              style={{ width: `${progressValue}%`, transition: 'width 1s' }}
            ></div>
          </div>
          <span className={`text-sm font-medium ${progressColor.split(' ')[1]}`}>{progressValue}%</span>
        </div>
      </td>
      <td className="p-4 text-gray-600">{project.equipo} miembros</td>
      <td className="p-4">
        <button title="Ver Detalles" className="text-blue-600 hover:text-blue-800 transition duration-150">
          {/* Icono de ojo (lucide-react eye) */}
          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </td>
    </tr>
  );
};

/**
 * Componente que muestra una tarjeta de resumen de estadísticas.
 */
const StatCard: React.FC<{ title: string; count: number; color: string; bgColor: string; icon: React.ReactNode; onClick: () => void }> = ({ title, count, color, bgColor, icon, onClick }) => (
  <div 
    onClick={onClick} 
    className={`flex justify-between items-center p-6 min-w-48 bg-white rounded-xl shadow-lg border border-gray-200 cursor-pointer hover:shadow-xl transition duration-300 transform hover:-translate-y-0.5`}
  >
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase">{title}</p>
      <p className={`text-3xl font-extrabold ${color}`}>{count}</p>
    </div>
    <div className={`p-3 rounded-full ${bgColor}`}>
      {icon}
    </div>
  </div>
);

/**
 * Modal para crear un nuevo proyecto.
 */
const ProjectModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (data: NewProjectData) => Promise<void> }> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<NewProjectData>({ nombre: '', fechaInicio: '', fechaFin: '', jefe: '', descripcion: '' });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
      // Reset form on success
      setFormData({ nombre: '', fechaInicio: '', fechaFin: '', jefe: '', descripcion: '' });
    } catch (error) {
      // Handle error display if necessary
      console.error("Error saving project in modal:", error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    // Reset form when opening/closing
    if (!isOpen) {
      setFormData({ nombre: '', fechaInicio: '', fechaFin: '', jefe: '', descripcion: '' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">Crear Nuevo Proyecto</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            {/* Icono X */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre del Proyecto</label>
            <input id="nombre" value={formData.nombre} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label htmlFor="fechaInicio" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</label>
              <input type="date" id="fechaInicio" value={formData.fechaInicio} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div className="w-1/2">
              <label htmlFor="fechaFin" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin</label>
              <input type="date" id="fechaFin" value={formData.fechaFin} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
          <div>
            <label htmlFor="jefe" className="block text-sm font-medium text-gray-700 mb-1">Jefe de Proyecto</label>
            <select id="jefe" value={formData.jefe} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
              <option value="" disabled>Selecciona un jefe</option>
              <option value="Ana López">Ana López</option>
              <option value="Juan Pérez">Juan Pérez</option>
              <option value="Carlos Ruiz">Carlos Ruiz</option>
              {/* Añadir más opciones si es necesario */}
            </select>
          </div>
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea id="descripcion" value={formData.descripcion} onChange={handleChange} rows={3} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"></textarea>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} disabled={isSaving} className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition duration-150 disabled:opacity-50">Cancelar</button>
            <button type="submit" disabled={isSaving} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-150 flex items-center gap-2 disabled:opacity-50">
              {isSaving ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Guardando...
                </>
              ) : 'Guardar Proyecto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * Componente para las píldoras de filtro
 */
const FilterPill: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-3 py-1 text-sm font-medium rounded-full transition duration-150 ${
            isActive 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
    >
        {label}
    </button>
);

// --- 3. EL MÓDULO (PÁGINA) PRINCIPAL ---

const ProjectManagementPage: React.FC = () => {
    const API_URL = "http://localhost:3000/api/proyectos";

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [filter, setFilter] = useState<'Todos' | 'Líder' | 'Colaborador' | 'Activo' | 'Finalizado'>('Todos');
    const [searchTerm, setSearchTerm] = useState('');

    const handleOpenModal = useCallback(() => setIsModalOpen(true), []);
    const handleCloseModal = useCallback(() => setIsModalOpen(false), []);

    /**
     * Función para cargar los proyectos desde la API (GET).
     */
    const fetchProjects = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(API_URL);
            
            if (!response.ok) {
                // Si la respuesta no es 2xx, lanza un error
                throw new Error(`Error HTTP ${response.status}: No se pudo acceder al API.`);
            }
            
            const data: Project[] = await response.json();
            setProjects(data);
        } catch (err) {
            console.error("Error al cargar proyectos:", err);
            setError("No se pudieron cargar los proyectos. Asegúrate de que tu servidor de Node/Express esté corriendo en `http://localhost:3000`.");
            setProjects([]); // Limpiar la lista de proyectos en caso de error
        } finally {
            setIsLoading(false);
        }
    }, [API_URL]);

    // Ejecutar la carga de proyectos al iniciar el componente
    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    /**
     * Función para guardar un nuevo proyecto a través de la API (POST).
     */
    const handleSaveProject = async (data: NewProjectData) => {
        setError(null);

        // Prepara los datos a enviar al backend de MySQL
        const projectPayload = {
            nombre: data.nombre,
            fecha_inicio: data.fechaInicio, // Usar snake_case si el backend lo espera
            fecha_fin: data.fechaFin,     // Usar snake_case si el backend lo espera
            jefe: data.jefe,
            descripcion: data.descripcion,
            // El backend debe encargarse de asignar el ID, rol, estado y progreso por defecto.
        };
        
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(projectPayload),
            });

            if (!response.ok) {
                throw new Error(`Error al guardar: ${response.status}`);
            }

            // Si es exitoso, cerramos el modal y recargamos la lista completa para ver el nuevo proyecto
            handleCloseModal();
            await fetchProjects(); 
        } catch (err) {
            console.error("Error al crear proyecto:", err);
            // Mostrar error en la UI principal en lugar de solo en la consola
            setError("Error al crear el proyecto. Revisa la consola para más detalles.");
            throw err; // Re-lanzar para que el modal maneje el estado de guardado
        }
    };

    // Lógica de filtrado y búsqueda
    const filteredProjects = projects.filter(p => {
        // 1. Filtrar por tipo (Líder, Colaborador, Activo, Finalizado)
        let passesFilter = true;
        if (filter === 'Líder') passesFilter = p.rol === 'Líder';
        else if (filter === 'Colaborador') passesFilter = p.rol === 'Colaborador';
        else if (filter === 'Activo') passesFilter = p.estado === 'Activo';
        else if (filter === 'Finalizado') passesFilter = p.estado === 'Finalizado';

        if (!passesFilter) return false;

        // 2. Filtrar por término de búsqueda (nombre o jefe)
        if (searchTerm === '') return true;

        const lowerSearch = searchTerm.toLowerCase();
        return (
            p.nombre.toLowerCase().includes(lowerSearch) ||
            p.jefe.toLowerCase().includes(lowerSearch)
        );
    });

    // Cálculos dinámicos para las tarjetas de estadísticas
    const stats = {
        myProjects: projects.filter(p => p.rol === 'Líder').length,
        collaboratorProjects: projects.filter(p => p.rol === 'Colaborador').length,
        activeProjects: projects.filter(p => p.estado === 'Activo').length,
        finishedProjects: projects.filter(p => p.estado === 'Finalizado').length,
    };

    return (
        <div className="p-0">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900">Gestión de Proyectos</h1>
                <button 
                    onClick={handleOpenModal} 
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-150 flex items-center gap-1"
                >
                    {/* Icono más (lucide-react plus) */}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Nuevo Proyecto
                </button>
            </header>

            {/* Tarjetas de Estadísticas */}
            <div className="flex flex-wrap gap-4 mb-8">
                <StatCard 
                    title="Mis Proyectos" count={stats.myProjects} 
                    color="text-orange-600" bgColor="bg-orange-100" 
                    icon={<span className="text-xl">📁</span>} 
                    onClick={() => setFilter('Líder')} 
                />
                <StatCard 
                    title="Como Colaborador" count={stats.collaboratorProjects} 
                    color="text-purple-600" bgColor="bg-purple-100" 
                    icon={<span className="text-xl">👥</span>} 
                    onClick={() => setFilter('Colaborador')} 
                />
                <StatCard 
                    title="Activos" count={stats.activeProjects} 
                    color="text-green-600" bgColor="bg-green-100" 
                    icon={<span className="text-xl">✅</span>} 
                    onClick={() => setFilter('Activo')} 
                />
                <StatCard 
                    title="Finalizados" count={stats.finishedProjects} 
                    color="text-gray-600" bgColor="bg-gray-100" 
                    icon={<span className="text-xl">🏁</span>} 
                    onClick={() => setFilter('Finalizado')} 
                />
            </div>

            {/* Tabla de Proyectos */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Proyectos {filter !== 'Todos' ? `(${filter})` : ''}</h2>
                
                {/* Filtros y Búsqueda */}
                <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                    <div className="flex items-center space-x-2">
                        <FilterPill label="Todos" isActive={filter === 'Todos'} onClick={() => setFilter('Todos')} />
                        <FilterPill label="Líder" isActive={filter === 'Líder'} onClick={() => setFilter('Líder')} />
                        <FilterPill label="Colaborador" isActive={filter === 'Colaborador'} onClick={() => setFilter('Colaborador')} />
                        <FilterPill label="Activo" isActive={filter === 'Activo'} onClick={() => setFilter('Activo')} />
                        <FilterPill label="Finalizado" isActive={filter === 'Finalizado'} onClick={() => setFilter('Finalizado')} />
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar proyecto o jefe..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="p-2 pl-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
                        />
                        {/* Icono de Lupa (lucide-react search) */}
                        <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                </div>

                {/* Mensajes de Estado */}
                {isLoading && !error && (
                    <p className="text-center py-8 text-blue-600 font-semibold flex items-center justify-center gap-2">
                         <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Cargando proyectos desde el API de MySQL...
                    </p>
                )}

                {error && (
                    <div className="text-center py-6 bg-red-100 text-red-700 border border-red-300 rounded-lg p-3">
                        <p className="font-semibold">¡Error de Conexión o Datos!</p>
                        <p className="text-sm">{error}</p>
                        <button onClick={fetchProjects} className="mt-3 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm">
                            Reintentar Carga
                        </button>
                    </div>
                )}
                
                {/* Tabla de Resultados */}
                {!isLoading && !error && filteredProjects.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PROYECTO</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROL</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">JEFE</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ESTADO</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PROGRESO</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EQUIPO</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredProjects.map((p) => <ProjectRow key={p.id} project={p} />)}
                            </tbody>
                        </table>
                    </div>
                )}
                
                {/* Mensaje de No Resultados */}
                {!isLoading && !error && filteredProjects.length === 0 && (
                    <p className="text-center py-6 text-gray-500">No se encontraron proyectos para el filtro actual.</p>
                )}
            </div>

            {/* Modal de creación de proyecto */}
            <ProjectModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveProject} />
        </div>
    );
}

// Exportamos el componente principal para que se renderice
export default ProjectManagementPage;

// Renombramos la exportación principal para que funcione en el sandbox
export { ProjectManagementPage as App };