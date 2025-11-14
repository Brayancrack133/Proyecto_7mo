import React from 'react';

// Define las props básicas que podría tener un botón
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger'; 
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  // En un proyecto real, aquí se aplicarían los estilos de Button.module.css
  const baseStyle = { 
    padding: '10px 15px', 
    borderRadius: '4px', 
    cursor: 'pointer',
    border: 'none',
    backgroundColor: variant === 'primary' ? '#1e40af' : (variant === 'danger' ? '#dc2626' : '#9ca3af'),
    color: 'white'
  };

  return (
    <button style={baseStyle} {...props}>
      {children}
    </button>
  );
};