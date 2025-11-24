import React from 'react'
import './TarjetaTarea.css'

export interface TareaData {
    id_tarea: number;
    titulo: string;
    descripcion: string;
    fecha_inicio: string;
    fecha_fin: string;
    nombre_responsable: string;
    apellido_responsable: string;
    id_responsable: number;
    id_proyecto?: number;
}

interface Props {
    tarea: TareaData;
    puedeEditar: boolean;
    onSeleccionar: (tarea: TareaData) => void; // <--- Debe llamarse así
}

// CAMBIO 2: Recibimos 'onSeleccionar'
const TarjetaTarea: React.FC<Props> = ({ tarea, puedeEditar, onSeleccionar }) => {

    const formatearFecha = (fecha: string) => {
        if (!fecha) return "Sin fecha";
        return fecha.split('T')[0];
    };

    return (
        <div
            className={`tarjeta ${puedeEditar ? 'tarjeta-interactuable' : 'tarjeta-bloqueada'}`}
            onClick={() => {
                if (puedeEditar) {
                    console.log("Click en tarjeta:", tarea.titulo); // <--- DEBUG
                    onSeleccionar(tarea); // <--- Llama a la función con el nombre correcto
                }
            }}
        >
            <div className='prirapt'>
                <p className='tittarj'>{tarea.titulo}</p>
                <div className='esttarea'>
                    {!puedeEditar && <span style={{ fontSize: '12px', marginRight: '5px' }}>🔒</span>}
                    <p className='txtesttar'>En progreso</p>
                </div>
            </div>

            <div className='segdapt'>
                <img className='imatarj' src="/asignacion.png" alt="Usuario" />
                <p className='tarjtxt'>
                    Asignado a: {tarea.nombre_responsable} {tarea.apellido_responsable}
                </p>
            </div>

            <div className='tercerapt'>
                <img className='imatarj' src="/fecha.png" alt="Inicio" />
                <p className='tarjtxt'>Inicio: {formatearFecha(tarea.fecha_inicio)}</p>

                <img className='imatarj' src="/fecha.png" alt="Fin" />
                <p className='tarjtxt'>Fin: {formatearFecha(tarea.fecha_fin)}</p>
            </div>
        </div>
    )
}

export default TarjetaTarea