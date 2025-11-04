import React from 'react';

// Una versión simple que reenvía todos los props (como onClick, children)
export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => {
  return (
    <button {...props}>
      {children}
    </button>
  );
};