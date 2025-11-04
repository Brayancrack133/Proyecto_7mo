import React, { useState } from 'react'
import './Planificacion.css'
import TarjetaTarea from './TarjetaTarea'

const Planificacion = () => {
    const [activo, setActivo] = useState('Tareas')

    const opciones = [
        { nombre: 'Tareas', icono: '/tarea.png' },
        { nombre: 'Documentos', icono: '/documentacion.png' },
        { nombre: 'Chat Interno', icono: '/chat.png' },
        { nombre: 'Notificaciones', icono: '/notificacion.png' },
    ]

    return (
        <div className='contplancom'>
            <div className='asigtar'>
                <p className='titasig'>Asignar tareas</p>
                <p className='descriasig'>Gestiona tareas, documentos y comunicación del equipo</p>
            </div>

            {/* Botones de opciones */}
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

            <div className='apartoptn'>
                <p className='txtapartoptn'>Gestión de tareas</p>
                <button className='agrebuttnoptn'>
                    <img className='plustarbutoptn' src="/agregar.png" alt="Agregar" />
                    <p className='agretxtbutoptn'>Nueva Tarea</p>
                </button>
            </div>


            <TarjetaTarea />
        </div>
    )
}

export default Planificacion
