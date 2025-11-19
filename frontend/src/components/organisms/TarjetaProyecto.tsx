import React from 'react'
import './TarjetaTarea.css'
import './TarjetaProyecto.css'
import { Link } from "react-router-dom";
interface Props {
    proyecto: {
        id_proyecto: number;
        nombre: string;
        rol: string;
    };
}

const TarjetaProyecto: React.FC<Props> = ({ proyecto }) => {

    return (
        <Link to="/proyecto/1" className="tarjeta-link">
            <div className='tarjetaproy'>
                <div className='priraptproy'>
                    <p className='nomproyetxt'>{proyecto.nombre}</p>
                </div>

                <div className='segdapt'>
                    <img className='imatarjproy' src="/asignacion.png" alt="" />
                    <p className='tarjtxtproy'>{proyecto.rol}</p>
                </div>


            </div>
        </Link>
    )
}

export default TarjetaProyecto