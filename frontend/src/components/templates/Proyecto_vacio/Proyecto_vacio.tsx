import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Proyecto_vacio.css';

const EmptyProjectsState = () => {
    const navigate = useNavigate();

    return (
        <div className="empty-state-container">
            <div className="empty-content">
                <div className="image-wrapper">
                    {/* Asegúrate de tener esta imagen en tu carpeta public */}
                    <img 
                        src="/Images/proyecto_vacio.png" 
                        alt="Sin proyectos" 
                        className="empty-image"
                    />
                </div>
                
                <h2 className="empty-title">¡Bienvenido a tu espacio de trabajo!</h2>
                <p className="empty-description">
                    Aún no tienes ningún proyecto activo. Comienza ahora creando tu primer análisis
                    y elige la metodología que mejor se adapte a tus necesidades.
                </p>

                <button 
                    className="btn-create-first"
                    onClick={() => navigate('/proyecto-principal')}
                >
                    🚀 Crear mi primer proyecto
                </button>
            </div>
        </div>
    );
};

export default EmptyProjectsState;