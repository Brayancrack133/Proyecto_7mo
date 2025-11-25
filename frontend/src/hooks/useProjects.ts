// frontend/src/hooks/useProjects.ts

import { useState, useEffect } from 'react';
import { projectService, Project } from '../services';
import { useUser } from '../context/UserContext'; // <-- ¡IMPORTA ESTO!

export const useProjects = () => {
  // 1. Obtener el estado del usuario del contexto
  const { usuario, isLoading: isUserLoading } = useUser(); 
  const userId = usuario?.id_usuario;

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modificada para aceptar el ID de usuario
  const loadProjects = async (id: number) => { 
    try {
      setLoading(true);
      setError(null);
      
      // NOTA: Debes asegurarte de que projectService tenga un método para cargar
      // proyectos por ID de Jefe/Usuario (lo he asumido como .getByJefe(id))
      const data = await (projectService.getByJefe as any)(id); 
      
      setProjects(data);
    } catch (err) {
      setError('Error al cargar los proyectos del usuario');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 💡 CORRECCIÓN: Solo ejecuta la carga si el ID del usuario existe 
    // y el UserContext ha terminado de cargar.
    if (!isUserLoading && userId) {
      loadProjects(userId);
    } else if (!isUserLoading && !userId) {
      // Si termina de cargar y no hay usuario (ej. no logueado), finaliza el loading.
      setLoading(false); 
    }
  }, [userId, isUserLoading]); // Dependencias: recarga cuando el ID o el estado de carga cambie.

  const createProject = async (data: any) => {
    try {
      if (!userId) {
        throw new Error('Usuario no autenticado para crear proyecto');
      }
      
      // Asegurar que el id_jefe se pase en la creación si no se incluyó
      const payload = { ...data, id_jefe: data.id_jefe || userId };

      const newProject = await projectService.create(payload);
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
    // La carga debe ser true si el usuario o los proyectos están cargando.
    loading: loading || isUserLoading, 
    error,
    // Permite recargar manualmente, si el ID existe.
    loadProjects: () => { if (userId) loadProjects(userId); }, 
    createProject,
    updateProject,
    deleteProject
  };
};