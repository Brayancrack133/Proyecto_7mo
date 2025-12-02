import React from 'react';
import "./LICP.css";

const LICP1 = () => {
    return (
        <div className="lcont1">
            <div className="lconttext">
                <p className="ltxtgenini">
                    <span className="ltitverdecini">
                        Panel de Control Profesional: Gestiona tus 
                    </span>
                    <span className="ltitnarncini"> Proyectos</span>
                </p>
                
                <div className="lcontima">
                    <img className="limag" src="/Images/prinimg.png" alt="Gestión" />
                    <p className="ldesc">
                        Acceso centralizado a todos tus proyectos, equipos y cronogramas.
                    </p>
                </div>

                <div className="lcontima">
                    <img className="limag" src="/Images/teams.jpg" alt="Equipos" />
                    <p className="ldesc">
                        Comunicación en tiempo real con tu equipo sin salir de la plataforma.
                    </p>
                </div>

                <div className="lcontima">
                    <img className="limag" src="/Images/IAimagen.jpeg" alt="IA" />
                    <p className="ldesc">
                        Asistente inteligente para predecir plazos y detectar riesgos.
                    </p>
                </div>
            </div>

            <div className="lcontimagen">
                <div className="lcontimag2">
                    {/* Asegúrate de que estas imágenes existan o usa otras de /public */}
                    <img className="limag1" src="/Images/Produc.jpeg" alt="Dashboard" />
                    <img className="limag1" src="/Images/central.jpg" alt="Reportes" />
                </div>
            </div>
        </div>
    );
};

export default LICP1;