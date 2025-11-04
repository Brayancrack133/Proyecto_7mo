import React, { useState } from 'react';
import { Button } from '../../components/atoms/Button';
import { Text } from '../../components/atoms/Text';
import { UserRecommendationModal } from '../../components/organisms/UserRecommendationModal';

const TaskDetail: React.FC = () => {
  const currentTask = { id: "t-456", name: "Implementar login", assignedUser: null };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const containerStyle: React.CSSProperties = {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
  };

  const headerStyle: React.CSSProperties = {
    marginTop: 0,
    marginBottom: '16px',
    fontSize: '1.8rem',
    fontWeight: '800',
    color: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '1rem',
    color: '#64748b',
    lineHeight: '1.6',
    marginBottom: '24px'
  };

  const infoBoxStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    padding: '16px 20px',
    borderRadius: '10px',
    marginBottom: '24px',
    border: '2px solid #fbbf24',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#92400e',
    fontWeight: '600'
  };

  return (
    <div style={containerStyle}>
      <Text as="h2" style={headerStyle}>
        Detalle de Tarea: {currentTask.name}
      </Text>
      <Text as="p" style={descriptionStyle}>
        Esta es una página de demostración para el módulo de Recomendación de Usuarios con IA (Sprint 3).
      </Text>
      <hr style={{ margin: '24px 0', border: 'none', borderTop: '2px solid #e5e7eb' }} />

      {!currentTask.assignedUser && (
        <>
          <div style={infoBoxStyle}>
            <span>Esta tarea no tiene un usuario asignado. Usa la IA para obtener recomendaciones.</span>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            style={{ fontSize: '1rem', padding: '14px 28px' }}
          >
            Recomendar Usuario con IA
          </Button>
        </>
      )}

      <UserRecommendationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        taskId={currentTask.id}
      />
    </div>
  );
};

export default TaskDetail;