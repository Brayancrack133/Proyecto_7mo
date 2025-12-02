import React from 'react';
import Header from '../../organisms/Head';
import { Sidebar } from './Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
import ChatFlotante from '../../organisms/ChatFlotante';

export const DashboardLayout: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Header />
      <div style={{ display: 'flex', flexGrow: 1 }}>
        <Sidebar />
        <main style={{ flexGrow: 1, padding: '20px' }}>
          <Outlet />   {/* 👈 AQUI se renderizan tus páginas */}
        </main>
      </div>
      <ChatFlotante />
    </div>
  );
};
