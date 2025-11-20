import React from 'react';
// import './Header.css'; // Ya no necesitamos el CSS externo, usaremos estilos propios del componente
import { useUser } from '../../context/UserContext';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const { usuario } = useUser();
  const location = useLocation();

  // Pequeña lógica para cambiar el título según la ruta (Opcional)
  const getTitle = () => {
    if (location.pathname.includes('crear-proyecto')) return 'Crear Proyecto';
    if (location.pathname.includes('proyectos')) return 'Mis Proyectos';
    if (location.pathname.includes('planificacion')) return 'Planificación';
    return 'Dashboard'; // Título por defecto
  };

  return (
    <header style={{
      height: '80px',
      backgroundColor: '#071739', // El mismo azul oscuro del Sidebar
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between', // Separa Título (izq) y Perfil (der)
      padding: '0 40px',
      color: 'white',
      borderBottom: '1px solid rgba(255,255,255,0.1)', // Línea sutil separadora
      width: '100%'
    }}>
      
      {/* IZQUIERDA: Título de la sección actual */}
      <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>
        {getTitle()}
      </h2>

      {/* DERECHA: Datos del Usuario + Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        
        <div style={{ textAlign: 'right' }}>
          {/* Nombre del Usuario (Traído de TiDB) */}
          <div style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase' }}>
             {usuario ? `${usuario.nombre} ${usuario.apellido}` : 'INVITADO'}
          </div>
          
          {/* Rol o Link a Perfil */}
          <div style={{ fontSize: '12px', opacity: 0.7, cursor: 'pointer' }}>
             {usuario?.rol || 'Mi Perfil'}
          </div>
        </div>

        {/* Avatar Circular */}
        <div style={{ 
          width: '45px', 
          height: '45px', 
          borderRadius: '50%', 
          overflow: 'hidden',
          border: '2px solid #dd9d52', // El toque naranja de tu marca en el borde
          backgroundColor: '#ccc' // Color de fondo por si la imagen falla
        }}>
           <img 
             src="/avatar.png" // Asegúrate de tener esta imagen en la carpeta public
             alt="Avatar" 
             style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
             onError={(e) => {
                // Fallback si no encuentra la imagen
                e.currentTarget.src = "https://ui-avatars.com/api/?name=" + (usuario?.nombre || "U") + "&background=random";
             }}
           />
        </div>

      </div>
    </header>
  );
};

export default Header;