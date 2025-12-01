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
    // CORRECCIÓN: Cambiado de 'projects' a 'proyectos' para coincidir con Backend
    const response = await api.get('/proyectos');
    // Manejamos si el backend devuelve { data: [...] } o directamente [...]
    return response.data.data || response.data;
  },

  // Obtener proyecto por ID
  async getById(id: number): Promise<Project> {
    const response = await api.get(`/proyectos/${id}`);
    return response.data.data || response.data;
  },

  // Crear proyecto
  async create(data: ProjectCreate): Promise<Project> {
    const response = await api.post('/proyectos', data);
    return response.data.data || response.data;
  },

  // Actualizar proyecto
  async update(id: number, data: ProjectUpdate): Promise<Project> {
    const response = await api.put(`/proyectos/${id}`, data);
    return response.data.data || response.data;
  },

  // Eliminar proyecto
  async delete(id: number): Promise<void> {
    await api.delete(`/proyectos/${id}`);
  },

  // Obtener proyectos por jefe (CORREGIDO EL ERROR 404)
  async getByJefe(jefeId: number): Promise<Project[]> {
    // Usamos la ruta '/proyectos/usuario/:id' que es la común para obtener los proyectos de alguien
    // Asegúrate que en tu backend/src/routes/proyectos.routes.ts exista router.get("/usuario/:idUsuario"...)
    const response = await api.get(`/proyectos/usuario/${jefeId}`);
    return response.data.data || response.data;
  },

  // Obtener proyectos donde soy colaborador
  async getByColaborador(userId: number): Promise<Project[]> {
    // Si no existe una ruta específica de colaborador, solemos usar la misma de usuario
    const response = await api.get(`/proyectos/usuario/${userId}`);
    return response.data.data || response.data;
  },

  // Obtener estados disponibles
  async getStatuses(): Promise<any[]> {
    const response = await api.get('/proyectos/statuses/all');
    return response.data.data || response.data;
  },

  // Cambiar estado del proyecto
  async changeStatus(id: number, estadoId: number): Promise<void> {
    await api.put(`/proyectos/${id}/status`, { id_estado_proyecto: estadoId });
  },

  // Agregar miembro al equipo
  async addTeamMember(
    projectId: number, 
    userId: number, 
    role: string
  ): Promise<void> {
    await api.post(`/proyectos/${projectId}/team`, {
      id_usuario: userId,
      rol_en_equipo: role
    });
  },

  // Obtener estadísticas del proyecto
  async getStatistics(id: number): Promise<any> {
    const response = await api.get(`/proyectos/${id}/statistics`);
    return response.data.data || response.data;
  }
};