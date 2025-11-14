import React from 'react';
import styles from './Modal.module.css';
import { Icon } from '../../atoms/Icon/Icon'; // Para el botón de cerrar

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) {
    return null;
  }

  // Usamos un portal en un proyecto real, pero para el esqueleto, lo renderizamos directamente
  return (
    <div className={styles.overlay} onClick={onClose}>
      {/* Detenemos la propagación del clic para que no cierre el modal si se hace clic dentro */}
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        
        <header className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <Icon name="close" size={24} />
          </button>
        </header>
        
        <div className={styles.body}>
          {children}
        </div>

      </div>
    </div>
  );
};