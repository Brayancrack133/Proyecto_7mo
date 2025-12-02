import React from 'react';
import "./LICP.css"; // Usa el mismo CSS que arreglamos antes

const LICP2 = () => {
    return (
        <div className="lcont2">
            <div className="lcontimap2">
                {/* Imagen Principal de la sección */}
                <img
                    className="limagp2"
                    src="/Images/teams.jpg" // Usamos una de tus imágenes existentes
                    alt="Trabajo en Equipo"
                    width={500}
                    height={500}
                />
            </div>

            <div className="lconttext">
                <p className="ltitp2">
                    <span className="ltitnarncini">Conviértete en un</span>
                    <span className="ltitverdecini"> Líder Eficiente </span>
                    <span className="ltitnarncini">y lleva a tu equipo al éxito</span>
                </p>
                
                <div className="lcontima">
                    <img
                        className="limag"
                        src="/Images/central.jpg" 
                        alt="Centralizado"
                        width={500}
                        height={500}
                    />
                    <p className="ldesc">
                        Centraliza documentos, tareas y comunicaciones en un solo lugar.
                    </p>
                </div>

                <div className="lcontima">
                    <img
                        className="limag"
                        src="/Images/IAimagen.jpeg"
                        alt="Planificación"
                        width={500}
                        height={500}
                    />
                    <p className="ldesc">
                        Tú decides los plazos, la IA te ayuda a cumplirlos.
                    </p>
                </div>

                <div className="lcontima">
                    <img
                        className="limag"
                        src="/Images/Produc.jpeg"
                        alt="Productividad"
                        width={500}
                        height={500}
                    />
                    <p className="ldesc">
                        Olvídate del caos en correos y chats dispersos. Todo está aquí.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LICP2;