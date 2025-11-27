// src/organisms/Planificacion.tsx
import React, { useState, useEffect } from 'react'
import './Planificacion.css'
import Tareas from './Tareas'
import Documentos from './Documentos'
import ChatInterno from './ChatInterno'
import Notificaciones from './Notificaciones'
import { useUser } from '../../context/UserContext';

// 1. AQUÍ CREAMOS LA "MANO" PARA RECIBIR EL DATO
interface Props {
    idProyecto?: string; // El '?' significa que es opcional, para que no rompa si no llega nada
}

// 2. AQUÍ USAMOS LA INTERFAZ
const Planificacion: React.FC<Props> = ({ idProyecto }) => {

    const [activo, setActivo] = useState('Tareas')
    const { usuario } = useUser(); // <--- 1. Obtenemos usuario global
    const [esLider, setEsLider] = useState(false); // <--- 2. Estado para guardar el permiso

    const [tareaParaAbrir, setTareaParaAbrir] = useState<number | null>(null);

    const opciones = [
        { nombre: 'Tareas', icono: '/tarea.png' },
        { nombre: 'Documentos', icono: '/documentacion.png' },
        { nombre: 'Chat Interno', icono: '/chat.png' },
        { nombre: 'Notificaciones', icono: '/notificacion.png' },
    ]

    const irATareas = (idTarea?: number) => {
        setActivo('Tareas');
        if (idTarea) {
            setTareaParaAbrir(idTarea);
        }
    };

    useEffect(() => {
        if (idProyecto && usuario) {
            // CORRECCIÓN: Detectar ID real
            const idReal = (usuario as any).id || usuario.id_usuario;

            fetch(`http://localhost:3000/api/proyecto/${idProyecto}/usuario/${idReal}`)
                .then(res => res.json())
                .then(data => {
                    // Si el rol calculado es 'Líder', ponemos true
                    if (data.rol_calculado === 'Líder') {
                        setEsLider(true);
                        console.log("👑 Acceso de LÍDER concedido");
                    } else {
                        setEsLider(false);
                        console.log("👤 Acceso de INTEGRANTE concedido");
                    }
                })
                .catch(err => console.error("Error verificando rol:", err));
        }
    }, [idProyecto, usuario]);



    const renderContenido = () => {
        switch (activo) {
            case 'Tareas': return (
                <Tareas
                    idProyecto={idProyecto}
                    esLider={esLider}
                    // 3. PASAMOS LA "ORDEN" AL COMPONENTE TAREAS
                    idTareaInicial={tareaParaAbrir}
                    // Función para limpiar la orden una vez abierta
                    limpiarSeleccion={() => setTareaParaAbrir(null)}
                />
            );
            case 'Chat Interno': return <ChatInterno idProyecto={idProyecto} />
            case 'Documentos': return <Documentos idProyecto={idProyecto} esLider={esLider} />
            // ... otros casos
            case 'Notificaciones': return (
                <Notificaciones
                    alClickEnTarea={irATareas}
                    idProyecto={idProyecto!} // <--- AGREGAMOS ESTO (El ! es porque sabemos que existe)
                />
            );            // ...
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