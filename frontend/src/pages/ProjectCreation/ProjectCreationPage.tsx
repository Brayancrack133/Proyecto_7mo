import React, { useState } from 'react';
import { Text } from '../../components/atoms/Text';
import { Button } from '../../components/atoms/Button';
import { MethodologyAssistantModal } from '../../components/organisms/MethodologyAssistantModal';

const ProjectCreationPage: React.FC = () => {
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
    background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
    padding: '20px 24px',
    borderRadius: '10px',
    marginBottom: '24px',
    border: '2px solid #a78bfa',
    color: '#5b21b6',
    fontSize: '0.95rem',
    lineHeight: '1.6'
  };

  return (
    <div style={containerStyle}>
      <Text as="h1" style={headerStyle}>
        Crear Nuevo Proyecto
      </Text>
      <Text as="p" style={descriptionStyle}>
        Esta es una página simulada (Módulo de Brayan) para demostrar la integración del Asistente de Metodología con IA (Módulo de Einard).
      </Text>
      <hr style={{ margin: '24px 0', border: 'none', borderTop: '2px solid #e5e7eb' }} />

      <div style={infoBoxStyle}>
        <strong style={{ display: 'block', marginBottom: '8px', fontSize: '1.05rem' }}>
          ¿No estás seguro qué metodología usar?
        </strong>
        En un formulario completo, ingresarías el nombre del proyecto, descripción, equipo, etc.
        Pero si necesitas ayuda para elegir la metodología adecuada (Scrum, Kanban, Waterfall, etc.),
        nuestro asistente de IA puede recomendarte la mejor opción basándose en las características de tu proyecto.
      </div>

      <Button
        onClick={() => setIsModalOpen(true)}
        style={{ fontSize: '1rem', padding: '14px 28px' }}
      >
        Obtener Recomendación de Metodología (IA)
      </Button>

      <MethodologyAssistantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ProjectCreationPage;