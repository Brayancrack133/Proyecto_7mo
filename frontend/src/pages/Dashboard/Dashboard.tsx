import React from 'react';
import { Text } from '../../components/atoms/Text';
import { Card } from '../../components/molecules/Card';
// 1. Importamos el NUEVO Widget que ya tiene el medidor Y los factores
import { ProjectRiskWidget } from '../../components/organisms/ProjectRiskWidget';

// 2. Ya NO necesitamos 'ProjectRiskGauge' ni 'RiskFactor' aquí

const Dashboard: React.FC = () => {
  const currentProjectId = "p-123"; 

  return (
    <> 
      <Text as="h1">Panel de Control</Text>

      <Card>
        <Text as="h3">Riesgo del Proyecto</Text>
        
        {/* 3. Este es el único componente que necesitas.
             Toda la lógica (useFetch, el medidor, y la lista de factores)
             ya está DENTRO de ProjectRiskWidget.
        */}
        <ProjectRiskWidget projectId={currentProjectId} />
        
      </Card>
    </> 
  );
};

export default Dashboard;
