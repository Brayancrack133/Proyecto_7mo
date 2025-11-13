import { useState } from 'react'
import Contenido from './components/templates/Contenido'
import Inicio from './components/templates/Inicio'
import { BrowserRouter, Routes, Route } from "react-router-dom"


function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/proyectos" element={<Contenido />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App