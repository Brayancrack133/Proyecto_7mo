// Define las estructuras de datos que la API de IA devolverá
export interface UserRecommendation {
  user_id: number;
  match_score: number; // 0.0 a 1.0
  // La explicación (el "por qué"):
  matching_skills: string[]; // ej. ["React", "Node.js"]
  missing_skills: string[];  // ej. ["SQL"]
}
// Define una interfaz para los factores de riesgo
export interface RiskFactor {
  label: string; // ej. "Complejidad de la Tarea"
  value: string; // ej. "Alta"
  level: 'info' | 'warning' | 'danger'; // Para ponerle colores
}

// ANTES:
// export interface RiskPrediction {
//   project_risk_percentage: number; // 0 a 100
// }

// DESPUÉS (Ahora es un objeto más completo):
export interface RiskPrediction {
  project_risk_percentage: number; // 0 a 100
  risk_factors: RiskFactor[]; // La lista de "por qués"
}

export interface MethodologyRecommendation {
  recommended: string;      // ej. "Scrum"
  justification: string;    // ej. "Recomendado para equipos pequeños..."
  alternative: string;      // ej. "Kanban"
  justification_alt: string; // ej. "Si el trabajo es un flujo continuo..."
}