import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input = ({ label, ...props }: InputProps) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '8px', 
      marginBottom: '16px',
      width: '100%' // Asegura que ocupe el ancho disponible
    }}>
      
      {/* Etiqueta del input */}
      <label style={{ 
        fontWeight: '600', 
        fontSize: '14px', 
        color: '#374151', // Gris oscuro profesional
        marginLeft: '4px'
      }}>
        {label}
      </label>

      {/* El campo de texto */}
      <input 
        {...props} // Aquí pasamos todas las props (placeholder, value, etc.) automáticamente
        style={{
          padding: '12px 16px',
          border: '1px solid #E5E7EB', // Borde gris suave
          borderRadius: '8px', // Bordes redondeados modernos
          fontSize: '14px',
          outline: 'none',
          width: '100%',
          boxSizing: 'border-box',
          backgroundColor: '#fff',
          color: '#1F2937',
          transition: 'border-color 0.2s'
        }}
        // Añadimos un pequeño efecto al hacer foco (opcional, se puede hacer con CSS puro también)
        onFocus={(e) => e.target.style.borderColor = '#dd9d52'} // Naranja de tu marca
        onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
      />
    </div>
  );
};