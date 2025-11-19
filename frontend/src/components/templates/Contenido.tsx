import React from 'react'
import Sidebar from '../organisms/Sidebar'
import './Contenido.css'
import Planificacion from '../organisms/Planificacion'
import Header from '../organisms/Header'
import MisProyectos from '../organisms/MisProyectos'

const Contenido = () => {
    return (
        <div className="inicio-page">
            <Header />
            <div className="contnt">
                <Sidebar />
                <MisProyectos />
            </div>
        </div>
    )
}

export default Contenido