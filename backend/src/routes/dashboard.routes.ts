import { Router } from 'express';
// 🛑 RUTA CORREGIDA: Sube un nivel de 'routes/' a 'src/', luego entra a 'controllers/' 🛑
import DashboardController from '../controllers/dashboard.controller.js'; 
// import { authMiddleware } from '../middlewares/auth.middleware'; // Descomentar para seguridad

const router = Router();

// RF27, RF28, RF29, RF33, RF32: Ruta para obtener todas las métricas con filtros
router.get('/dashboard/metrics', DashboardController.getDashboardMetrics);

// RF30: Ruta para exportar reportes
router.get('/dashboard/export', DashboardController.exportProjectReport);

export default router;