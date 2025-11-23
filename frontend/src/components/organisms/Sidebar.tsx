// src/components/organisms/Sidebar.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); 

  const opciones = [
    { nombre: 'Inicio', ruta: '/' },
    { nombre: 'Proyectos', ruta: '/proyectos' },
    // BORRAMOS LA LÍNEA DE PLANIFICACIÓN PORQUE YA NO ES UN MENÚ DIRECTO
  ];

  // Ajustamos la lógica para que "Proyectos" se quede encendido 
  // cuando estás dentro de un proyecto (opcional, pero se ve mejor)
  const isActive = (opcion: { nombre: string; ruta: string }) => {
    if (location.pathname === opcion.ruta) return true;
    
    // Si estamos viendo el detalle de un proyecto (/proyecto/1), 
    // mantenemos iluminado el botón "Proyectos" para que sepa de dónde viene.
    if (opcion.nombre === 'Proyectos' && location.pathname.includes('/proyecto/')) {
        return true;
    }
    return false;
  };

  return (
    <div className="optioncont">
      {opciones.map((opcion) => (
        <button
          key={opcion.nombre}
          className={`option ${isActive(opcion) ? 'active' : ''}`}
          onClick={() => navigate(opcion.ruta)}
        >
          {/* Iconos (Puedes agregar lógica para iconos aquí si quieres) */}
          <p className="opttxt">{opcion.nombre}</p>
        </button>
      ))}
    </div>
  );
};

export default Sidebar;