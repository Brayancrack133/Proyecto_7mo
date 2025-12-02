import React from 'react';
import "./LICP.css";
import { Link } from "react-router-dom"; // CORRECCIÓN: Link de React Router

const LICP3 = () => {
    return (
        // Asegúrate de tener una imagen 'pfimag.png' o cambia el background en el CSS
        <div className='contLICP3'>
            <div className='propg'>
                <p className='titprop'>Future Plan</p>
                <p className='mintit'>Simplifica tu gestión</p>
                <p className='mintit'>Encuentra las herramientas que necesitas.</p>
                <p className='mintit'>Planifica tus sprints de acuerdo a tu tiempo real.</p>
                <p className='mintit'>Colabora de manera inteligente.</p>
            </div>
            
            <div className='propg'>
                <p className='mintit'>Contacto directo con tu equipo</p>
                <p className='mintit'>Datos seguros</p>
                <p className='mintiti'>
                    Explora los proyectos en los que participas o crea uno nuevo para empezar a liderar.
                </p>
                
                <div className='CbtnExp'>
                    {/* Botones de acción */}
                    <Link to='/dashboard-proyecto' className="btExCu">
                        <p className='txbtncu'>Mis Proyectos</p>
                    </Link>
                    
                    {/* Puedes redirigir a donde quieras, ej: crear proyecto o perfil */}
                    <Link to='/dashboard-proyecto' className="btExCu">
                        <p className='txbtncu'>Empezar Ahora</p>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default LICP3;