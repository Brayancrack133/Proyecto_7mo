import React from 'react';
import { Outlet } from 'react-router-dom'; // <-- 1. IMPORTAR OUTLET

// Esta es una simulación de tu layout principal.
export const DashboardLayout: React.FC = () => { // <-- 2. QUITAR 'children'
  return (
    <div style={{ display: 'flex' }}>
      {/* Simulación de un Sidebar */}
      <div style={{ width: '240px', background: '#f4f4f4', minHeight: '100vh', padding: '20px' }}>
        <em>(Sidebar Simulado)</em>
      </div>
      {/* Contenido principal de la página */}
      <main style={{ flex: 1, padding: '20px' }}>
        <Outlet /> {/* <-- 3. USAR 'Outlet' EN LUGAR DE 'children' */}
      </main>
    </div>
  );
};