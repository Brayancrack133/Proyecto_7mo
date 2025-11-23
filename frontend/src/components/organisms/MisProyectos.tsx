import React, { useEffect, useState } from 'react';
import './MisProyectos.css';
import TarjetaProyecto from '../organisms/TarjetaProyecto';
import './Planificacion.css';
import { useUser } from '../../context/UserContext';// <--- Importante

interface Proyecto {
    id_proyecto: number;
    nombre: string;        // Ahora coincide con TarjetaProyecto
    descripcion: string;
    fecha_inicio: string;
    fecha_fin: string | null;
    rol: string;           // Ahora coincide con TarjetaProyecto
    nombre_equipo: string;
}

const MisProyectos = () => {

    const [proyectos, setProyectos] = useState<Proyecto[]>([]);

    // 1. Obtenemos el usuario y el estado de carga
    const { usuario, isLoading } = useUser();

    useEffect(() => {
        if (usuario) {
            fetch(`http://localhost:3000/api/mis-proyectos/${usuario.id_usuario}`)
                .then(res => {
                    // Si la respuesta no es OK (ej: Error 500), lanzamos error manual
                    if (!res.ok) throw new Error("Error en la respuesta del servidor");
                    return res.json();
                })
                .then(data => {
                    // PROTECCIÓN: Verificamos si lo que llegó es realmente una lista (Array)
                    if (Array.isArray(data)) {
                        setProyectos(data);
                    } else {
                        console.error("Formato de datos incorrecto:", data);
                        setProyectos([]); // Si llega basura, ponemos lista vacía para no romper
                    }
                })
                .catch(err => {
                    console.error("Error cargando proyectos:", err);
                    setProyectos([]); // En caso de error, lista vacía
                });
        }
    }, [usuario]);
    // Opcional: Mostrar algo mientras carga el usuario
    if (isLoading) return <div style={{ color: 'white' }}>Cargando usuario...</div>;

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
                {/* Si no hay proyectos, podrías mostrar un mensaje */}
                {proyectos.length === 0 && <p style={{ color: '#ccc' }}>No tienes proyectos asignados.</p>}

                {proyectos.map(proy => (
                    <TarjetaProyecto key={proy.id_proyecto} proyecto={proy} />
                ))}
            </div>

        </div>
    );
}

export default MisProyectos;
