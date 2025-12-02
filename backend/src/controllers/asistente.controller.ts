import { Request, Response } from "express";
import { db } from "../config/db.js";
import { GoogleGenerativeAI } from "@google/generative-ai"; 
// Asegúrate de que este sea el único import de Google AI

export const chatAsistente = async (req: Request, res: Response) => {
    const { mensaje, idProyecto } = req.body;

    if (!mensaje) {
        return res.status(400).json({ error: "El mensaje es obligatorio." });
    }

    try {
        // 1. RECOLECTAR CONTEXTO (RAG)
        let contextoProyecto = "No se seleccionó ningún proyecto específico. Responde dudas generales de gestión.";
        let datosTareas: any[] = [];
        let datosRiesgos: any[] = [];

        if (idProyecto) {
            // Consulta de proyecto (Robusta)
            const [proyectos]: any[] = await db.query("SELECT * FROM Proyectos WHERE id_proyecto = ?", [idProyecto]);
            if (proyectos.length > 0) {
                const p = proyectos[0];
                contextoProyecto = `
                    Nombre: ${p.nombre}
                    Descripción: ${p.descripcion}
                    Fechas: Inicio ${p.fecha_inicio} - Fin Estimado ${p.fecha_fin}
                    Tipo: ${p.tipo}
                    Complejidad: ${p.complejidad}
                `;
            }

            // 👇 CLAVE: Limitamos las tareas para evitar que el JSON sea gigante y desborde el token o la BD
            const [tareas]: any[] = await db.query(`
                SELECT t.titulo, t.descripcion, t.estado, u.nombre as responsable
                FROM Tareas t
                LEFT JOIN Usuarios u ON t.id_responsable = u.id_usuario
                WHERE t.id_proyecto = ?
                ORDER BY t.estado ASC, t.fecha_fin DESC
                LIMIT 10 
            `, [idProyecto]);
            datosTareas = tareas;

            // Riesgos
            const [riesgos]: any[] = await db.query(`
                SELECT mensaje_recomendacion, fecha_generacion 
                FROM Recomendaciones 
                WHERE id_entidad_afectada = ? AND tipo_entidad_afectada = 'Proyecto'
                ORDER BY fecha_generacion DESC LIMIT 2
            `, [idProyecto]);
            datosRiesgos = riesgos;
        }

        // 2. CONSTRUIR EL PROMPT (Igual que antes)
        const systemPrompt = `
            Eres DOUE, un Asistente experto en Gestión de Proyectos.
            Tu misión es ayudar al usuario basándote ÚNICAMENTE en los datos que te proporciono.
            
            --- DATOS DEL PROYECTO ---
            ${contextoProyecto}
            --- ESTADO DE LAS 10 TAREAS MÁS RECIENTES ---
            ${JSON.stringify(datosTareas)}
            --- ALERTAS DE RIESGO ---
            ${JSON.stringify(datosRiesgos)}
            
            PREGUNTA DEL USUARIO:
            "${mensaje}"
        `;

        // 3. CONSULTAR A GEMINI
        if (!process.env.GOOGLE_API_KEY) throw new Error("Falta API Key");
        
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 

        const result = await model.generateContent(systemPrompt);
        const respuestaIA = result.response.text(); // La sintaxis correcta para tu SDK

        // 4. RESPONDER
        res.json({ reply: respuestaIA });

    } catch (error: any) {
        // Loguear el error en el terminal para verlo
        console.error("--- ERROR CRÍTICO ASISTENTE DOUE ---");
        console.error(error);
        
        // Responder con un mensaje de error amigable y el estado correcto
        res.status(500).json({ error: "Error interno del servidor al procesar IA." });
    }
};