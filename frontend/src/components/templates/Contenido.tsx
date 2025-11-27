import React from 'react'
import Sidebar from '../organisms/Sidebar'
import './Contenido.css'
import Header from '../organisms/Header/Header'

interface ContenidoProps {
  children?: React.ReactNode;
}

const Contenido: React.FC<ContenidoProps> = ({ children }) => {
  return (
    <div className="inicio-page">
      <Header u={null} />
      <div className="contnt">
        <Sidebar />

        <div className="contenido-principal">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Contenido;
