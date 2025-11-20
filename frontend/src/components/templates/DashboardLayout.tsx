import React from 'react';
import Sidebar from '../organisms/Sidebar'; // Asegúrate de que la ruta sea correcta
import Header from '../organisms/Header';   // Asegúrate de que la ruta sea correcta

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    // Contenedor Principal: Ocupa toda la pantalla y usa Flexbox
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      
      {/* 1. SIDEBAR: Se queda fijo a la izquierda */}
      {/* Nota: El ancho y estilo ya están definidos dentro del componente Sidebar */}
      <Sidebar />

      {/* 2. COLUMNA DERECHA: Contiene Header + Contenido */}
      <div className="flex flex-col flex-1 w-full">
        
        {/* Header: Va arriba de todo */}
        <Header />

        {/* Main Content: Ocupa el espacio restante y hace scroll si es necesario */}
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
        
      </div>
    </div>
  );
};