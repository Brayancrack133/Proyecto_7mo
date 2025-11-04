import React from 'react';
import styles from './Alert.module.css';

interface AlertProps {
  type: 'error' | 'success'; // Solo implementamos 'error' por ahora
  children: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({ type, children }) => {
  return (
    <div className={`${styles.alert} ${styles[type]}`} role="alert">
      {children}
    </div>
  );
};