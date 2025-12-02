import { Request, Response } from "express";
import { db } from "../config/db.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const analizarRiesgosProyecto = async (req: Request, res: Response) => {
    const { idProyecto } = req.params;

    try {
        // 1. OBTENER DATOS DEL PROYECTO
        const [proyectos]: any[] = await db.query("SELECT * FROM Proyectos WHERE id_proyecto = ?", [idProyecto]);
        const [tareas]: any[] = await db.query("SELECT * FROM Tareas WHERE id_proyecto = ?", [idProyecto]);

        if (proyectos.length === 0) return res.status(404).json({ error: "Proyecto no encontrado" });

        const proyecto = proyectos[0];
        const totalTareas = tareas.length;

        // 2. CÁLCULOS MATEMÁTICOS (ESTADÍSTICAS)
        const tareasCompletadas = tareas.filter((t: any) => t.estado === 'completada').length;
        const porcentajeProgreso = totalTareas > 0 ? (tareasCompletadas / totalTareas) * 100 : 0;

        const fechaInicio = new Date(proyecto.fecha_inicio).getTime();
        const fechaFin = proyecto.fecha_fin ? new Date(proyecto.fecha_fin).getTime() : new Date().getTime();
        const hoy = new Date().getTime();
        
        let porcentajeTiempo = 0;
        const duracionTotal = fechaFin - fechaInicio;
        if (duracionTotal > 0) {
            const tiempoTranscurrido = hoy - fechaInicio;
            porcentajeTiempo = (tiempoTranscurrido / duracionTotal) * 100;
            if (porcentajeTiempo > 100) porcentajeTiempo = 100;
            if (porcentajeTiempo < 0) porcentajeTiempo = 0;
        }

        const diasRestantes = Math.ceil((fechaFin - hoy) / (1000 * 60 * 60 * 24));

        // 3. DETERMINAR NIVEL DE RIESGO
        let nivelRiesgo = "BAJO";
        if (porcentajeTiempo > 80 && porcentajeProgreso < 50) nivelRiesgo = "ALTO";
        else if (porcentajeTiempo > 50 && porcentajeProgreso < 20) nivelRiesgo = "MEDIO";
        else if (porcentajeTiempo > (porcentajeProgreso + 20)) nivelRiesgo = "MEDIO";

        // =================================================================================
        // 4. 🔥 SISTEMA DE CACHÉ INTELIGENTE (USO DE TU TABLA RECOMENDACIONES) 🔥
        // =================================================================================
        
        // A. ¿Ya analizamos este proyecto hoy? (Evitar llamar a la IA innecesariamente)
        const [analisisPrevio]: any[] = await db.query(`
            SELECT * FROM Recomendaciones 
            WHERE id_entidad_afectada = ? 
            AND tipo_entidad_afectada = 'Proyecto'
            AND fecha_generacion > DATE_SUB(NOW(), INTERVAL 24 HOUR) -- Validez de 24 horas
            ORDER BY fecha_generacion DESC LIMIT 1
        `, [idProyecto]);

        let mensaje = "El proyecto avanza de forma saludable.";
        let recomendaciones: string[] = ["Mantener el monitoreo periódico."];

        if (analisisPrevio.length > 0) {
            // ✅ CACHÉ HIT: Usamos lo que ya estaba en la BD
            console.log("⚡ Usando análisis guardado en BD");
            mensaje = analisisPrevio[0].mensaje_recomendacion;
            // Si guardaste las recomendaciones como JSON en texto, las parseamos, si no usamos genéricas
            try {
                // Nota: Tu tabla tiene 'mensaje_recomendacion' como TEXT. 
                // Para simplificar, asumimos que el mensaje principal viene de ahí.
                // Las recomendaciones específicas las regeneramos o las podríamos guardar en otro campo si modificaras la BD.
            } catch (e) {}
        } 
        else if (process.env.GOOGLE_API_KEY && nivelRiesgo !== "BAJO") {
            // ❌ CACHÉ MISS: Llamamos a Gemini y GUARDAMOS
            try {
                console.log("🧠 Consultando a Gemini...");
                const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
                const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

                const prompt = `
                    Actúa como un Gestor de Proyectos Senior.
                    Proyecto: "${proyecto.nombre}" (${proyecto.descripcion}).
                    Estado: Tiempo consumido ${Math.round(porcentajeTiempo)}%, Avance ${Math.round(porcentajeProgreso)}%.
                    Riesgo: ${nivelRiesgo}.
                    
                    Responde SOLO un JSON:
                    {
                        "diagnostico": "Frase ejecutiva corta sobre el problema.",
                        "acciones": ["Acción 1 (max 5 palabras)", "Acción 2 (max 5 palabras)"]
                    }
                `;

                const result = await model.generateContent(prompt);
                const text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
                const jsonIA = JSON.parse(text);
                
                mensaje = jsonIA.diagnostico;
                recomendaciones = jsonIA.acciones;

                // 💾 GUARDAR EN LA BASE DE DATOS (HISTORIAL)
                // Necesitamos el ID del usuario destino (El jefe del proyecto)
                const idJefe = proyecto.id_jefe; 
                
                await db.query(`
                    INSERT INTO Recomendaciones 
                    (id_usuario_destino, tipo_entidad_afectada, id_entidad_afectada, mensaje_recomendacion, nivel_confianza)
                    VALUES (?, 'Proyecto', ?, ?, ?)
                `, [idJefe, idProyecto, mensaje, 0.95]);

            } catch (error) {
                console.error("Error Gemini:", error);
            }
        }

        // 5. RESPUESTA FINAL
        res.json({
            id_proyecto: idProyecto,
            metricas: {
                progreso_real: Math.round(porcentajeProgreso),
                tiempo_consumido: Math.round(porcentajeTiempo),
                dias_restantes: diasRestantes
            },
            analisis: {
                nivel_riesgo: nivelRiesgo,
                mensaje: mensaje,
                acciones_sugeridas: recomendaciones
            }
        });

    } catch (error: any) {
        console.error("Error en riesgos:", error);
        res.status(500).json({ error: "Error interno en motor de riesgos" });
    }
};