import React from 'react';
import { Input } from '../atoms/Input';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  icon?: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = (props) => {
  return (
    <div className="mb-4">
      <Input {...props} />
    </div>
  );
};