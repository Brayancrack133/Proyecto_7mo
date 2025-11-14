import React from 'react';

// Define las propiedades que puede recibir el componente Input, 
// extendiendo las propiedades nativas de un elemento input HTML.
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Puedes añadir props de estilo aquí si no usas un archivo CSS Module
  className?: string;
}

export const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
  // Estilo base simple para que se vea decente
  const baseStyle: React.CSSProperties = {
    padding: '10px 12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
    width: props.type === 'file' ? 'auto' : '100%',
    boxSizing: 'border-box'
  };

  return (
    <input 
      style={baseStyle} 
      className={className} 
      {...props} 
    />
  );
};