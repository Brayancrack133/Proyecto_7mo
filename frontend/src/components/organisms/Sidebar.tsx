// src/components/organisms/Sidebar.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, FolderKanban, Users, ChevronRight } from 'lucide-react';
import './sidebar.css'; // Importa el nuevo CSS

interface OpcionMenu {
  nombre: string;
  ruta: string;
  icon: React.ComponentType<{ size?: string | number; className?: string }>;  // Permite string o number, pero no null
}

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const opciones: OpcionMenu[] = [
    { nombre: 'Inicio', ruta: '/inicio', icon: Home },
    { nombre: 'Dashboard Proyectos', ruta: '/dashboard-proyecto', icon: Users },
    //{ nombre: 'Cascada', ruta: '/cascada', icon: FolderKanban },
    //{ nombre: 'Kanvan', ruta: '/kanvan', icon: FolderKanban },
    //{ nombre: 'Scrum', ruta: '/scrum', icon: FolderKanban },
    //{ nombre: 'XP', ruta: '/xp', icon: FolderKanban },
  ];

  const isActive = (opcion: OpcionMenu): boolean => {
    if (location.pathname === opcion.ruta) return true;
    
    // Mantener iluminado "Proyectos" cuando estás en el detalle
    if (opcion.nombre === 'Proyectos' && location.pathname.includes('/proyecto/')) {
      return true;
    }
    
    return false;
  };

  return (
    <aside className="sidebar">
      {/* Header del Sidebar */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">P</div>
          <div className="logo-text">
            <h2>ProjectHub</h2>
            <span>Gestión de Proyectos</span>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="sidebar-nav">
        {opciones.map((opcion) => {
          const Icon = opcion.icon;
          const active = isActive(opcion);
          
          return (
            <button
              key={opcion.nombre}
              className={`nav-item ${active ? 'active' : ''}`}
              onClick={() => navigate(opcion.ruta)}
              aria-current={active ? 'page' : undefined}
            >
              {/* Indicador lateral para el item activo */}
              <div className="nav-indicator"></div>
              
              {/* Icono */}
              <Icon size={18} className="nav-icon" />
              
              {/* Texto */}
              <span className="nav-text">{opcion.nombre}</span>
              
              {/* Flecha indicadora */}
              <ChevronRight size={14} className="nav-arrow" />
            </button>
          );
        })}
      </nav>

      {/*
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">U</div>
          <div className="user-info">
            <p className="user-name">Usuario</p>
            <p className="user-email">usuario@email.com</p>
          </div>
        </div>
      </div>
      */}
    </aside>
  );
};

export default Sidebar;
