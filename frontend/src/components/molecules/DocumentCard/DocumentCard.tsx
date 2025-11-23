import React from 'react';
import styles from './DocumentCard.module.css';
import { Document } from '../../../types/document.types';
// En DocumentCard.tsx:
import { Button } from '../../../components/atoms/Button/index'; // Busca '../../atoms/Button/index.ts'
import { Icon } from '../../../components/atoms/Icon/Icon'

interface DocumentCardProps {
  document: Document;
  onDownload: (doc: Document) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ document, onDownload }) => {
  return (
    <div className={styles.card}>
      {/* Título y Descripción (Resolución de la Dirección Ejecutiva...) */}
      <h3 className={styles.title}>{document.title}</h3>
      <p className={styles.description}>{document.description.substring(0, 100)}...</p>
      
      {/* Metadatos (Fecha) */}
      <div className={styles.meta}>
        <p>Entregado el: {new Date(document.uploadedAt).toLocaleDateString()}</p>
        <p>Versión: **v{document.version}**</p>
      </div>

      {/* Botón de Descarga (Descargar X archivo) */}
      <div className={styles.actions}>
        <button className={styles.downloadButton} onClick={() => onDownload(document)}>
          <Icon name="download" size={16} /> 
          Descargar **{document.downloadCount}** archivos
        </button>
      </div>
    </div>
  );
};