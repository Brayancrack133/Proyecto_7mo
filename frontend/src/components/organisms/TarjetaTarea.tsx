import React from 'react'
import './TarjetaTarea.css'

// 1. Definimos qué forma tienen los datos que vienen de la Base de Datos
export interface TareaData {
    id_tarea: number;
    titulo: string;
    descripcion: string;
    fecha_inicio: string;
    fecha_fin: string;
    nombre_responsable: string;
    apellido_responsable: string;
}

interface Props {
    tarea: TareaData;
}

const TarjetaTarea: React.FC<Props> = ({ tarea }) => {
    
    // Función pequeña para limpiar la fecha (de "2025-11-01T00:00..." a "2025-11-01")
    const formatearFecha = (fecha: string) => {
        if (!fecha) return "Sin fecha";
        return fecha.split('T')[0]; 
    };

    return (
        <div className='tarjeta'>
            <div className='prirapt'>
                {/* Título dinámico */}
                <p className='tittarj'>{tarea.titulo}</p>
                
                <div className='esttarea'>
                    {/* Por ahora el estado es estático, luego lo podemos conectar */}
                    <p className='txtesttar'>En progreso</p>
                </div>
            </div>
            
            <div className='segdapt'>
                <img className='imatarj' src="/asignacion.png" alt="Usuario" />
                {/* Nombre del responsable concatenado */}
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