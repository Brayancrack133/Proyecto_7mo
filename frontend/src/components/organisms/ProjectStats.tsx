import React from 'react';
import { StatCard } from '../molecules/StatCard';
import { Grid, Users, TrendingUp, Calendar } from 'lucide-react';

interface ProjectStatsProps {
  misProyectos: number;
  colaborador: number;
  activos: number;
  finalizados: number;
}

export const ProjectStats: React.FC<ProjectStatsProps> = ({
  misProyectos,
  colaborador,
  activos,
  finalizados
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Mis Proyectos"
        value={misProyectos}
        icon={<Grid className="w-5 h-5" />}
        color="blue"
      />
      <StatCard
        title="Como Colaborador"
        value={colaborador}
        icon={<Users className="w-5 h-5" />}
        color="purple"
      />
      <StatCard
        title="Activos"
        value={activos}
        icon={<TrendingUp className="w-5 h-5" />}
        color="green"
      />
      <StatCard
        title="Finalizados"
        value={finalizados}
        icon={<Calendar className="w-5 h-5" />}
        color="gray"
      />
    </div>
  );
};