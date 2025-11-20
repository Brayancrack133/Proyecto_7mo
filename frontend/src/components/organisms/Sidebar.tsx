import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Si prefieres usar tu archivo CSS externo, asegúrate de que tenga los estilos nuevos.
// Aquí usaré estilos en línea para garantizar que se vea igual al Figma inmediatamente.

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); 

  // Lista completa basada en tu diseño de Figma
  const opciones = [
    { nombre: 'Inicio', ruta: '/dashboard' }, // El inicio del dashboard
    { nombre: 'Proyectos', ruta: '/dashboard/proyectos' },
    { nombre: 'Planificación', ruta: '/dashboard/planificacion' },
    { nombre: 'Colaboración', ruta: '/dashboard/colaboracion' },
    { nombre: 'Repositorio', ruta: '/dashboard/repositorio' },
    { nombre: 'IA Predictiva', ruta: '/dashboard/ia-predictiva' },
    { nombre: 'Panel Analítico', ruta: '/dashboard/panel' },
    { nombre: 'Configuración', ruta: '/dashboard/configuracion' },
  ];

  // Lógica para saber si el botón está activo
  const isActive = (ruta: string) => {
    // Coincidencia exacta
    if (location.pathname === ruta) return true;
    
    // Caso especial: Si estamos creando un proyecto, iluminamos "Proyectos"
    if (ruta === '/dashboard/proyectos' && location.pathname.includes('/dashboard/crear-proyecto')) {
        return true;
    }

    return false;
  };

  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#071739', // Fondo Azul Oscuro del Figma
      height: '100vh', // Altura completa
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      boxSizing: 'border-box',
      color: 'white',
      flexShrink: 0, // Evita que se encoja
      position: 'sticky',
      top: 0,
      borderRight: '1px solid rgba(255,255,255,0.1)'
    }}>
      
      {/* Logo Placeholder */}
      <div style={{ 
        marginBottom: '40px', 
        textAlign: 'center', 
        paddingBottom: '20px', 
        borderBottom: '1px solid rgba(255,255,255,0.1)' 
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, letterSpacing: '2px' }}>
          FUTURE
        </h1>
      </div>

      {/* Menú de Opciones */}
      <div className="optioncont" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {opciones.map((opcion) => {
            const active = isActive(opcion.ruta);
            return (
                <button
                  key={opcion.nombre}
                  onClick={() => navigate(opcion.ruta)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    // Lógica de colores según estado (Figma style)
                    backgroundColor: active ? '#dd9d52' : 'transparent', // Naranja si activo
                    color: active ? '#000000' : '#FFFFFF', // Negro si activo, Blanco si no
                    fontWeight: active ? 'bold' : 'normal'
                  }}
                >
                  {/* Aquí puedes poner un icono si quieres */}
                  <span style={{ marginLeft: '5px' }}>{opcion.nombre}</span>
                </button>
            );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;