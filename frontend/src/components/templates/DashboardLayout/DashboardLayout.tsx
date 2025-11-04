import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './DashboardLayout.module.css'; // Importar

export const DashboardLayout: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          Future Plan
        </div>
        <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>
          (Sidebar Simulado)
        </div>
      </div>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};