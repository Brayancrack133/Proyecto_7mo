import React, { useState } from 'react';
import { Text } from '../../components/atoms/Text';
import { Button } from '../../components/atoms/Button';
import { MethodologyAssistantModal } from '../../components/organisms/MethodologyAssistantModal';

const ProjectCreationPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <> {/* Ya no usamos DashboardLayout aquí */}
      <Text as="h1">Crear Nuevo Proyecto</Text>
      <Text as="p">Esta es una página simulada (Módulo de Brayan) para probar el asistente de IA (Módulo de Einard).</Text>

      <hr style={{ margin: '20px 0' }} />

      <Text as="p">En un formulario normal, podrías llenar el nombre. Pero si necesitas ayuda para la metodología:</Text>

      <Button onClick={() => setIsModalOpen(true)}>
        Obtener Recomendación de Metodología (IA)
      </Button>

      {/* El nuevo modal */}
      <MethodologyAssistantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ProjectCreationPage;