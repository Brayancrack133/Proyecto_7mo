// src/App.tsx
import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"

// Importamos el contexto  HOLA SI VES ESTO, ESTAS EN UN LUGAR SEGURO :D
import { UserProvider } from './context/UserContext'; 

import Contenido from './components/templates/Contenido'
import Inicio from './components/templates/Inicio'

import ContPlanificacion from './components/templates/ContPlanificacion'; 

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/proyectos" element={<Contenido />} />
          
          {/* Esta ruta ahora usará tu nuevo template */}
          <Route path="/proyecto/:id" element={<ContPlanificacion />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  )
}

export default App