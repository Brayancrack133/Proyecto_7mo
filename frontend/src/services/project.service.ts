import api from './api';

export interface Project {
  id_proyecto: number;
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  id_jefe: number;
  nombre_jefe?: string;
  estado_actual?: string;
  cantidad_tareas?: number;
  progreso?: number;
}

export interface ProjectCreate {
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  id_jefe: number;
}

export interface ProjectUpdate {
  nombre?: string;
  descripcion?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  id_jefe?: number;
}

export const projectService = {
  // Obtener todos los proyectos
  async getAll(): Promise<Project[]> {
    const response = await api.get('/projects');
    return response.data.data;
  },

  // Obtener proyecto por ID
  async getById(id: number): Promise<Project> {
    const response = await api.get(`/projects/${id}`);
    return response.data.data;
  },

  // Crear proyecto
  async create(data: ProjectCreate): Promise<Project> {
    const response = await api.post('/projects', data);
    return response.data.data;
  },

  // Actualizar proyecto
  async update(id: number, data: ProjectUpdate): Promise<Project> {
    const response = await api.put(`/projects/${id}`, data);
    return response.data.data;
  },

  // Eliminar proyecto
  async delete(id: number): Promise<void> {
    await api.delete(`/projects/${id}`);
  },

  // Obtener proyectos por jefe
  async getByJefe(jefeId: number): Promise<Project[]> {
    const response = await api.get(`/projects/jefe/${jefeId}`);
    return response.data.data;
  },

  // Obtener proyectos donde soy colaborador
  async getByColaborador(userId: number): Promise<Project[]> {
    const response = await api.get(`/projects/colaborador/${userId}`);
    return response.data.data;
  },

  // Obtener estados disponibles
  async getStatuses(): Promise<any[]> {
    const response = await api.get('/projects/statuses/all');
    return response.data.data;
  },

  // Cambiar estado del proyecto
  async changeStatus(id: number, estadoId: number): Promise<void> {
    await api.put(`/projects/${id}/status`, { id_estado_proyecto: estadoId });
  },

  // Agregar miembro al equipo
  async addTeamMember(
    projectId: number, 
    userId: number, 
    role: string
  ): Promise<void> {
    await api.post(`/projects/${projectId}/team`, {
      id_usuario: userId,
      rol_en_equipo: role
    });
  },

  // Obtener estadísticas del proyecto
  async getStatistics(id: number): Promise<any> {
    const response = await api.get(`/projects/${id}/statistics`);
    return response.data.data;
  }
};