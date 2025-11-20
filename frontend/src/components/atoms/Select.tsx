import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
}

export const Select = ({ label, options, ...props }: SelectProps) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', flex: 1 }}>
      <label style={{ fontWeight: '600', fontSize: '14px', color: '#374151' }}>{label}</label>
      <select 
        {...props}
        style={{
          padding: '10px 16px',
          border: '1px solid #E5E7EB',
          borderRadius: '8px',
          fontSize: '14px',
          backgroundColor: 'white',
          width: '100%',
          cursor: 'pointer'
        }}
      >
        <option value="">Seleccionar {label.toLowerCase()}...</option>
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
};