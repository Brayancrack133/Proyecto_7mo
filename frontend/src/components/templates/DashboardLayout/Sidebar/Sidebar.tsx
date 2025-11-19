// src/components/templates/DashboardLayout/Sidebar/Sidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { Icon } from '../../../atoms/Icon/Icon';

// Definición de las opciones de navegación
const navItems = [
  { name: 'Inicio', path: '/dashboard', icon: 'home' },
  { name: 'Proyectos', path: '/dashboard/proyectos', icon: 'project' },
  { name: 'Planificación', path: '/dashboard/planificacion', icon: 'calendar' },
  { name: 'Colaboración', path: '/dashboard/colaboracion', icon: 'users' },
  { name: 'Repositorio', path: '/dashboard/repositorio', icon: 'repository' },
  { name: 'IA Predictiva', path: '/dashboard/ia', icon: 'robot' },
  { name: 'Panel Analítico', path: '/dashboard/panel', icon: 'chart' },
  { name: 'Configuración', path: '/dashboard/configuracion', icon: 'settings' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              <Icon name={item.icon} size={20} className={styles.icon} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};