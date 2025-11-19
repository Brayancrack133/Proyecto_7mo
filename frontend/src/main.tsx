// src/main.tsx (o src/index.tsx)
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App' // O donde esté tu componente principal
import './index.css'
import { UserProvider } from './context/UserContext'; // Importamos el proveedor

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Envolvemos TODA la app */}
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>,
)