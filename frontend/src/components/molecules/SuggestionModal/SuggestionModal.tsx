import React from 'react';
// Esta importación funcionará en tu proyecto de VS Code
import styles from './SuggestionModal.module.css';

// Definimos los tipos para la data que recibirá el modal
interface RecommendationData {
  suggestedUserName: string;
  justification: string;
  confidence: number;
}

interface SuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: () => void; // Función para aceptar la sugerencia
  recommendation: RecommendationData;
}

/**
 * Este es el componente visual principal de tu Sprint 3.
 * Es un modal reutilizable que muestra la recomendación de la IA.
 */
export const SuggestionModal: React.FC<SuggestionModalProps> = ({ 
  isOpen, 
  onClose, 
  onSelect,
  recommendation 
}) => {
  if (!isOpen) {
    return null;
  }

  // Calcula el porcentaje de confianza
  const confidencePercent = (recommendation.confidence * 100).toFixed(0);

  return (
    // Fondo oscuro semitransparente
    <div className={styles.modalOverlay} onClick={onClose}>
      
      {/* Contenido del Modal */}
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        
        {/* Botón de Cerrar */}
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>

        {/* Encabezado */}
        <div className={styles.header}>
          <span className={styles.icon}>✨</span>
          <h3>Sugerencia de la IA</h3>
        </div>

        {/* Cuerpo del Modal */}
        <div className={styles.body}>
          <p className={styles.recommendationText}>
            Recomendamos asignar esta tarea a:
          </p>
          <div className={styles.userName}>
            {recommendation.suggestedUserName}
          </div>
          
          <p className={styles.justificationTitle}>
            <strong>Justificación:</strong>
          </p>
          <p className={styles.justificationText}>
            "{recommendation.justification}"
          </p>
          
          <div className={styles.confidence}>
            <strong>Nivel de Confianza:</strong>
            <div className={styles.confidenceBar}>
              <div 
                className={styles.confidenceFill}
                style={{ width: `${confidencePercent}%` }}
              >
                {confidencePercent}%
              </div>
            </div>
          </div>
        </div>

        {/* Pie del Modal (Acciones) */}
        <div className={styles.footer}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancelar
          </button>
          <button className={styles.selectButton} onClick={onSelect}>
            Asignar a este usuario
          </button>
        </div>

      </div>
    </div>
  );
};

