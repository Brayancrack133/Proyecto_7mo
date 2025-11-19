// ✅ Archivo oficial de tipos de proyectos

export interface Project {
  id_proyecto: number;
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  id_jefe: number;
  nombre_jefe?: string;
  apellido_jefe?: string;
  estado_actual?: string;
  id_estado_proyecto?: number;
  cantidad_tareas?: number;
  tareas_completadas?: number;
  progreso?: number;
}

export interface ProjectFormData {
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  id_jefe: number;
}

export interface ProjectFilters {
  searchTerm: string;
  status?: string;
  jefeId?: number;
}

export interface ProjectStats {
  misProyectos: number;
  colaborador: number;
  activos: number;
  finalizados: number;
}
