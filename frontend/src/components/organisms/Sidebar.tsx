import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './sidebar.css'

const Sidebar = () => {
  const navigate = useNavigate()
  const [active, setActive] = useState('Inicio')

  const handleClick = (name: string, path: string) => {
    setActive(name)
    navigate(path)
  }

  return (
    <div className='optioncont'>
      <button
        className={`option ${active === 'Inicio' ? 'active' : ''}`}
        onClick={() => handleClick('Inicio', '/inicio')}
      >
        <p className='opttxt'>Inicio</p>
      </button>

      <button
        className={`option ${active === 'Proyectos' ? 'active' : ''}`}
        onClick={() => handleClick('Proyectos', '/proyectos')}
      >
        <p className='opttxt'>Proyectos</p>
      </button>

      <button
        className={`option ${active === 'Planificación' ? 'active' : ''}`}
        onClick={() => handleClick('Planificación', '/planificacion')}
      >
        <p className='opttxt'>Planificación</p>
      </button>
    </div>
  )
}

export default Sidebar
