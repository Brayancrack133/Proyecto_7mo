import { useState } from 'react'
import { AppRoutes } from './routes/AppRoutes'; // <-- 1. IMPORTAR TUS RUTAS

function App() {
  // 2. BORRA TODO (el useState, el logo, el return con el contador)
  // 3. DEJA SOLO ESTO:
  return (
    <AppRoutes />
  );
}

export default App;