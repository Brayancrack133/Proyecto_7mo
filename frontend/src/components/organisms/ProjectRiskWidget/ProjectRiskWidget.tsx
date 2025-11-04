import React from 'react';
import { useFetch } from '../../../hooks/useFetch';
import { fetchProjectRisk } from '../../../services/ai.service';
import { RiskPrediction, RiskFactor } from '../../../types/ai.types'; // Importar ambos
import { Spinner } from '../../atoms/Spinner';
import { Alert } from '../../molecules/Alert';
import { Text } from '../../atoms/Text';

// Importar el gráfico (recharts) directamente
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';

// El componente de factor de riesgo (lo movemos aquí)
const FactorItem: React.FC<{ factor: RiskFactor }> = ({ factor }) => {
  const colors = {
    danger: '#b91c1c',
    warning: '#b45309',
    info: '#374151'
  };
  return (
    <li style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
      <Text as="span">{factor.label}:</Text>
      <Text as="span" style={{ fontWeight: 'bold', color: colors[factor.level] }}>
        {factor.value}
      </Text>
    </li>
  );
};

// El componente del medidor (lo movemos aquí)
const GaugeChart: React.FC<{ percentage: number }> = ({ percentage }) => {
  const dataPoints = [
    { name: 'Riesgo', value: percentage },
    { name: 'Seguridad', value: 100 - percentage },
  ];
  const riskColor = percentage > 75 ? '#FF4136' : (percentage > 50 ? '#FF851B' : '#00C49F');

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={dataPoints} dataKey="value" cx="50%" cy="80%" startAngle={180} endAngle={0} innerRadius={70} outerRadius={100} fill="#8884d8" paddingAngle={2}>
          <Cell key="cell-0" fill={riskColor} />
          <Cell key="cell-1" fill="#EAEAEA" />
        </Pie>
        <Label value={`${Math.round(percentage)}%`} position="center" dy={-20} style={{ fontSize: '28px', fontWeight: 'bold', fill: '#333' }} />
        <Label value="Riesgo de Retraso" position="center" dy={10} style={{ fontSize: '14px', fill: '#777' }} />
      </PieChart>
    </ResponsiveContainer>
  );
};


// --- ESTE ES EL NUEVO ORGANISMO COMPLETO ---
interface ProjectRiskWidgetProps {
  projectId: string;
}

export const ProjectRiskWidget: React.FC<ProjectRiskWidgetProps> = ({ projectId }) => {

  const { data, isLoading, error } = useFetch<RiskPrediction>(
    () => fetchProjectRisk(projectId), 
    [projectId]
  );

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <Alert type="error">Error al cargar el riesgo del proyecto.</Alert>;
  }

  if (!data) {
    return null; // No hay datos
  }

  // Si hay datos, mostramos el medidor Y los factores
  return (
    <div>
      {/* 1. El Medidor */}
      <GaugeChart percentage={data.project_risk_percentage} />

      {/* 2. Los Factores (La explicación) */}
      <Text as="h4" style={{ marginTop: '20px' }}>Factores Clave del Riesgo:</Text>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {data.risk_factors.map((factor) => (
          <FactorItem key={factor.label} factor={factor} />
        ))}
      </ul>
    </div>
  );
};