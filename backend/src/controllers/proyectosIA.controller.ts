import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

export const generarDetallesProyecto = async (req: Request, res: Response) => {
  try {
    const { idea } = req.body;

    if (!process.env.GOOGLE_API_KEY) {
        throw new Error("Falta la GOOGLE_API_KEY en el archivo .env");
    }

    if (!idea) {
        res.status(400).json({ error: "Se requiere una descripción." });
        return;
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    
    // 🔥 AQUÍ ESTÁ EL CAMBIO CLAVE: Usamos el modelo que sí tienes
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Actúa como un Experto Gestor de Proyectos.
      Idea del usuario: "${idea}".
      
      Responde SOLAMENTE con un objeto JSON válido (sin texto extra, sin markdown) con esta estructura exacta:
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

    console.log("🧠 Enviando a Gemini 2.5 Flash...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Limpieza de formato JSON
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const jsonRespuesta = JSON.parse(text);
    
    console.log("✅ Respuesta recibida con éxito.");
    res.json(jsonRespuesta);

  } catch (error: any) {
    console.error("❌ Error IA:", error.message);
    res.status(500).json({ 
        error: "Error al generar con IA", 
        details: error.message 
    });
  }
};