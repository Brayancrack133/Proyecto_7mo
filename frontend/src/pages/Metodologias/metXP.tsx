import './met.css';

const MetXP = () => {
  return (
    <div className="methopage">
    <div className="methodology-container">
      <div className="phase-card rosa">
        <div className="phase-icon"><img src="/Images/planificacion.png" alt="ini" /></div>
        <h3>Planificación</h3>
        <p>El equipo trabaja con el cliente para definir las historias de usuario y priorizarlas para futuras iteraciones.</p>
      </div>
      <div className="phase-card verde">
        <div className="phase-icon"><img src="/Images/disen.png" alt="ini" /></div>
        <h3>Diseño</h3>
        <p>Se crea un diseño simple y sencillo, buscando la mejor solución técnica para las historias de usuario seleccionadas.</p>
      </div>
      <div className="phase-card azul">
        <div className="phase-icon"><img src="/Images/codific.png" alt="ini" /></div>
        <h3>Codificación</h3>
        <p>Se enfoca en la programación en parejas, donde dos desarrolladores colaboran en el mismo código para mejorar la calidad.</p>
      </div>
      <div className="phase-card amarillo">
        <div className="phase-icon"><img src="/Images/pruebas.png" alt="ini" /></div>
        <h3>Pruebas</h3>
        <p>Se realizan pruebas unitarias continuas y automatizadas usando el desarrollo dirigido por pruebas (TDD).</p>
      </div>
      <div className="phase-card naranja">
        <div className="phase-icon"><img src="/Images/lanzamiento.png" alt="ini" /></div>
        <h3>Lanzamiento</h3>
        <p>Se entrega el software al usuario, permitiendo recibir retroalimentación para realizar ajustes rápidos.</p>
      </div>
    </div>
    </div>
  );
};

export default MetXP;
