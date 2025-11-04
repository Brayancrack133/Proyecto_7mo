import React from 'react';
import { useFetch } from '../../../hooks/useFetch';
import { fetchProjectRisk } from '../../../services/ai.service';
import { RiskPrediction, RiskFactor } from '../../../types/ai.types';
import { Spinner } from '../../atoms/Spinner';
import { Alert } from '../../molecules/Alert';
import { Text } from '../../atoms/Text';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';

// Componente hijo: Factor de Riesgo (MEJORADO)
const FactorItem: React.FC<{ factor: RiskFactor }> = ({ factor }) => {
  const colors = {
    danger: '#dc2626',
    warning: '#f59e0b',
    info: '#3b82f6'
  };
  const bgColors = {
    danger: '#fee2e2',
    warning: '#fef3c7',
    info: '#dbeafe'
  };

  const itemStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 16px',
    marginBottom: '10px',
    borderRadius: '10px',
    background: bgColors[factor.level],
    border: `2px solid ${colors[factor.level]}20`,
    transition: 'all 0.2s ease'
  };
  const labelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '0.9rem',
    color: '#1e293b',
    fontWeight: '500'
  };
  const valueStyle: React.CSSProperties = {
    fontWeight: '700',
    color: colors[factor.level],
    fontSize: '0.95rem',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  };

  return (
    <div style={itemStyle}>
      <div style={labelStyle}>
        <Text as="span">{factor.label}</Text>
      </div>
      <div style={valueStyle}>
        {factor.value}
      </div>
    </div>
  );
};

// Componente hijo: Medidor (MEJORADO)
const GaugeChart: React.FC<{ percentage: number }> = ({ percentage }) => {
  const dataPoints = [
    { name: 'Riesgo', value: percentage },
    { name: 'Seguridad', value: 100 - percentage },
  ];
  const getRiskColor = (p: number) => {
    if (p > 75) return '#dc2626';
    if (p > 50) return '#f59e0b';
    return '#10b981';
  };
  const getRiskLabel = (p: number) => {
    if (p > 75) return 'Alto';
    if (p > 50) return 'Medio';
    return 'Bajo';
  };
  const riskColor = getRiskColor(percentage);
  const riskLabel = getRiskLabel(percentage);
  const containerStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '20px 0'
  };
  const labelContainerStyle: React.CSSProperties = {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px'
  };
  const riskBadgeStyle: React.CSSProperties = {
    background: riskColor,
    color: '#ffffff',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    boxShadow: `0 4px 8px ${riskColor}40`
  };

  return (
    <div style={containerStyle}>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={dataPoints} dataKey="value" cx="50%" cy="60%"
            startAngle={180} endAngle={0}
            innerRadius={70} outerRadius={100} paddingAngle={2}
          >
            <Cell key="cell-0" fill={riskColor} />
            <Cell key="cell-1" fill="#e5e7eb" />
          </Pie>
          <Label
            value={`${Math.round(percentage)}%`}
            position="center" dy={-20}
            style={{ fontSize: '32px', fontWeight: 'bold', fill: riskColor }}
          />
          <Label
            value="de Riesgo"
            position="center" dy={10}
            style={{ fontSize: '14px', fill: '#64748b', fontWeight: '500' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div style={labelContainerStyle}>
        <span style={{ fontSize: '1.1rem', color: '#64748b', fontWeight: '600' }}>
          Nivel de Riesgo:
        </span>
        <span style={riskBadgeStyle}>
          {riskLabel}
        </span>
      </div>
    </div>
  );
};

// Organismo Principal (MEJORADO)
interface ProjectRiskWidgetProps {
  projectId: string;
}
export const ProjectRiskWidget: React.FC<ProjectRiskWidgetProps> = ({ projectId }) => {
  const { data, isLoading, error } = useFetch<RiskPrediction>(
    () => fetchProjectRisk(projectId),
    [projectId]
  );
  const headerStyle: React.CSSProperties = {
    marginTop: '28px',
    marginBottom: '16px',
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    paddingBottom: '12px',
    borderBottom: '2px solid #e5e7eb'
  };

  if (isLoading) return <Spinner />;
  if (error) return <Alert type="error">Error al cargar el riesgo del proyecto.</Alert>;
  if (!data) return null;

  return (
    <div>
      <GaugeChart percentage={data.project_risk_percentage} />
      <div style={headerStyle}>
        <Text as="span">Factores Clave del Riesgo</Text>
      </div>
      <div>
        {data.risk_factors.map((factor) => (
          <FactorItem key={factor.label} factor={factor} />
        ))}
      </div>
    </div>
  );
};