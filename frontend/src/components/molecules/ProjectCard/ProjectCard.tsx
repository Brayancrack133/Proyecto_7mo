// src/components/molecules/ProjectCard/ProjectCard.tsx
import React from 'react';
import { Calendar, Users, MoreVertical } from 'lucide-react';
import { Badge } from '../../atoms/Badge/Badge';

interface ProjectCardProps {
  id: number;
  nombre: string;
  descripcion?: string;
  fecha_inicio: string;
  fecha_fin: string;
  progreso: number;
  estado: string;
  miembros: number;
  carpetas: number;
  responsable?: string;
  onClick?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  nombre,
  descripcion,
  fecha_inicio,
  fecha_fin,
  progreso,
  estado,
  miembros,
  carpetas,
  responsable,
  onClick
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-BO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getProgressColor = () => {
    if (progreso >= 75) return 'bg-green-500';
    if (progreso >= 50) return 'bg-blue-500';
    if (progreso >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStatusVariant = () => {
    const map: Record<string, any> = {
      'Activo': 'success',
      'Proactivo': 'info',
      'Proyectado': 'warning'
    };
    return map[estado] || 'info';
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-blue-500 p-6 cursor-pointer"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 mb-1">{nombre}</h3>
          <Badge variant={getStatusVariant()}>{estado}</Badge>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Responsable */}
      {responsable && (
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-700">
            {responsable.charAt(0)}
          </div>
          <span className="text-sm text-gray-600">{responsable}</span>
        </div>
      )}

      {/* Fechas */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Calendar className="w-4 h-4" />
        <span>{formatDate(fecha_inicio)} — {formatDate(fecha_fin)}</span>
      </div>

      {/* Miembros del equipo */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Users className="w-4 h-4" />
        <span>{miembros} miembros del equipo</span>
      </div>

      {/* Barra de progreso */}
      <div className="mb-2">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Progreso</span>
          <span className="font-semibold text-gray-800">{progreso}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${getProgressColor()}`}
            style={{ width: `${progreso}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t">
        <div className="flex items-center gap-2">
          <span className="text-sm text-green-600 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Activo
          </span>
        </div>
        <span className="text-xs text-gray-500">{carpetas} carpetas</span>
      </div>
    </div>
  );
};