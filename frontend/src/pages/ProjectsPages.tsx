import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/templates';
import { ProjectStats } from '../components/organisms/ProjectStats';
import { ProjectTable } from '../components/organisms/ProjectTable';
import { ProjectForm } from '../components/organisms/ProjectForm';
import { Modal } from '../components/molecules/Modal';
import { Button } from '../components/atoms/Button';
import { SearchBar } from '../components/molecules/SearchBar';
import { Plus, Filter, Grid, List, Trash2 } from 'lucide-react';
import { useProjects } from '../hooks';
// ✅ Correcto
import type { Project } from '../types/project.types';


export const ProjectsPage: React.FC = () => {
  const { projects, loading, createProject, updateProject, deleteProject } = useProjects();
  
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'mis-proyectos' | 'colaborador'>('mis-proyectos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  
  // Modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtrar proyectos
  useEffect(() => {
    let filtered = projects;

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.nombre_jefe?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // TODO: Filtrar por tab (cuando tengamos autenticación)
    // Por ahora mostramos todos

    setFilteredProjects(filtered);
  }, [searchTerm, activeTab, projects]);

  // Calcular estadísticas
  const stats = {
    misProyectos: projects.filter(p => p.id_jefe === 1).length, // TODO: usar usuario actual
    colaborador: projects.filter(p => p.id_jefe !== 1).length,
    activos: projects.filter(p => p.estado_actual === 'En Progreso').length,
    finalizados: projects.filter(p => p.estado_actual === 'Completado').length
  };

  // Handlers
  const handleCreate = async (data: any) => {
    try {
      setIsSubmitting(true);
      await createProject(data);
      setShowCreateModal(false);
      alert('✅ Proyecto creado exitosamente');
    } catch (error) {
      alert('❌ Error al crear el proyecto');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setShowEditModal(true);
  };

  const handleUpdate = async (data: any) => {
    if (!selectedProject) return;
    
    try {
      setIsSubmitting(true);
      await updateProject(selectedProject.id_proyecto, data);
      setShowEditModal(false);
      setSelectedProject(null);
      alert('✅ Proyecto actualizado exitosamente');
    } catch (error) {
      alert('❌ Error al actualizar el proyecto');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (project: Project) => {
    setSelectedProject(project);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProject) return;
    
    try {
      await deleteProject(selectedProject.id_proyecto);
      setShowDeleteModal(false);
      setSelectedProject(null);
      alert('✅ Proyecto eliminado exitosamente');
    } catch (error) {
      alert('❌ Error al eliminar el proyecto');
      console.error(error);
    }
  };

  const handleView = (project: Project) => {
    // TODO: Navegar a página de detalles
    alert(`Ver detalles de: ${project.nombre}\n(Implementar en siguiente sprint)`);
  };

  return (
    <DashboardLayout>
      {/* Title Section */}
      <div className="bg-white rounded-lg shadow-sm border-2 border-dashed border-blue-300 p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-600 mb-1">Gestión de Proyectos</h1>
            <p className="text-gray-600">Administra tus proyectos y colaboraciones</p>
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)}
            variant="primary"
            icon={<Plus className="w-5 h-5" />}
          >
            Nuevo Proyecto
          </Button>
        </div>
      </div>

      {/* Stats */}
      <ProjectStats {...stats} />

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('mis-proyectos')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === 'mis-proyectos' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Mis Proyectos
              <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                {stats.misProyectos}
              </span>
            </button>
            <button 
              onClick={() => setActiveTab('colaborador')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === 'colaborador' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Proyectos Colaborador
              <span className="ml-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                {stats.colaborador}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtros
            </button>
            
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar proyectos..."
              className="w-64"
            />

            <div className="flex gap-1 border border-gray-300 rounded-lg p-1">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <ProjectTable
          projects={filteredProjects}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          isLoading={loading}
        />
      </div>

      {/* Modal Crear */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Crear Nuevo Proyecto"
        size="lg"
      >
        <ProjectForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Modal Editar */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar Proyecto"
        size="lg"
      >
        {selectedProject && (
          <ProjectForm
            initialData={{
              nombre: selectedProject.nombre,
              descripcion: selectedProject.descripcion || '',
              fecha_inicio: selectedProject.fecha_inicio.split('T')[0],
              fecha_fin: selectedProject.fecha_fin?.split('T')[0] || '',
              id_jefe: selectedProject.id_jefe
            }}
            onSubmit={handleUpdate}
            onCancel={() => {
              setShowEditModal(false);
              setSelectedProject(null);
            }}
            isLoading={isSubmitting}
          />
        )}
      </Modal>

      {/* Modal Eliminar */}
      {showDeleteModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Confirmar Eliminación</h3>
                <p className="text-sm text-gray-500">Esta acción no se puede deshacer</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              ¿Estás seguro de eliminar el proyecto <strong>"{selectedProject.nombre}"</strong>?
              <br />
              <span className="text-sm text-gray-500 mt-2 block">
                Se eliminarán también todas las tareas, documentos y datos asociados.
              </span>
            </p>
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedProject(null);
                }}
                variant="secondary"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                variant="danger"
              >
                Eliminar Proyecto
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};