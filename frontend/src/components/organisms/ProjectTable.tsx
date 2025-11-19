import React from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { ProgressBar } from '../molecules/ProgressBar';
import type { Project } from '../../types/project.types'; // ✅ Import correcto

interface ProjectTableProps {
  projects: Project[];
  onView: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  isLoading?: boolean;
}
export const ProjectTable: React.FC<ProjectTableProps> = ({
  projects,
  onView,
  onEdit,
  onDelete,
  isLoading = false
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('es-BO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusVariant = (status?: string) => {
    const statusMap: Record<string, 'success' | 'warning' | 'info' | 'primary'> = {
      'Completado': 'success',
      'En Progreso': 'warning',
      'Planificación': 'info',
      'En Revisión': 'primary',
    };
    return statusMap[status || ''] || 'info';
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando proyectos...</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500 text-lg">No hay proyectos registrados</p>
        <p className="text-gray-400 text-sm mt-2">Crea tu primer proyecto para comenzar</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proyecto</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jefe</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fechas</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progreso</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {projects.map((project) => (
            <tr key={project.id_proyecto} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4">
                <div>
                  <div className="font-medium text-gray-900">{project.nombre}</div>
                  <div className="text-sm text-gray-500 line-clamp-1">{project.descripcion}</div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {project.nombre_jefe
                  ? `${project.nombre_jefe} ${project.apellido_jefe ?? ''}`
                  : 'No asignado'}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                <div>
                  <div>{formatDate(project.fecha_inicio)}</div>
                  <div className="text-gray-500">— {formatDate(project.fecha_fin)}</div>
                </div>
              </td>
              <td className="px-6 py-4">
                <Badge variant={getStatusVariant(project.estado_actual)}>
                  {project.estado_actual || 'Sin estado'}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <ProgressBar progress={project.progreso ?? 0} size="sm" />
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onView(project)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Ver detalles"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(project)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(project)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
