import React from 'react'
import './TarjetaTarea.css'
const TarjetaTarea = () => {
    return (
        <div className='tarjeta'>
            <div className='prirapt'>
                <p className='tittarj'>Diseño de interfaz</p>
                <div className='esttarea'>
                    <p className='txtesttar'>En progreso</p>
                </div>
            </div>
            <div className='segdapt'>
                <img className='imatarj' src="/asignacion.png" alt="" />
                <p className='tarjtxt'>Asignado a: María García</p>
            </div>
            <div className='tercerapt'>
                <img className='imatarj' src="/fecha.png" alt="" />
                <p className='tarjtxt'>Inicio: 2025-10-05</p>
                <img className='imatarj' src="/fecha.png" alt="" />
                <p className='tarjtxt'>Fin: 2025-10-12</p>
            </div>
        </div>
    )
}

export default TarjetaTarea