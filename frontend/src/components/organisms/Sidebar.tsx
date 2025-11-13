import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); 

  const opciones = [
    { nombre: 'Inicio', ruta: '/' },
    { nombre: 'Proyectos', ruta: '/proyectos' },
    { nombre: 'Planificación', ruta: '/planificacion' },
  ];

  return (
    <div className="optioncont">
      {opciones.map((opcion) => (
        <button
          key={opcion.nombre}
          className={`option ${location.pathname === opcion.ruta ? 'active' : ''}`}
          onClick={() => navigate(opcion.ruta)}
        >
          <p className="opttxt">{opcion.nombre}</p>
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
