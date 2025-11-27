import React from 'react';
import { useParams } from 'react-router-dom'; // Importante para leer el ID de la URL
import { useProyectoPrincipal } from '../../hooks/useProyectoPrincipal';
import './met.css';

const MetCascada = () => {
  const { id } = useParams(); // Leemos el ID de la URL (ej: /cascada/5)
  const { proyecto, loading } = useProyectoPrincipal(id);

  return (
    <div className="methopage">
        
        {/* Banner Informativo Dinámico */}
        <div className="info-banner">
            {loading ? <p style={{color:'white', textAlign:'center'}}>Cargando datos del proyecto...</p> : (
                <>
                    <h1 className='title-proy'>{proyecto?.nombre_proyecto}</h1>
                    <p className='desc-proy'>{proyecto?.descripcion}</p>
                    
                    {/* Ahora TypeScript reconocerá sugerencia_ia */}
                    {proyecto?.sugerencia_ia && (
                        <div className="ia-hint">
                            <strong>🤖 Sugerencia IA:</strong> {proyecto.sugerencia_ia}
                        </div>
                    )}
                </>
            )}
        </div>

        <div className="methodology-container">
          {/* ... (Tus tarjetas de fases se mantienen igual) ... */}
          <div className="phase-card azul">
            <div className="phase-icon"><img src="/Images/planificacion.png" alt="ini" /></div>
            <h3>Requisitos</h3>
            <p>Se recopilan y documentan todos los requisitos del proyecto definidos por el cliente o las partes interesadas.</p>
          </div>
          <div className="phase-card amarillo">
            <div className="phase-icon"><img src="/Images/disen.png" alt="ini" /></div>
            <h3>Diseño</h3>
            <p>Se crea un diseño detallado del sistema basándose en los requisitos establecidos en la fase anterior.</p>
          </div>
          <div className="phase-card rosa">
            <div className="phase-icon"><img src="/Images/implementacion.png" alt="ini" /></div>
            <h3>Implementación</h3>
            <p>Los desarrolladores escriben el código y construyen el software, basándose en el diseño.</p>
          </div>
          <div className="phase-card naranja">
            <div className="phase-icon"><img src="/Images/pruebas.png" alt="ini" /></div>
            <h3>Verificación (Pruebas)</h3>
            <p>Se comprueba y se prueba el software para asegurar que cumple con los requisitos y no contiene errores.</p>
          </div>
          <div className="phase-card verde">
            <div className="phase-icon"><img src="/Images/lanzamiento.png" alt="ini" /></div>
            <h3>Despliegue</h3>
            <p>El producto final se entrega al usuario o cliente.</p>
          </div>
          <div className="phase-card morado">
            <div className="phase-icon"><img src="/Images/manteni.png" alt="ini" /></div>
            <h3>Mantenimiento</h3>
            <p>Después del despliegue, se realizan actualizaciones y se solucionan problemas que puedan surgir con el uso continuo del software.</p>
          </div>
        </div>
    </div>
  );
};

export default MetCascada;