import type { Request } from 'express';

// --- MOCK DE DATOS DEL PROYECTO (Simulando consulta de Tablas SQL) ---

// Simulación de Tareas (Tabla Tareas)
const MOCK_TASKS = [
    { id: 1, projectId: 1, isCompleted: true, priority: 'Alta', assignedUserId: 1 },
    { id: 2, projectId: 1, isCompleted: true, priority: 'Media', assignedUserId: 2 },
    { id: 3, projectId: 1, isCompleted: false, priority: 'Alta', assignedUserId: 1 },
    { id: 4, projectId: 1, isCompleted: false, priority: 'Baja', assignedUserId: 3 },
    { id: 5, projectId: 2, isCompleted: true, priority: 'Alta', assignedUserId: 2 },
];

// Simulación de Recomendaciones de IA (Tabla Recomendaciones)
const MOCK_AI_PREDICTIONS = [
    { projectId: 1, confidence: 0.92, message: 'El proyecto está en riesgo leve de retraso.', delayDays: 3 },
    { projectId: 2, confidence: 0.98, message: 'El proyecto se completará a tiempo.', delayDays: 0 },
];

// Tipos para el resultado de la métrica
interface KPIMetric {
    id: number;
    title: string;
    value: string | number;
    iconName: string;
    trend: 'up' | 'down' | 'stable';
    alertLevel: 'none' | 'warning' | 'critical'; // RF33
    description: string;
}

class DashboardService {

    // Simula la aplicación de filtros (RF32)
    private applyFilters(projectId: number, filters: any) {
        if (projectId !== 1) return [];

        let filteredTasks = MOCK_TASKS.filter(t => t.projectId === projectId);
        
        // Aplicación del filtro de prioridad
        if (filters.priority) {
            filteredTasks = filteredTasks.filter(t => t.priority.toLowerCase() === filters.priority.toLowerCase());
        }
        
        return filteredTasks;
    }

    // RF27, RF28, RF33: Calcula todas las métricas del proyecto
    public async getProjectMetrics(projectId: number, filters: any): Promise<KPIMetric[]> {
        const filteredTasks = this.applyFilters(projectId, filters);
        const totalTasks = filteredTasks.length;
        const completedTasks = filteredTasks.filter(t => t.isCompleted).length;
        
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        // Obtener predicción de la IA (RF29)
        const aiPrediction = MOCK_AI_PREDICTIONS.find(p => p.projectId === projectId) || { delayDays: 0 };

        // 1. Métrica de Tareas Completadas (RF28)
        const completionMetric: KPIMetric = {
            id: 1, title: 'Tareas Completadas', value: `${completionRate}%`, iconName: 'checkCircle', trend: 'up',
            alertLevel: (completionRate < 70) ? 'warning' : 'none',
            description: `Completadas: ${completedTasks} de ${totalTasks}.`,
        };

        // 2. Métrica de Tiempo Restante (Predicción IA - RF29, RF33)
        let alertLevel: KPIMetric['alertLevel'] = 'none';
        if (aiPrediction.delayDays > 0) {
            alertLevel = (aiPrediction.delayDays >= 5) ? 'critical' : 'warning';
        }
        
        const timeMetric: KPIMetric = {
            id: 2, title: 'Retraso Estimado (IA)', value: `${aiPrediction.delayDays} días`, iconName: 'clock', trend: (aiPrediction.delayDays > 0) ? 'down' : 'stable',
            alertLevel: alertLevel,
            description: `Predicción de riesgo: ${MOCK_AI_PREDICTIONS.find(p => p.projectId === projectId)?.message || 'Sin riesgo.'}`,
        };

        // 3. Métrica de Avance General (RF27)
        const progressMetric: KPIMetric = {
            id: 3, title: 'Avance General', value: `${completionRate}%`, iconName: 'activity', trend: 'stable', alertLevel: 'none',
            description: 'Avance total del proyecto.',
        };
        
        // 4. Métrica de Incidencias (Simulación para alerta crítica)
        const incidentsMetric: KPIMetric = {
            id: 4, title: 'Incidencias Críticas', value: 3, iconName: 'bug', trend: 'up',
            alertLevel: 'critical', // RF33: Forzar alerta para demostración de semáforo
            description: 'Se superó el umbral de incidencias permitidas.',
        };


        return [completionMetric, timeMetric, incidentsMetric, progressMetric];
    }
    
    // RF30: Simulación de Exportación de Reportes
    public async exportReport(projectId: number, format: 'pdf' | 'excel', filters: any) {
        // En una implementación real, esto generaría el archivo y lo devolvería.
        console.log(`Generando reporte para Proyecto ${projectId} en formato ${format}...`);
        return { success: true, message: `Reporte en ${format} generado.`, filePath: `path/to/report.${format}` };
    }
}

export default new DashboardService();