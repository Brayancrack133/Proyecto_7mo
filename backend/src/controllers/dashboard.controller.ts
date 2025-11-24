import type { Request, Response } from 'express'; 
import DashboardService from '../services/dashboard.service.js';

class DashboardController {
    
    // RF27, RF28, RF29, RF33: Obtiene todas las métricas y aplica filtros (RF32)
    public async getDashboardMetrics(req: Request, res: Response) {
        try {
            // 🛑 RF32: Obtener filtros de la URL (req.query) 🛑
            const projectId = parseInt(req.query.projectId as string) || 1; // Proyecto por defecto
            const filters = req.query; // Pasa todos los filtros dinámicos (priority, user, date)
            
            const metrics = await DashboardService.getProjectMetrics(projectId, filters);
            
            return res.status(200).json({ success: true, data: metrics });

        } catch (error) {
            console.error('Error al obtener métricas del dashboard:', error);
            return res.status(500).json({ success: false, message: 'Error interno al procesar las métricas.' });
        }
    }
    
    // RF30: Lógica para Exportar Reportes (PDF/Excel)
    public async exportProjectReport(req: Request, res: Response) {
        try {
            const projectId = parseInt(req.query.projectId as string) || 1;
            const format = req.query.format as 'pdf' | 'excel';
            const filters = req.query;

            if (!format || !['pdf', 'excel'].includes(format)) {
                return res.status(400).json({ success: false, message: 'Formato de exportación inválido.' });
            }

            const result = await DashboardService.exportReport(projectId, format, filters);
            
            if (result.success) {
                // En un entorno real, aquí se usaría res.download(result.filePath)
                return res.status(200).json({ success: true, message: `Reporte de ${format.toUpperCase()} generado con éxito.` });
            }
            return res.status(500).json({ success: false, message: 'Error al generar el reporte.' });

        } catch (error) {
            console.error('Error durante la exportación del reporte:', error);
            return res.status(500).json({ success: false, message: 'Error interno en la exportación.' });
        }
    }
}

export default new DashboardController();