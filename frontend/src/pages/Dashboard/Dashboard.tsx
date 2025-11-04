import React from 'react';
import { Text } from '../../components/atoms/Text';
import { Card } from '../../components/molecules/Card';
import { ProjectRiskWidget } from '../../components/organisms/ProjectRiskWidget';

const Dashboard: React.FC = () => {
  const currentProjectId = "p-123";

  const headerStyle: React.CSSProperties = {
    marginBottom: '32px',
    color: '#0f172a',
    fontSize: '2rem',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const cardTitleStyle: React.CSSProperties = {
    marginTop: 0,
    marginBottom: '20px',
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#1e293b',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  };

  return (
    <>
      <Text as="h1" style={headerStyle}>
        Panel de Control
      </Text>
      <Card>
        <Text as="h3" style={cardTitleStyle}>
          Análisis Predictivo de Riesgo
        </Text>
        <ProjectRiskWidget projectId={currentProjectId} />
      </Card>
    </>
  );
};

export default Dashboard;