import { useState, useEffect } from 'react';
import { projectService, Project } from '../services';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectService.getAll();
      setProjects(data);
    } catch (err) {
      setError('Error al cargar los proyectos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const createProject = async (data: any) => {
    try {
      const newProject = await projectService.create(data);
      setProjects(prev => [newProject, ...prev]);
      return newProject;
    } catch (err) {
      throw new Error('Error al crear el proyecto');
    }
  };

  const updateProject = async (id: number, data: any) => {
    try {
      const updatedProject = await projectService.update(id, data);
      setProjects(prev => 
        prev.map(p => p.id_proyecto === id ? updatedProject : p)
      );
      return updatedProject;
    } catch (err) {
      throw new Error('Error al actualizar el proyecto');
    }
  };

  const deleteProject = async (id: number) => {
    try {
      await projectService.delete(id);
      setProjects(prev => prev.filter(p => p.id_proyecto !== id));
    } catch (err) {
      throw new Error('Error al eliminar el proyecto');
    }
  };

  return {
    projects,
    loading,
    error,
    loadProjects,
    createProject,
    updateProject,
    deleteProject
  };
};