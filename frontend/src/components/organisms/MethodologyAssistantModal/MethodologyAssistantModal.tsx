import React, { useState } from 'react';
import { Modal } from '../../molecules/Modal';
import { Button } from '../../atoms/Button';
import { Spinner } from '../../atoms/Spinner';
import { Text } from '../../atoms/Text';
import { useFetch } from '../../../hooks/useFetch';
import { Alert } from '../../molecules/Alert';
import { fetchMethodologyRecommendation } from '../../../services/ai.service';
import { MethodologyRecommendation } from '../../../types/ai.types';

// Estilos mejorados
const styles = {
  formGroup: {
    marginBottom: '24px'
  },
  label: {
    display: 'block',
    marginBottom: '10px',
    fontWeight: '700',
    fontSize: '0.9rem',
    color: '#1e293b',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px'
  },
  select: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '0.95rem',
    borderRadius: '10px',
    border: '2px solid #e2e8f0',
    background: '#ffffff',
    color: '#0f172a',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    appearance: 'none' as const,
    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%233b82f6\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 16px center'
  },
  resultsBox: {
    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    border: '2px solid #86efac',
    borderRadius: '12px',
    padding: '24px',
    marginTop: '24px',
    boxShadow: '0 4px 6px rgba(34, 197, 94, 0.1)'
  },
  recommendationCard: {
    background: '#ffffff',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '16px',
    border: '1px solid #d1fae5',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
  },
  recTitle: {
    color: '#16a34a',
    margin: '0 0 12px 0',
    fontSize: '1.3rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  altTitle: {
    color: '#3b82f6',
    margin: '0 0 12px 0',
    fontSize: '1.15rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  justificationText: {
    fontSize: '0.95rem',
    lineHeight: '1.7',
    color: '#374151',
    margin: 0
  },
  introText: {
    fontSize: '0.95rem',
    color: '#64748b',
    lineHeight: '1.6',
    marginBottom: '24px',
    padding: '16px',
    background: '#f8fafc',
    borderRadius: '8px',
    borderLeft: '4px solid #3b82f6'
  }
};

interface MethodologyAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialFormState = {
  reqClarity: 'cambiantes',
  teamSize: 'pequeño',
  priority: 'velocidad',
  workFlow: 'proyecto'
};

export const MethodologyAssistantModal: React.FC<MethodologyAssistantModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [startFetch, setStartFetch] = useState(false);

  const { data, isLoading, error } = useFetch<MethodologyRecommendation>(
    startFetch ? () => fetchMethodologyRecommendation(formData) : null,
    [startFetch]
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => { setStartFetch(true); };

  const handleClose = () => {
    setFormData(initialFormState);
    setStartFetch(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Asistente de Metodología">
      {!data && !isLoading && !error && (
        <div>
          <Text as="p" style={styles.introText}>
            Responde estas preguntas clave sobre tu proyecto para obtener una recomendación de metodología personalizada impulsada por IA.
          </Text>

          <div style={styles.formGroup}>
            <label style={styles.label}>¿Cómo son los requisitos?</label>
            <select
              style={styles.select}
              name="reqClarity"
              value={formData.reqClarity}
              onChange={handleChange}
              onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
            >
              <option value="cambiantes">Cambiantes o Inciertos</option>
              <option value="fijos">Claros y Fijos</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>¿Tamaño del equipo?</label>
            <select
              style={styles.select}
              name="teamSize"
              value={formData.teamSize}
              onChange={handleChange}
              onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
            >
              <option value="pequeño">Pequeño (1-9 personas)</option>
              <option value="grande">Grande (10+ personas)</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>¿Prioridad principal?</label>
            <select
              style={styles.select}
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
            >
              <option value="velocidad">Velocidad y Flexibilidad</option>
              <option value="predictibilidad">Predictibilidad y Presupuesto Fijo</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>¿Naturaleza del trabajo?</label>
            <select
              style={styles.select}
              name="workFlow"
              value={formData.workFlow}
              onChange={handleChange}
              onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
            >
              <option value="proyecto">Proyecto (con inicio y fin)</option>
              <option value="flujo">Flujo Continuo (soporte, tareas)</option>
            </select>
          </div>

          <Button onClick={handleSubmit} style={{ width: '100%', padding: '14px 24px', fontSize: '1rem' }}>
            Analizar con IA
          </Button>
        </div>
      )}

      {isLoading && <Spinner />}
      {error && (<Alert type="error">Hubo un error al cargar la recomendación. Intenta de nuevo.</Alert>)}

      {data && !isLoading && !error && (
        <div style={styles.resultsBox}>
          <div style={styles.recommendationCard}>
            <Text as="h3" style={styles.recTitle}>
              Recomendación Principal: {data.recommended}
            </Text>
            <Text as="p" style={styles.justificationText}>{data.justification}</Text>
          </div>

          <div style={{ ...styles.recommendationCard, background: '#f0f9ff', borderColor: '#bfdbfe' }}>
            <Text as="h3" style={styles.altTitle}>
              Alternativa: {data.alternative}
            </Text>
            <Text as="p" style={styles.justificationText}>{data.justification_alt}</Text>
          </div>
        </div>
      )}
    </Modal>
  );
};