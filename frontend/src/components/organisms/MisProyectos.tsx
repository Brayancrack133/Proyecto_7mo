import React, { useEffect, useState } from 'react';
import './MisProyectos.css';
import TarjetaProyecto from '../organisms/TarjetaProyecto';
import './Planificacion.css';

interface Proyecto {
    id_proyecto: number;
    nombre_proyecto: string;
    descripcion: string;
    fecha_inicio: string;
    fecha_fin: string | null;
    rol_en_equipo: string;
    nombre_equipo: string;
}

const MisProyectos = () => {

    const [proyectos, setProyectos] = useState<Proyecto[]>([]);

    useEffect(() => {
        fetch("http://192.168.0.2:3000/api/mis-proyectos/1")
            .then(res => res.json())
            .then(data => setProyectos(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className='contplancom'>
            <div className='asigtar'>
                <p className='titasig'>Mis Proyectos</p>
                <p className='descriasig'>Proyectos en los que participas como líder o integrante.</p>
            </div>

            <div className='apartoptn'>
                <div className='opcionesproyecto'>
                    <button className='agrebuttnoptn'>
                        <img className='plustarbutoptn' src="/agregar.png" alt="Agregar" />
                        <p className='agretxtbutoptn'>Nuevo Proyecto</p>
                    </button>
                    <button className='agrebuttnoptn'>
                        <img className='plustarbutoptn' src="/equipo.png" alt="Agregar" />
                        <p className='agretxtbutoptn'>Unirse a proyecto</p>
                    </button>
                </div>
            </div>

            <div className='containerproy'>
                {proyectos.map(proy => (
                    <TarjetaProyecto key={proy.id_proyecto} proyecto={proy} />
                ))}
            </div>
        </div>
    );
}

export default MisProyectos;
