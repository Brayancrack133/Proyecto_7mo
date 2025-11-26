
import './met.css';

const MetKanban = () => {
  return (
    <div className="methopage">
    <div className="methodology-container">
      <div className="phase-card amarillo">
        <div className="phase-icon"><img src="/Images/planificacion.png" alt="ini" /></div>
        <h3>Por hacer</h3>
        <p>Tareas pendientes que están esperando ser iniciadas.</p>
      </div>
      <div className="phase-card rosa">
        <div className="phase-icon"><img src="/Images/implementacion.png" alt="ini" /></div>
        <h3>En progreso</h3>
        <p>Tareas en las que se está trabajando activamente en este momento.</p>
      </div>
      <div className="phase-card azul">
        <div className="phase-icon"><img src="/Images/valida.png" alt="ini" /></div>
        <h3>Hecho</h3>
        <p>Tareas que se han completado con éxito.</p>
      </div>
    </div>
    </div>
  );
};

export default MetKanban;
