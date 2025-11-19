import React, { useEffect, useState } from 'react'
import TarjetaTarea, { TareaData } from './TarjetaTarea'

// 1. Definimos que recibe el ID del proyecto
interface Props {
    idProyecto?: string;
}

const Tareas: React.FC<Props> = ({ idProyecto }) => {
    
    // 2. Estado para guardar la lista de tareas
    const [listaTareas, setListaTareas] = useState<TareaData[]>([]);

    useEffect(() => {
        // Solo buscamos si tenemos un ID válido
        if (idProyecto) {
            // IMPORTANTE: Asegúrate que la IP/Puerto sea la correcta
            fetch(`http://localhost:3000/api/tareas/${idProyecto}`)
                .then(res => {
                    if (!res.ok) throw new Error("Error al cargar tareas");
                    return res.json();
                })
                .then(data => {
                    // Verificamos que sea un array antes de guardarlo
                    if (Array.isArray(data)) {
                        setListaTareas(data);
                    } else {
                        setListaTareas([]);
                    }
                })
                .catch(err => console.error(err));
        }
    }, [idProyecto]); // Se ejecuta cada vez que cambias de proyecto

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

            {/* 3. Mensaje si no hay tareas */}
            {listaTareas.length === 0 && (
                <p style={{color: '#999', marginTop: '20px'}}>No hay tareas registradas en este proyecto.</p>
            )}

            {/* 4. Mapeamos la lista real */}
            {listaTareas.map(tarea => (
                <TarjetaTarea key={tarea.id_tarea} tarea={tarea} />
            ))}
        </>
    )
}

export default Tareas