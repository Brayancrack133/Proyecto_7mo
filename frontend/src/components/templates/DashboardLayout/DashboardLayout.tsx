import React from 'react';
import { Header } from '../../organisms/Header/Header'; // Asumiendo que Header existe
import { Sidebar } from '../../templates/DashboardLayout/Sidebar/Sidebar'; // Asumiendo que Sidebar existe

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  // NOTA: Este es un esqueleto simple. Necesitarás CSS (ej: grid/flex)
  // para posicionar correctamente el Sidebar y el Contenido.
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      
      {/* 1. Barra superior (Header en tus diseños) */}
      <Header /> 
      
      {/* 2. Contenido Principal y Sidebar */}
      <div style={{ display: 'flex', flexGrow: 1 }}>
        
        {/* Sidebar con las opciones de navegación (Proyectos, Repositorio, IA, etc.) */}
        <Sidebar /> 

        {/* 3. Área de Contenido (Donde se renderiza Repository.tsx) */}
        <main style={{ flexGrow: 1, padding: '20px' }}>
          {children}
        </main>
      </div>
    </div>
  );
};