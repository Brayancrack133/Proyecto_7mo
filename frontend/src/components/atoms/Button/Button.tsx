import React from 'react';
import styles from './Button.module.css'; // Importar el CSS

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  // Puedes añadir variantes aquí si quieres, ej. variant?: 'primary' | 'secondary'
};

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className, 
  ...props 
}) => {
  // Combina la clase base con cualquier clase externa
  const buttonClasses = `${styles.button} ${className || ''}`;

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};