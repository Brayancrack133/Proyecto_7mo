import { Router } from "express";
// IMPORTANTE: Usamos 'db' (que soporta Promesas), NO 'dbRaw'
import { db } from "../config/db.js"; 

const router = Router();

// GET /api/dashboard/stats/:idUsuario
router.get("/stats/:idUsuario", async (req, res) => {
    const { idUsuario } = req.params;
    
    console.log(`📡 Solicitando Dashboard Avanzado para Usuario ID: ${idUsuario}`);

    try {
        // ==========================================
        // 1. OBTENER PROYECTOS DEL USUARIO
        // ==========================================
        const queryProyectos = `
            SELECT DISTINCT 
                p.id_proyecto, 
                p.nombre, 
                p.fecha_inicio,
                p.fecha_fin, 
                e.nombre_equipo
            FROM proyectos p
            LEFT JOIN equipos e ON p.id_equipo = e.id_equipo
            LEFT JOIN miembros_equipo me ON p.id_equipo = me.id_equipo
            WHERE p.id_jefe = ? OR me.id_usuario = ?
        `;

        const [proyectos]: any[] = await db.query(queryProyectos, [idUsuario, idUsuario]);
        
        if (!proyectos || proyectos.length === 0) {
            return res.json({
                kpis: { total_proyectos: 0, total_tareas: 0, total_documentos: 0 },
                proyectos: [],
                grafica: [],
                proximosVencimientos: [],
                cargaEquipo: [],
                actividadReciente: [],
                docsPorTipo: []
            });
        }

        const projectIds = proyectos.map((p: any) => p.id_proyecto);

        // ==========================================
        // 2. ESTADÍSTICAS DETALLADAS (KPIs por Proyecto)
        // ==========================================
        const queryStats = `
            SELECT 
                p.id_proyecto,
                (SELECT COUNT(*) FROM miembros_equipo WHERE id_equipo = p.id_equipo) as cantidad_miembros,
                (SELECT COUNT(*) FROM tareas WHERE id_proyecto = p.id_proyecto) as cantidad_tareas,
                (SELECT COUNT(*) FROM documentos WHERE id_proyecto = p.id_proyecto) as cantidad_docs
            FROM proyectos p
            WHERE p.id_proyecto IN (?)
        `;

        // ==========================================
        // 3. PRÓXIMOS VENCIMIENTOS (Tareas a vencer en 7 días)
        // ==========================================
        const queryProximas = `
            SELECT t.titulo, t.fecha_fin, p.nombre as nombre_proyecto, u.nombre as responsable
            FROM tareas t
            JOIN proyectos p ON t.id_proyecto = p.id_proyecto
            LEFT JOIN usuarios u ON t.id_responsable = u.id_usuario
            WHERE t.id_proyecto IN (?) 
            AND t.fecha_fin >= CURDATE()
            ORDER BY t.fecha_fin ASC
            LIMIT 5
        `;

        // ==========================================
        // 4. CARGA DE TRABAJO DEL EQUIPO (Top 5 Miembros)
        // ==========================================
        const queryCargaEquipo = `
            SELECT u.nombre, u.apellido, COUNT(t.id_tarea) as valor
            FROM tareas t
            JOIN usuarios u ON t.id_responsable = u.id_usuario
            WHERE t.id_proyecto IN (?)
            GROUP BY u.id_usuario
            ORDER BY valor DESC
            LIMIT 5
        `;

        // ==========================================
        // 5. DOCUMENTOS POR TIPO
        // ==========================================
        const queryDocsTipo = `
            SELECT td.extension as nombre, COUNT(d.id_doc) as valor
            FROM documentos d
            JOIN tipos_documento td ON d.id_tipo_doc = td.id_tipo_doc
            WHERE d.id_proyecto IN (?)
            GROUP BY td.id_tipo_doc
        `;

        // ==========================================
        // 6. ACTIVIDAD RECIENTE
        // ==========================================
        const queryNotificaciones = `
            SELECT contenido, fecha_creacion
            FROM notificaciones
            WHERE id_usuario_destino = ?
            ORDER BY fecha_creacion DESC LIMIT 5
        `;

        // Ejecutamos todas las consultas en paralelo
        const [
            [stats], 
            [proximas], 
            [cargaEquipo],
            [docsTipo],
            [notis]
        ] = await Promise.all([
            db.query(queryStats, [projectIds]),
            db.query(queryProximas, [projectIds]),
            db.query(queryCargaEquipo, [projectIds]),
            db.query(queryDocsTipo, [projectIds]),
            db.query(queryNotificaciones, [idUsuario])
        ]);

        // ==========================================
        // 7. PROCESAMIENTO Y RESPUESTA
        // ==========================================
        
        let totalTareas = 0;
        let totalDocumentos = 0;

        const proyectosCompletos = proyectos.map((p: any) => {
            const stat = (stats as any[]).find((s: any) => s.id_proyecto === p.id_proyecto) || {};
            const t = stat.cantidad_tareas || 0;
            const d = stat.cantidad_docs || 0;
            const m = stat.cantidad_miembros || 0;

            totalTareas += t;
            totalDocumentos += d;

            return {
                ...p,
                cantidad_miembros: m,
                cantidad_tareas: t,
                cantidad_docs: d
            };
        });

        const graficaData = proyectosCompletos.map((p: any) => ({
            nombre: p.nombre,
            valor: p.cantidad_tareas
        }));

        res.json({
            kpis: {
                total_proyectos: proyectos.length,
                total_tareas: totalTareas,
                total_documentos: totalDocumentos
            },
            proyectos: proyectosCompletos,
            grafica: graficaData,
            proximosVencimientos: proximas, 
            cargaEquipo: cargaEquipo,
            docsPorTipo: docsTipo,
            actividadReciente: notis
        });

    } catch (err: any) {
        console.error("❌ Error en Dashboard Route:", err);
        res.status(500).json({ error: "Error interno del servidor: " + err.message });
    }
});

// ¡ESTA LÍNEA ES CRUCIAL PARA SOLUCIONAR EL ERROR!
export default router;