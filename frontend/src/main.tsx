import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx'; // O tu componente principal de rutas
import './index.css';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 🛑 DEBES ASEGURARTE DE QUE AQUÍ NO HAYA CÓDIGO DE PRUEBA 🛑 */}
    {/* Si el contador "Count: 0" está en App.tsx, cambia la importación 
       para usar tu enrutador principal, por ejemplo: 
    */}
    <App /> 
    
  </React.StrictMode>,
);