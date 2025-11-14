// frontend/src/components/molecules/MetricCard.tsx

import React from 'react';

// 1. Define las propiedades (Props) del componente usando TypeScript
interface MetricCardProps {
  title: string;
  value: number | string;
  description?: string; // Texto secundario opcional
  icon?: React.ReactNode; // Para pasar un ícono de React (ej: de react-icons)
  isAlert?: boolean; // Para destacar métricas críticas (ej: tareas vencidas)
}

// 2. Componente Funcional
const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  description, 
  icon, 
  isAlert = false 
}) => {
  
  // Estilo básico (deberías usar CSS o Tailwind/Styled-Components)
  const cardStyle: React.CSSProperties = {
    padding: '20px',
    border: isAlert ? '2px solid #dc3545' : '1px solid #e0e0e0', // Rojo si es alerta
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    backgroundColor: isAlert ? '#fff0f3' : '#fff',
    minWidth: '200px',
    flex: 1,
  };

  const valueStyle: React.CSSProperties = {
    fontSize: '2.5em',
    fontWeight: 'bold',
    color: isAlert ? '#dc3545' : '#333',
    margin: '5px 0',
  };

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, fontSize: '1em', color: '#666' }}>{title}</h4>
        {icon}
      </div>
      <div style={valueStyle}>{value}</div>
      {description && <p style={{ margin: 0, fontSize: '0.85em', color: '#888' }}>{description}</p>}
    </div>
  );
};

export default MetricCard;