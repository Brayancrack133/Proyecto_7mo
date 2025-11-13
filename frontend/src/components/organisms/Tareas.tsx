import React from 'react'
import TarjetaTarea from './TarjetaTarea'
const Tareas = () => {
    return (
        <>
            <div className='asigtar'>
                <p className='titasig'>Asignar tareas</p>
                <p className='descriasig'>Gestiona tareas, documentos y comunicación del equipo</p>
            </div>

            <div className='apartoptn'>
                <p className='txtapartoptn'>Gestión de tareas</p>
                <button className='agrebuttnoptn'>
                    <img className='plustarbutoptn' src="/agregar.png" alt="Agregar" />
                    <p className='agretxtbutoptn'>Nueva Tarea</p>
                </button>
            </div>

            <TarjetaTarea />
            <TarjetaTarea />
        </>
    )
}

export default Tareas