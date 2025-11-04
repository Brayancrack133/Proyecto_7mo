import React from 'react';
import styles from './Spinner.module.css'; // Importar el CSS

export const Spinner: React.FC = () => {
  return (
    <div className={styles.container} role="status">
      <div className={styles.spinner}></div>
      <span className={styles.text}>Cargando...</span>
    </div>
  );
};