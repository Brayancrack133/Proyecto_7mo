import React from 'react';
import { useParams } from 'react-router-dom';
import { useProyectoPrincipal } from '../../hooks/useProyectoPrincipal';
import './met.css';

const MetScrum = () => {
  const { id } = useParams();
  const { proyecto, loading } = useProyectoPrincipal(id);

  return (
    <div className="methopage">
        <div className="info-banner">
            {loading ? <p>Cargando...</p> : (
                <>
                    <h1 className='title-proy'>{proyecto?.nombre_proyecto}</h1>
                    <p>{proyecto?.descripcion}</p>
                </>
            )}
        </div>

        <div className="methodology-container">
          <div className="phase-card azul">
            <div className="phase-icon"><img src="/Images/inicio.png" alt="ini" /></div>
            <h3>Inicio</h3>
            <p>Se define la visión del producto, los objetivos, los entregables y se forma el equipo.</p>
          </div>
          <div className="phase-card rosa">
            <div className="phase-icon"><img src="/Images/planificacion.png" alt="ini" /></div>
            <h3>Planificación y estimación</h3>
            <p>Se crea y prioriza el Product Backlog y se estiman los costos y la funcionalidad a desarrollar.</p>
          </div>
          <div className="phase-card naranja">
            <div className="phase-icon"><img src="/Images/implementacion.png" alt="ini" /></div>
            <h3>Implementación</h3>
            <p>Es el trabajo iterativo para desarrollar las funcionalidades seleccionadas durante el Sprint.</p>
          </div>
          <div className="phase-card verde">
            <div className="phase-icon"><img src="/Images/revision.png" alt="ini" /></div>
            <h3>Revisión y retrospectiva</h3>
            <p>Se revisa el producto y se reflexiona sobre el proceso, como se describe en los eventos del Sprint.</p>
          </div>
          <div className="phase-card amarillo">
            <div className="phase-icon"><img src="/Images/lanzamiento.png" alt="ini" /></div>
            <h3>Lanzamiento</h3>
            <p>Se prepara la entrega del producto terminado al usuario final.</p>
          </div>
        </div>
    </div>
  );
};

export default MetScrum;