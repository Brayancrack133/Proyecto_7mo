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
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 🎯 PROMPT ESTRICTO: Le damos las listas exactas de tu sistema
    const prompt = `
      Actúa como un Experto Gestor de Proyectos.
      Idea del usuario: "${idea}".
      
      Tu tarea es estructurar este proyecto seleccionando opciones de mis listas predefinidas.
      
      LISTAS VALIDAS (Debes elegir EXACTAMENTE una de estas opciones):
      - TIPOS: "Desarrollo Web", "Desarrollo Móvil", "Desarrollo Desktop", "DevOps", "Data Science", "Inteligencia Artificial", "Otro"
      - TAMAÑOS: "Pequeño (1-3 meses)", "Mediano (3-6 meses)", "Grande (6-12 meses)", "Muy Grande (+12 meses)"
      - COMPLEJIDADES: "Baja", "Media", "Alta", "Muy Alta"
      - METODOLOGIAS: "Scrum", "Kanban", "XP – Extreme Programming", "Cascada"

      Responde SOLAMENTE con un objeto JSON válido con esta estructura:
      {
        "nombre_sugerido": "Nombre corto y profesional",
        "descripcion_tecnica": "Descripción técnica detallada",
        "tipo": "Una opción exacta de la lista TIPOS",
        "complejidad": "Una opción exacta de la lista COMPLEJIDADES",
        "tamano": "Una opción exacta de la lista TAMAÑOS",
        "metodologia_recomendada": "Una opción exacta de la lista METODOLOGIAS",
        "duracion_dias": 90, // Estimación numérica de días totales (integer)
        "justificacion_ia": "Por qué esta metodología",
        "tareas_iniciales": ["Tarea 1", "Tarea 2", "Tarea 3", "Tarea 4", "Tarea 5"]
      }
    `;

    console.log("🧠 Enviando prompt estricto a Gemini...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Limpieza
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const jsonRespuesta = JSON.parse(text);
    
    console.log("✅ IA Respondió:", jsonRespuesta.nombre_sugerido);
    res.json(jsonRespuesta);

  } catch (error: any) {
    console.error("❌ Error IA:", error.message);
    res.status(500).json({ error: "Error al generar con IA", details: error.message });
  }
};