import React from 'react';
import ReactDOM from 'react-dom/client'; // <-- IMPORTANTE: Cambia a 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// 1. Obtén el elemento root
const rootElement = document.getElementById('root')!;

// 2. Crea el "root" de React 18
const root = ReactDOM.createRoot(rootElement);

// 3. Usa el nuevo "root.render()"
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);