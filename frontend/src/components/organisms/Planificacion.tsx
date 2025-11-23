// src/organisms/Planificacion.tsx
import React, { useState } from 'react'
import './Planificacion.css'
import Tareas from './Tareas'
import Documentos from './Documentos'
import ChatInterno from './ChatInterno'
import Notificaciones from './Notificaciones'

// 1. AQUÍ CREAMOS LA "MANO" PARA RECIBIR EL DATO
interface Props {
    idProyecto?: string; // El '?' significa que es opcional, para que no rompa si no llega nada
}

// 2. AQUÍ USAMOS LA INTERFAZ
const Planificacion: React.FC<Props> = ({ idProyecto }) => {
    
    const [activo, setActivo] = useState('Tareas')

    const opciones = [
        { nombre: 'Tareas', icono: '/tarea.png' },
        { nombre: 'Documentos', icono: '/documentacion.png' },
        { nombre: 'Chat Interno', icono: '/chat.png' },
        { nombre: 'Notificaciones', icono: '/notificacion.png' },
    ]

    const renderContenido = () => {
        switch (activo) {
            // 3. AHORA SÍ, SE LO PASAMOS AL COMPONENTE TAREAS
            case 'Tareas': return <Tareas idProyecto={idProyecto} />
            
            // Los demás quedan igual por ahora
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