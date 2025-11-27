import React from 'react'
import './TarjetaTarea.css'

export interface TareaData {
    id_tarea: number;
    titulo: string;
    descripcion: string;
    fecha_inicio: string;
    fecha_fin: string;
    // CAMBIO 1: Permitimos null o undefined para tareas nuevas sin asignar
    nombre_responsable?: string | null;
    apellido_responsable?: string | null;
    id_responsable?: number | null;
    id_proyecto?: number;
}

interface Props {
    tarea: TareaData;
    puedeEditar: boolean;
    onSeleccionar: (tarea: TareaData) => void; 
    // CAMBIO 2: Nueva prop para el botón de asignar (opcional)
    onAsignar?: (id_tarea: number) => void; 
}

const TarjetaTarea: React.FC<Props> = ({ tarea, puedeEditar, onSeleccionar, onAsignar }) => {

    const formatearFecha = (fecha: string) => {
        if (!fecha) return "Sin fecha";
        return fecha.split('T')[0];
    };

    // Helper para saber si está asignada
    // (A veces el backend devuelve null, a veces string vacio, validamos ambos)
    const estaAsignada = tarea.nombre_responsable && tarea.nombre_responsable.trim() !== "";

    return (
        <div
            className={`tarjeta ${puedeEditar ? 'tarjeta-interactuable' : 'tarjeta-bloqueada'}`}
            // El click general sigue abriendo el detalle de la tarea
            onClick={() => {
                if (puedeEditar) {
                    onSeleccionar(tarea);
                }
            }}
        >
            {/* PARTE 1: Título y Estado */}
            <div className='prirapt'>
                <p className='tittarj'>{tarea.titulo}</p>
                <div className='esttarea'>
                    {!puedeEditar && <span style={{ fontSize: '12px', marginRight: '5px' }}>🔒</span>}
                    <p className='txtesttar'>En progreso</p>
                </div>
            </div>

            {/* PARTE 2: Asignación (CAMBIO 3: Lógica Visual) */}
            <div className='segdapt'>
                <img className='imatarj' src="/asignacion.png" alt="Usuario" />
                
                {estaAsignada ? (
                    // CASO A: Ya tiene responsable
                    <p className='tarjtxt'>
                        Asignado a: {tarea.nombre_responsable} {tarea.apellido_responsable}
                    </p>
                ) : (
                    // CASO B: No tiene responsable -> Mostrar Botón
                    <button 
                        style={{
                            backgroundColor: '#2563eb', // Azul
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            padding: '4px 12px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            marginLeft: '5px',
                            fontWeight: 'bold'
                        }}
                        onClick={(e) => {
                            e.stopPropagation(); // Evita que se abra el detalle de la tarea al hacer click en el botón
                            if (onAsignar) onAsignar(tarea.id_tarea);
                        }}
                    >
                        ➕ Asignar
                    </button>
                )}
            </div>

            {/* PARTE 3: Fechas */}
            <div className='tercerapt'>
                <img className='imatarj' src="/fecha.png" alt="Inicio" />
                <p className='tarjtxt'>Inicio: {formatearFecha(tarea.fecha_inicio)}</p>

                <img className='imatarj' src="/fecha.png" alt="Fin" />
                <p className='tarjtxt'>Fin: {formatearFecha(tarea.fecha_fin)}</p>
            </div>
        </div>
    )
}

export default TarjetaTarea;