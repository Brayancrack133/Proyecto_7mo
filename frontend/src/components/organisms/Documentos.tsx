import React from 'react'
import TarjetaDocum from './TarjetaDocum'
const Documentos = () => {
    return (
        <>
            <div className='asigtar'>
                <p className='titasig'>Gestión de documentos</p>
                <p className='descriasig'>Sube, descarga y organiza los archivos del proyecto</p>
            </div>

            <div className='apartoptn'>
                <p className='txtapartoptn'>Documentos compartidos</p>
                <button className='agrebuttnoptn'>
                    <img className='subirarch' src="/subida.png" alt="Agregar" />
                    <p className='agretxtbutoptn'>Subir documento</p>
                </button>
            </div>

            <TarjetaDocum />
        </>
    )
}

export default Documentos