// src/components/organisms/ProjectCardsView/ProjectCardsView.tsx
import React from 'react';
import { ProjectCard } from '../../molecules/ProjectCard/ProjectCard';

interface Project {
  id_proyecto: number;
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado_actual?: string;
  progreso?: number;
  miembros?: number;
  carpetas?: number;
  nombre_jefe?: string;
}

interface ProjectCardsViewProps {
  projects: Project[];
  onProjectClick?: (project: Project) => void;
}

export const ProjectCardsView: React.FC<ProjectCardsViewProps> = ({ 
  projects,
  onProjectClick 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id_proyecto}
          id={project.id_proyecto}
          nombre={project.nombre}
          descripcion={project.descripcion}
          fecha_inicio={project.fecha_inicio}
          fecha_fin={project.fecha_fin || project.fecha_inicio}
          progreso={project.progreso || 0}
          estado={project.estado_actual || 'Activo'}
          miembros={project.miembros || 3}
          carpetas={project.carpetas || 2}
          responsable={project.nombre_jefe}
          onClick={() => onProjectClick?.(project)}
        />
      ))}
    </div>
  );
};