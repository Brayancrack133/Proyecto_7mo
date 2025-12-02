import React from 'react'
import Sidebar from '../organisms/Sidebar'
import './Contenido.css'
import Header from '../organisms/Head'
// 👇 1. IMPORTAR EL CHAT
import ChatFlotante from '../organisms/ChatFlotante'

interface ContenidoProps {
  children?: React.ReactNode;
}

const Contenido: React.FC<ContenidoProps> = ({ children }) => {
  return (
    <div className="inicio-page" style={{ position: 'relative', minHeight: '100vh' }}>
      <Header  />

      <div className="contnt">
        <Sidebar />

        <div className="contenido-principal">
          {children}
        </div>
      </div>

      {/* 👇 2. AQUÍ VA EL CHAT FLOTANTE */}
      <ChatFlotante />
    </div>
  );
};

export default Contenido;
