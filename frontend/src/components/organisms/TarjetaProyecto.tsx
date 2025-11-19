import React from 'react'
import './TarjetaTarea.css'
import './TarjetaProyecto.css'
import { Link } from "react-router-dom";

interface Props {
    proyecto: {
        id_proyecto: number;
        // Hacemos esto opcional (?) para que no chille TypeScript
        nombre?: string;
        nombre_proyecto?: string;
        rol?: string;
        rol_en_equipo?: string;
    };
}
const TarjetaProyecto: React.FC<Props> = ({ proyecto }) => {
    const nombreMostrar = proyecto.nombre || proyecto.nombre_proyecto || "Proyecto Sin Nombre";
    const rolMostrar = proyecto.rol || proyecto.rol_en_equipo || "Miembro";

    return (
        <Link to={`/proyecto/${proyecto.id_proyecto}`} className="tarjeta-link">
            <div className='tarjetaproy'>
                <div className='priraptproy'>
                    {/* Usamos las variables calculadas arriba */}
                    <p className='nomproyetxt'>{nombreMostrar}</p>
                </div>

                <div className='segdapt'>
                    <img className='imatarjproy' src="/asignacion.png" alt="Rol" />
                    <p className='tarjtxtproy'>Rol: {rolMostrar}</p>
                </div>
            </div>
        </Link>
    )
}

export default TarjetaProyecto