export interface DashboardSummary {
  // Métricas Clave (KPIs)
  totalProyectos: number;
  proyectosActivos: number;
  proyectosCompletados: number;
  
  // Métricas de Tareas
  tareasPendientes: number;
  tareasVencidas: number;
  
  // Métricas de Documentos
  documentosTotales: number;
  
  // Distribución de Tareas por Estado (para gráfico)
  taskDistribution: {
    status: string;
    count: number;
  }[];
}