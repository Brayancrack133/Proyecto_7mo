import React, { useState } from 'react';
import { Modal } from '../../molecules/Modal';
import { Button } from '../../atoms/Button';
import { Spinner } from '../../atoms/Spinner';
import { Text } from '../../atoms/Text';
import { useFetch } from '../../../hooks/useFetch';
import { Alert } from '../../molecules/Alert';
import { fetchMethodologyRecommendation } from '../../../services/ai.service';
import { MethodologyRecommendation } from '../../../types/ai.types';

// (Opcional) Estilos para el formulario
const styles = {
  formGroup: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '8px', fontWeight: 'bold' },
  select: { width: '100%', padding: '10px', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' },
  resultsBox: { background: '#f4f7f6', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px', marginTop: '20px' },
  recTitle: { color: '#007bff', margin: '0 0 10px 0' }
};

interface MethodologyAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Estado inicial del formulario
const initialFormState = {
  reqClarity: 'cambiantes',
  teamSize: 'pequeño',
  priority: 'velocidad',
  workFlow: 'proyecto'
};

export const MethodologyAssistantModal: React.FC<MethodologyAssistantModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [startFetch, setStartFetch] = useState(false); // Para controlar cuándo se activa el useFetch

  // El hook useFetch solo se activa cuando startFetch es true
  // --- CAMBIO B: Se añade el tipo <MethodologyRecommendation> ---
  const { data, isLoading, error } = useFetch<MethodologyRecommendation>(
    startFetch ? () => fetchMethodologyRecommendation(formData) : null,
    [startFetch]
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    setStartFetch(true); // Inicia la llamada a la API
  };

  const handleClose = () => {
    // Resetea todo al cerrar
    setFormData(initialFormState);
    setStartFetch(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Asistente de Metodología (IA)">

      {/* Si no se ha enviado el formulario Y NO HAY ERROR, muestra las preguntas */}
      {!data && !isLoading && !error && (
        <div>
          <Text as="p">Responde estas preguntas clave sobre tu proyecto para obtener una recomendación.</Text>

          <div style={styles.formGroup}>
            <label style={styles.label}>¿Cómo son los requisitos?</label>
            <select style={styles.select} name="reqClarity" value={formData.reqClarity} onChange={handleChange}>
              <option value="cambiantes">Cambiantes o Inciertos</option>
              <option value="fijos">Claros y Fijos</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>¿Tamaño del equipo?</label>
            <select style={styles.select} name="teamSize" value={formData.teamSize} onChange={handleChange}>
              <option value="pequeño">Pequeño (1-9 personas)</option>
              <option value="grande">Grande (10+ personas)</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>¿Prioridad principal?</label>
            <select style={styles.select} name="priority" value={formData.priority} onChange={handleChange}>
              <option value="velocidad">Velocidad y Flexibilidad</option>
              <option value="predictibilidad">Predictibilidad y Presupuesto Fijo</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>¿Naturaleza del trabajo?</label>
            <select style={styles.select} name="workFlow" value={formData.workFlow} onChange={handleChange}>
              <option value="proyecto">Proyecto (con inicio y fin)</option>
              <option value="flujo">Flujo Continuo (soporte, tareas)</option>
            </select>
          </div>

          <Button onClick={handleSubmit}>Analizar (IA)</Button>
        </div>
      )}

      {/* Si está cargando, muestra el spinner */}
      {isLoading && <Spinner />}

      {/* --- CAMBIO C: Se añade el bloque para mostrar el error --- */}
      {error && (
        <Alert type="error">
          Hubo un error al cargar la recomendación. Intenta de nuevo.
        </Alert>
      )}
      {/* -------------------------------------------------------- */}

      {/* Si ya hay datos (respuesta) Y NO HAY ERROR, muestra los resultados */}
      {data && !isLoading && !error && (
        <div style={styles.resultsBox}>
          <Text as="h3" style={styles.recTitle}>Recomendación: {data.recommended}</Text>
          <Text as="p">{data.justification}</Text>
          <hr />
          <Text as="h3">Alternativa: {data.alternative}</Text>
          <Text as="p">{data.justification_alt}</Text>
        </div>
      )}
    </Modal>
  );
};