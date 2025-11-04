import React from 'react';
import { Modal } from '../../molecules/Modal';
import { Spinner } from '../../atoms/Spinner';
import { Alert } from '../../molecules/Alert';
import { useFetch } from '../../../hooks/useFetch';
import { fetchRecommendations } from '../../../services/ai.service';
import { UserRecommendation } from '../../../types/ai.types';
import { Text } from '../../atoms/Text';

// Componente hijo: Badge de Habilidad (MEJORADO)
const SkillBadge: React.FC<{ skill: string, type: 'match' | 'miss' }> = ({ skill, type }) => {
  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 14px',
    margin: '4px',
    borderRadius: '16px',
    fontSize: '0.8rem',
    fontWeight: '600',
    background: type === 'match'
      ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)'
      : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
    color: type === 'match' ? '#166534' : '#991b1b',
    border: `1.5px solid ${type === 'match' ? '#86efac' : '#fca5a5'}`,
    transition: 'all 0.2s ease',
    cursor: 'default'
  };

  const iconStyle: React.CSSProperties = {
    marginRight: '4px',
    fontSize: '0.9rem',
    fontWeight: 'bold' // Añadido para que se vean
  };

  return (
    <span style={style}>
      <span style={iconStyle}>{type === 'match' ? '✓' : '✗'}</span>
      {skill}
    </span>
  );
};

// Componente hijo: Item de la lista (MEJORADO)
const RecommendationItem: React.FC<{ rec: UserRecommendation, index: number }> = ({ rec, index }) => {
  const containerStyle: React.CSSProperties = {
    padding: '20px',
    borderBottom: '1px solid #f1f5f9', // Borde normal para todos, excepto el "mejor match"
    background: index === 0 ? 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' : 'transparent',
    borderRadius: index === 0 ? '12px' : '0',
    marginBottom: index === 0 ? '12px' : '0',
    border: index === 0 ? '2px solid #93c5fd' : 'none',
  };
  
  // Si es index 0, le quitamos el borde inferior
  if (index === 0) {
    containerStyle.borderBottom = 'none';
  }

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px'
  };
  const userIdStyle: React.CSSProperties = {
    fontWeight: '700',
    fontSize: '1.05rem',
    color: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  // --- 1. TU NUEVO ESTILO PARA EL BADGE ---
  const badgeStyle: React.CSSProperties = {
    background: '#10b981',
    color: '#ffffff',
    padding: '8px 14px', // Un poco más de padding vertical
    borderRadius: '6px',  // <-- ¡AQUÍ ESTÁ TU CAMBIO! (Menos suave)
    fontSize: '0.9rem',   // Letra un poco más grande
    fontWeight: '700',
    textTransform: 'uppercase' as const
  };

  // 2. Estilo para el porcentaje normal (no el mejor match)
  const matchScoreStyle: React.CSSProperties = {
    fontWeight: '700',
    // Colores para 72% (azul) y 61% (naranja)
    color: rec.match_score > 0.7 ? '#3b82f6' : '#f59e0b', 
    fontSize: '1.2rem'
  };

  const sectionStyle: React.CSSProperties = {
    marginTop: '12px'
  };
  const labelStyle: React.CSSProperties = {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#64748b',
    marginBottom: '6px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px'
  };

  return (
    <li style={containerStyle}>
      <div style={headerStyle}>
        <Text as="span" style={userIdStyle}>
          Usuario ID: {rec.user_id}
        </Text>
        
        {/* --- 3. LÓGICA COMBINADA --- */}
        {index === 0 ? (
          // Si es el "Mejor Match", muestra el Badge rectangular con el % dentro
          <span style={badgeStyle}>
            Mejor Match ({Math.round(rec.match_score * 100)}%)
          </span>
        ) : (
          // Si no, muestra solo el porcentaje
          <span style={matchScoreStyle}>
            {Math.round(rec.match_score * 100)}%
          </span>
        )}
        {/* --- FIN DE LA LÓGICA COMBINADA --- */}
        
      </div>
      {rec.matching_skills.length > 0 && (
        <div style={sectionStyle}>
          <div style={labelStyle}>Habilidades Coincidentes</div>
          <div>
            {rec.matching_skills.map(skill => <SkillBadge key={skill} skill={skill} type="match" />)}
          </div>
        </div>
      )}

      {rec.missing_skills.length > 0 && (
        <div style={sectionStyle}>
          <div style={labelStyle}>Habilidades Faltantes</div>
          <div>
            {rec.missing_skills.map(skill => <SkillBadge key={skill} skill={skill} type="miss" />)}
          </div>
        </div>
      )}
    </li>
  );
};

// Organismo Principal (MEJORADO)
interface UserRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string | null;
}
export const UserRecommendationModal: React.FC<UserRecommendationModalProps> = ({ isOpen, onClose, taskId }) => {
  const { data: recommendations, isLoading, error } = useFetch<UserRecommendation[]>(
    isOpen && taskId ? () => fetchRecommendations(taskId) : null,
    [taskId, isOpen]
  );
  const infoBoxStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
    padding: '16px',
    borderRadius: '10px',
    fontSize: '0.85rem',
    color: '#0c4a6e',
    marginBottom: '20px',
    border: '1px solid #bae6fd',
    display: 'flex',
    alignItems: 'start',
    gap: '12px'
  };
  const listStyle: React.CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: 0
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Usuarios Recomendados">
      {isLoading && <Spinner />}
      {error && <Alert type="error">Error al cargar recomendaciones.</Alert>}
      {recommendations && recommendations.length > 0 && (
        <>
          <div style={infoBoxStyle}>
            <div>
              <strong>Leyenda:</strong> Las habilidades con <span style={{ background: '#dcfce7', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>✓ verde</span> coinciden.
              Las habilidades con <span style={{ background: '#fee2e2', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>✗ rojo</span> están ausentes.
            </div>
          </div>
          <ul style={listStyle}>
            {recommendations.map((rec, index) => <RecommendationItem key={rec.user_id} rec={rec} index={index} />)}
          </ul>
        </>
      )}
      {recommendations && recommendations.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
          <p style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px' }}>No se encontraron recomendaciones</p>
          <p style={{ fontSize: '0.9rem' }}>Intenta ajustar los requisitos de la tarea.</p>
        </div>
      )}
    </Modal>
  );
};