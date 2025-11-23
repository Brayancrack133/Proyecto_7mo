// src/pages/ProjectsPage.tsx
import React, { useState, useEffect } from 'react';
import { Plus, Grid, List, Filter } from 'lucide-react';
import { Button } from '../components/atoms/Button/Button';
import { SearchBar } from '../components/molecules/SearchBar/SearchBar';
import { StatCard } from '../components/molecules/StatCard/StatCard';
import { Modal } from '../components/molecules/Modal/Modal';
import { EmptyState } from '../components/molecules/EmptyState/EmptyState';
import { ProjectForm } from '../components/organisms/ProjectForm/ProjectForm';
import { ProjectTable } from '../components/organisms/ProjectTable/ProjectTable';
import { ProjectCardsView } from '../components/organisms/ProjectCardsView/ProjectCardsView';
import { useProjects } from '../hooks/useProjects';
import { Project } from '../types';
import { Users, TrendingUp, Calendar, FolderKanban } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const { projects, loading, createProject, updateProject, deleteProject } = useProjects();
  
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'mis-proyectos' | 'colaborador'>('mis-proyectos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtrar proyectos
  useEffect(() => {
    let filtered = projects;

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProjects(filtered);
  }, [searchTerm, activeTab, projects]);

  // Estadísticas
  const stats = {
    misProyectos: projects.length,
    colaborador: 3, // Temporal
    activos: projects.filter(p => p.estado_actual === 'En Progreso').length,
    finalizados: projects.filter(p => p.estado_actual === 'Completado').length
  };

  // Handlers
  const handleCreate = async (data: any) => {
    try {
      setIsSubmitting(true);
      await createProject(data);
      setShowCreateModal(false);
    } catch (error) {
      alert('❌ Error al crear el proyecto');
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
    } catch (error) {
      alert('❌ Error al actualizar el proyecto');
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
    } catch (error) {
      alert('❌ Error al eliminar el proyecto');
    }
  };

  const handleProjectClick = (project: Project) => {
    // TODO: Navegar a detalles del proyecto
    console.log('Ver proyecto:', project);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando proyectos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border-2 border-dashed border-blue-300 p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-600 mb-1">Gestión de Proyectos</h1>
            <p className="text-gray-600">Administra tus proyectos y colaboraciones</p>
          </div>
          {projects.length > 0 && (
            <Button 
              onClick={() => setShowCreateModal(true)}
              variant="primary"
              icon={<Plus className="w-5 h-5" />}
            >
              Nuevo Proyecto
            </Button>
          )}
        </div>
      </div>

      {/* Mostrar Empty State si no hay proyectos */}
      {projects.length === 0 ? (
        <EmptyState onCreateClick={() => setShowCreateModal(true)} />
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Mis Proyectos"
              value={stats.misProyectos}
              icon={<FolderKanban className="w-5 h-5" />}
              color="blue"
            />
            <StatCard
              title="Como Colaborador"
              value={stats.colaborador}
              icon={<Users className="w-5 h-5" />}
              color="purple"
            />
            <StatCard
              title="Activos"
              value={stats.activos}
              icon={<TrendingUp className="w-5 h-5" />}
              color="green"
            />
            <StatCard
              title="Finalizados"
              value={stats.finalizados}
              icon={<Calendar className="w-5 h-5" />}
              color="gray"
            />
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
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
                  Todos los estados
                </button>
                
                <SearchBar
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Buscar..."
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
          </div>

          {/* Projects View */}
          {viewMode === 'grid' ? (
            <ProjectCardsView 
              projects={filteredProjects}
              onProjectClick={handleProjectClick}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <ProjectTable
                projects={filteredProjects}
                onView={handleProjectClick}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                isLoading={loading}
              />
            </div>
          )}
        </>
      )}

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
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirmar Eliminación</h3>
            <p className="text-gray-700 mb-6">
              ¿Estás seguro de eliminar el proyecto <strong>"{selectedProject.nombre}"</strong>?
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
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
```

---

## 🎯 Flujo completo:
```
1. Usuario entra → Ve EmptyState
2. Click "Crear Primer Proyecto" → Modal con formulario
3. Llena datos y guarda → POST a /api/projects
4. Backend inserta en tabla Proyectos
5. Frontend recarga → Muestra cards/tabla de proyectos
6. Click en card → Ver detalles (próximo sprint)