import React from 'react';

// Simulación de una ruta privada
export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  // En un proyecto real, aquí verificarías si el usuario está logueado.
  // Por ahora, solo dejamos pasar.
  return <>{children}</>;
};