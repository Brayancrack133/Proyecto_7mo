import React, { useEffect, useState } from 'react'
import { useUser } from '../../context/UserContext';
import TarjetaNotificacion from './TarjetaNotificacion'; // Importa tu nuevo componente
import ModalAvance from './ModalAvance'; // <--- 1. IMPORTAMOS EL MODAL


interface Props {
    alClickEnTarea: (idTarea: number) => void;
    idProyecto: string; // 1. AGREGAMOS ESTA PROP
}


const Notificaciones: React.FC<Props> = ({ alClickEnTarea, idProyecto }) => {
    const { usuario } = useUser();
    const [notificaciones, setNotificaciones] = useState<any[]>([]);
    const [tareaParaRevisar, setTareaParaRevisar] = useState<number | null>(null);

    const handleAceptarUnion = (idProyecto: number, idUsuario: number) => {
        if (window.confirm("¿Deseas aceptar a este usuario en el proyecto?")) {
            fetch('http://localhost:3000/api/proyectos/aceptar-union', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_proyecto: idProyecto, id_usuario_nuevo: idUsuario })
            })
                .then(res => {
                    if (res.ok) {
                        alert("✅ Usuario añadido al equipo");
                        // Opcional: Recargar notificaciones o marcarlas como leídas
                    }
                });
        }
    };

    useEffect(() => {
        if (usuario && idProyecto) {
            // CORRECCIÓN: Detectamos el ID real (sea 'id' o 'id_usuario')
            const idReal = (usuario as any).id || usuario.id_usuario;

            fetch(`http://localhost:3000/api/notificaciones/usuario/${idReal}/proyecto/${idProyecto}`)
                .then(res => res.json())
                .then(data => {
                    console.log("Notificaciones cargadas:", data); // Para depurar
                    setNotificaciones(data);
                })
                .catch(err => console.error(err));
        }
    }, [usuario, idProyecto]);

    return (
        <>
            <div className='asigtar'>
                <p className='titasig'>Notificaciones</p>
                <p className='descriasig'>Revisa las alertas y recordatorios de tu proyecto</p>
            </div>

            <div className='containerproy' style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {notificaciones.length === 0 && <p style={{ color: '#999' }}>No hay notificaciones en este proyecto.</p>}

                {notificaciones.map(noti => (
                    <TarjetaNotificacion
                        key={noti.id_notificacion}
                        notificacion={noti}
                        onClick={() => {
                            // CASO 1: SOLICITUD DE UNIÓN (NUEVO)
                            if (!noti.id_tarea && !noti.id_proyecto) return;


                            if (noti.tipo === 'Solicitud Union' && noti.id_proyecto && noti.id_usuario_remitente) {
                                handleAceptarUnion(noti.id_proyecto, noti.id_usuario_remitente);
                                return;
                            }

                            // CASO 2: ENTREGA (Líder revisa)
                            if (noti.tipo === 'Entrega Realizada' && noti.id_tarea) {
                                setTareaParaRevisar(noti.id_tarea);
                            } else if (noti.id_tarea) {
                                alClickEnTarea(noti.id_tarea);
                            }
                        }}
                    />
                ))}
            </div>

            {/* 4. MODAL DE REVISIÓN (Se abre encima de notificaciones) */}
            {tareaParaRevisar && (
                <ModalAvance
                    idTarea={tareaParaRevisar}
                    esLider={true}
                    onClose={() => setTareaParaRevisar(null)}
                />
            )}
        </>
    )
}

export default Notificaciones;