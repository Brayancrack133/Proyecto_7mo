// No usaremos la instancia 'api' de axios todavía.
// import { api } from './api'; 
import { UserRecommendation, RiskPrediction, MethodologyRecommendation } from '../types/ai.types';
// Función de ayuda para simular un retraso de red
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * SIMULADO: Obtiene las recomendaciones de usuarios para una tarea.
 * (Basado en la sección 5.2 [cite: 323])
 */
export const fetchRecommendations = async (taskId: string): Promise<UserRecommendation[]> => {
  console.log(`[Mock API] Solicitando recomendaciones para la tarea: ${taskId}`);
  await sleep(1000); // Simular 1 segundo de carga

  // Devolver datos falsos que coinciden con la interfaz [cite: 315]
  return [
    { 
      user_id: 101, 
      match_score: 0.95,
      matching_skills: ["React", "Node.js", "SQL"],
      missing_skills: ["Docker"]
    },
    { 
      user_id: 105, 
      match_score: 0.72,
      matching_skills: ["React", "SQL"],
      missing_skills: ["Node.js", "Docker"]
    },
    { 
      user_id: 102, 
      match_score: 0.61,
      matching_skills: ["Node.js"],
      missing_skills: ["React", "SQL", "Docker"]
    },
  ];
};

/**
 * SIMULADO: Obtiene la predicción de riesgo para un proyecto.
 * (Basado en la sección 5.2 [cite: 325])
 */
export const fetchProjectRisk = async (projectId: string): Promise<RiskPrediction> => {
  console.log(`[Mock API] Solicitando riesgo para el proyecto: ${projectId}`);
  await sleep(1500); // Simular 1.5 segundos de carga

  // Devolver datos falsos que coinciden con la interfaz [cite: 317]
  return {
    project_risk_percentage: 68.0,
    risk_factors: [
      { label: 'Coincidencia de Habilidades (Promedio)', value: 'Baja (45%)', level: 'danger' },
      { label: 'Complejidad de Tareas Restantes', value: 'Alta', level: 'warning' },
      { label: 'Historial de Retrasos del Equipo', value: 'Moderado', level: 'warning' },
      { label: 'Tareas Críticas sin Asignar', value: '2 tareas', level: 'info' },
    ]
  };
};

export const fetchMethodologyRecommendation = async (inputs: any): Promise<MethodologyRecommendation> => {
  console.log(`[Mock API] Solicitando recomendación de metodología...`);
  await sleep(2000); // Simular 2 segundos de análisis

  // Devolver datos falsos que coinciden con la nueva interfaz
  return {
    recommended: 'Scrum',
    justification: 'Basado en la prioridad de velocidad y requisitos cambiantes, Scrum es ideal. Permite la adaptación continua en sprints cortos.',
    alternative: 'Kanban',
    justification_alt: 'Considere Kanban si el trabajo se convierte en un flujo de tareas de soporte y mantenimiento, ya que ofrece más flexibilidad sin sprints fijos.'
  };
};