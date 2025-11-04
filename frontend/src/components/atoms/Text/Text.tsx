import React from 'react';

// 1. Definimos las props que SÍ conocemos
interface TextProps {
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'span';
  children: React.ReactNode;
  // 2. Opcional: añadimos 'className' para CSS Modules
  className?: string; 
}

// 3. Usamos "React.HTMLAttributes<HTMLElement>" para aceptar
//    automáticamente todos los props estándar de HTML (como 'style')
type Props = TextProps & React.HTMLAttributes<HTMLElement>;

export const Text: React.FC<Props> = ({ 
  as: Component = 'p', 
  children, 
  ...rest // 4. ...rest contendrá 'style' y cualquier otro prop
}) => {
  return (
    // 5. Pasamos esos props al componente
    <Component {...rest}> 
      {children}
    </Component>
  );
};