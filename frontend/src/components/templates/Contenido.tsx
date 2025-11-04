import React from 'react'
import Sidebar from '../organisms/Sidebar'
import './Contenido.css'
import Planificacion from '../organisms/Planificacion'
const Contenido = () => {
    return (
        <div className='contnt'>
            <Sidebar/>
            <Planificacion/>
        </div>
    )
}

export default Contenido