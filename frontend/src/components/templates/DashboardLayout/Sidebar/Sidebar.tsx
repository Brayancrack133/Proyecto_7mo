import React from 'react';
import styles from './Sidebar.module.css';
import { Icon } from '../../../atoms/Icon/Icon'; 
// Podrías importar NavItem o Button si los tienes

// Definición de las opciones de navegación
const navItems = [
  { name: 'Inicio', path: '/dashboard', icon: 'home' },
  { name: 'Proyectos', path: '/proyectos', icon: 'project' },
  { name: 'Planificación', path: '/planificacion', icon: 'calendar' },
  { name: 'Colaboración', path: '/colaboracion', icon: 'users' },
  // Opción activa del módulo que estás desarrollando
  { name: 'Repositorio', path: '/repositorio', icon: 'repository', active: true }, 
  { name: 'IA Predictiva', path: '/ia', icon: 'robot' },
  { name: 'Panel Analítico', path: '/panel', icon: 'chart' },
  { name: 'Configuración', path: '/configuracion', icon: 'settings' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.path}
            className={`${styles.navLink} ${item.active ? styles.active : ''}`}
          >
            <Icon name={item.icon} size={20} className={styles.icon} />
            {item.name}
          </a>
        ))}
      </nav>
    </aside>
  );
};