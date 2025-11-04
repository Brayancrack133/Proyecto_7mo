import { useState } from 'react'
import Header from './components/organisms/Header'
import Contenido from './components/templates/Contenido'
import { BrowserRouter, Routes, Route } from "react-router-dom"


function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    <div className="App">
      <Header />
      <Contenido/>
    </div>
    </BrowserRouter>
  )
}

export default App