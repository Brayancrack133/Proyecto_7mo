import React, { useState } from 'react';
// Tus importaciones
import { Button } from '../../components/atoms/Button';
import { Text } from '../../components/atoms/Text';
import { UserRecommendationModal } from '../../components/organisms/UserRecommendationModal';

const TaskDetail: React.FC = () => {
  const currentTask = { id: "t-456", name: "Implementar login", assignedUser: null };
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <> {/* <-- ANTES: <DashboardLayout>, AHORA: Fragmento vacío */}
      <Text as="h2">Detalle de Tarea: {currentTask.name}</Text>
      <Text as="p">Esta es una página de prueba para el modal del Sprint 3.</Text>

      <hr style={{ margin: '20px 0' }} />

      {!currentTask.assignedUser && (
        <Button onClick={() => setIsModalOpen(true)}>
          Recomendar Usuario (IA)
        </Button>
      )}

      <UserRecommendationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        taskId={currentTask.id}
      />
    </> /* <-- FIN DEL FRAGMENTO */
  );
};

export default TaskDetail;