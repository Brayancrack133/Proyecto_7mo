import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai"; // <--- Librería nueva
import dotenv from "dotenv";

dotenv.config();

export const generarDetallesProyecto = async (req: Request, res: Response) => {
  try {
    const { idea } = req.body;

    if (!process.env.GOOGLE_API_KEY) {
        throw new Error("Falta la GOOGLE_API_KEY en el archivo .env");
    }

    // 1. Configuración con tu API Key
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // 2. El Prompt
    const prompt = `
      Actúa como un Experto Gestor de Proyectos.
      Idea del usuario: "${idea}".
      
      Responde SOLAMENTE con un objeto JSON válido (sin texto antes ni después, sin markdown) con esta estructura:
      {
        "nombre_sugerido": "Nombre corto y profesional",
        "descripcion_tecnica": "Descripción técnica detallada",
        "tipo": "Desarrollo Web / Móvil / IA / etc",
        "complejidad": "Baja / Media / Alta",
        "tamano": "Pequeño / Mediano / Grande",
        "metodologia_recomendada": "Scrum / Kanban / Cascada",
        "justificacion_ia": "Por qué esta metodología",
        "tareas_iniciales": ["Tarea 1", "Tarea 2", "Tarea 3", "Tarea 4", "Tarea 5"]
      }
    `;

    // 3. Generar contenido
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    console.log("🤖 Respuesta cruda de Gemini:", text); // Para depurar en consola

    // 4. Limpieza del JSON (Gemini a veces pone ```json ... ```)
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const jsonRespuesta = JSON.parse(text);

    res.json(jsonRespuesta);

  } catch (error) {
    console.error("❌ Error en el Backend IA:", error);
    res.status(500).json({ 
        error: "Error generando respuesta", 
        details: error instanceof Error ? error.message : "Desconocido" 
    });
  }
};