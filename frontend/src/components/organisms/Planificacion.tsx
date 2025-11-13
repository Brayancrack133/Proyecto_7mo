import React, { useState } from 'react'
import './Planificacion.css'
import Tareas from './Tareas'
import Documentos from './Documentos'
import ChatInterno from './ChatInterno'
import Notificaciones from './Notificaciones'

const Planificacion = () => {
    const [activo, setActivo] = useState('Tareas')

    const opciones = [
        { nombre: 'Tareas', icono: '/tarea.png' },
        { nombre: 'Documentos', icono: '/documentacion.png' },
        { nombre: 'Chat Interno', icono: '/chat.png' },
        { nombre: 'Notificaciones', icono: '/notificacion.png' },
    ]

    const renderContenido = () => {
        switch (activo) {
            case 'Tareas': return <Tareas />
            case 'Documentos': return <Documentos />
            case 'Chat Interno': return <ChatInterno />
            case 'Notificaciones': return <Notificaciones />
            default: return null
        }
    }

    return (
        <div className='contplancom'>
            <div className='contbutop'>
                {opciones.map((opcion) => (
                    <div
                        key={opcion.nombre}
                        className={`buttnoptn ${activo === opcion.nombre ? 'activo' : ''}`}
                        onClick={() => setActivo(opcion.nombre)}
                    >
                        <img className='tarbutoptn' src={opcion.icono} alt={opcion.nombre} />
                        <p className='txtbutoptn'>{opcion.nombre}</p>
                    </div>
                ))}
            </div>

            <div className='contenido-scroll'>
                {renderContenido()}
            </div>
        </div>
    )
}

export default Planificacion
