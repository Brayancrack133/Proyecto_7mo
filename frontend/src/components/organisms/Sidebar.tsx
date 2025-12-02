// src/components/organisms/Sidebar.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// 1. Importamos el icono FileText para documentos
import { Home, FolderKanban, Users, ChevronRight, FileText, LayoutDashboard } from 'lucide-react';
import './sidebar.css'; 

interface OpcionMenu {
  nombre: string;
  ruta: string;
  icon: React.ComponentType<{ size?: string | number; className?: string }>;
}

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 2. Agregamos "Mis Documentos" al array de opciones
  const opciones: OpcionMenu[] = [
    { nombre: 'Inicio', ruta: '/', icon: Home },
    { nombre: 'Proyectos', ruta: '/dashboard-proyecto', icon: LayoutDashboard},
    { nombre: 'Mis Documentos', ruta: '/mis-documentos', icon: FileText }, // <-- NUEVA OPCIÓN
    { nombre: 'Dashboard', ruta: '/dashboard', icon: LayoutDashboard }
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