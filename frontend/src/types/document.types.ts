// Define la estructura básica de un Documento
export interface Document {
  id: string;
  projectId: string; // Para agrupar por proyecto
  title: string;
  fileName: string; // Nombre del archivo subido
  description: string;
  category: 'Propuestas' | 'Diseño UX/UI' | 'Documentación Técnica' | 'Otro';
  accessLevel: 'public' | 'restricted' | 'private'; // RF45
  version: number; // RF43
  uploadedBy: string; // Nombre del responsable
  uploadedAt: string; // Fecha y hora de subida
  downloadCount: number;
  
}

// Define la estructura para un Repositorio Externo (GIT)
export interface ExternalRepository {
  id: string;
  name: string;
  type: 'GITHUB' | 'GITLAB' | 'BITBUCKET';
  repoUrl: string;
  lastCommitMessage: string;
  lastSync: string;
}