import React from 'react';
import { Modal } from '../../molecules/Modal';
import { Spinner } from '../../atoms/Spinner';
import { Alert } from '../../molecules/Alert';
import { useFetch } from '../../../hooks/useFetch';
import { fetchRecommendations } from '../../../services/ai.service';
import { UserRecommendation } from '../../../types/ai.types';
import { Text } from '../../atoms/Text'; // Importar Text

// (Opcional) Un componente de "Badge" para las habilidades
const SkillBadge: React.FC<{ skill: string, type: 'match' | 'miss' }> = ({ skill, type }) => {
  const style = {
    display: 'inline-block',
    padding: '2px 8px',
    margin: '2px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    background: type === 'match' ? '#dcfce7' : '#fee2e2', // Verde o Rojo
    color: type === 'match' ? '#166534' : '#991b1b', // Verde o Rojo
  };
  return <span style={style}>{skill}</span>;
};


// --- ESTE ES EL COMPONENTE ACTUALIZADO CON LA EXPLICACIÓN ---
const RecommendationItem: React.FC<{ rec: UserRecommendation }> = ({ rec }) => {

  return (
    <li style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>

      {/* Fila 1: Puntuación */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <Text as="span" style={{ fontWeight: 'bold' }}>Usuario ID: {rec.user_id}</Text>
        <span style={{ fontWeight: 'bold', color: '#007bff', fontSize: '1.1rem' }}>
          {Math.round(rec.match_score * 100)}% de Coincidencia
        </span>
      </div>

      {/* Fila 2: Explicación (las habilidades) */}
      <div>
        {rec.matching_skills.length > 0 && (
          <div>
            {rec.matching_skills.map(skill => 
              <SkillBadge key={skill} skill={skill} type="match" />
            )}
          </div>
        )}
        {rec.missing_skills.length > 0 && (
          <div style={{ marginTop: '5px' }}>
            {rec.missing_skills.map(skill => 
              <SkillBadge key={skill} skill={skill} type="miss" />
            )}
          </div>
        )}
      </div>
    </li>
  );
};

interface UserRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string | null; 
} 

export const UserRecommendationModal: React.FC<UserRecommendationModalProps> = ({ isOpen, onClose, taskId }) => {

  // Tipar el hook para que 'recommendations' sepa la nueva estructura
  const { data: recommendations, isLoading, error } = useFetch<UserRecommendation[]>(
    isOpen && taskId ? () => fetchRecommendations(taskId) : null,
    [taskId, isOpen]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Usuarios Recomendados (IA)">
      {isLoading && <Spinner />}
      {error && <Alert type="error">Error al cargar recomendaciones.</Alert>}
      {recommendations && recommendations.length > 0 && (
        // Añadimos un título para las habilidades
        <>
          <Text as="p" style={{ fontSize: '0.85rem', color: '#666', marginTop: 0 }}>
            <span style={{ padding: '2px 6px', background: '#dcfce7', borderRadius: '4px', marginRight: '5px' }}>Verde</span> = Habilidad Coincidente. 
            <span style={{ padding: '2px 6px', background: '#fee2e2', borderRadius: '4px', marginLeft: '5px' }}>Rojo</span> = Habilidad Faltante.
          </Text>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
            {recommendations.map(rec => (
              <RecommendationItem key={rec.user_id} rec={rec} />
            ))}
          </ul>
        </>
      )}
      {recommendations && recommendations.length === 0 && (
        <p>No se encontraron recomendaciones adecuadas.</p>
      )}
    </Modal>
  );
};