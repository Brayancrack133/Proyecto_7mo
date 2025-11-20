// src/components/molecules/EmptyState/EmptyState.tsx
import React from 'react';
import { FolderOpen } from 'lucide-react';
import { Button } from '../../atoms/Button/Button';

interface EmptyStateProps {
  onCreateClick: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateClick }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-lg shadow-sm p-12">
      {/* Icono grande */}
      <div className="w-24 h-24 mb-6 text-gray-300">
        <FolderOpen className="w-full h-full" strokeWidth={1.5} />
      </div>

      {/* Mensaje */}
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        No hay proyectos aún
      </h3>
      <p className="text-gray-500 text-center max-w-md mb-6">
        Comienza creando tu primer proyecto para organizar y planificar tu trabajo
      </p>

      {/* Botón */}
      <Button 
        onClick={onCreateClick}
        variant="primary"
        size="lg"
      >
        Crear Primer Proyecto
      </Button>
    </div>
  );
};