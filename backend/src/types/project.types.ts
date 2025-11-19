export interface Project {
  id_proyecto: number;
  nombre: string;
  descripcion: string | null;
  fecha_inicio: string;
  fecha_fin: string | null;
  id_jefe: number;
  nombre_jefe?: string;
  apellido_jefe?: string;
  estado_actual?: string;
  id_estado_proyecto?: number;
  equipo_nombre?: string;
  cantidad_tareas?: number;
  tareas_completadas?: number;
  progreso?: number;
}

export interface ProjectCreate {
  nombre: string;
  descripcion?: string;
  fecha_inicio: string;
  fecha_fin?: string;
  id_jefe: number;
  id_estado_proyecto?: number; // Por defecto será "Planificación"
}

export interface ProjectUpdate {
  nombre?: string;
  descripcion?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  id_jefe?: number;
}

export interface ProjectWithDetails extends Project {
  estado_actual: string;
  equipo: TeamMember[];
  tareas: Task[];
}

export interface TeamMember {
  id_miembro: number;
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  rol_en_equipo: string;
}

export interface Task {
  id_tarea: number;
  titulo: string;
  descripcion: string | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  id_responsable: number | null;
  nombre_responsable?: string;
  prioridad_actual?: string;
}

export interface ProjectStatus {
  id_estado_proyecto: number;
  nombre_estado: string;
}