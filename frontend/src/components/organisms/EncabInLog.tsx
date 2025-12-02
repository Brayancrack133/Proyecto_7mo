import React from "react";
import "./EncabInLog.css"; // Asegúrate de crear este archivo (paso 2)

const EncabInLog = () => {
    return (
        <div className='inlog1'>
            <div className="inlog2">
                {/* Etiqueta superior */}
                <div className="inlog3">
                    <p className="inlog4">Planificación Inteligente</p>
                </div>
                
                {/* Título Principal */}
                <p className="inlog5">
                    <span className="inlog6">Domina tus Proyectos.</span>
                    <br />
                    <span className="inlog7">
                        Planificación fácil, segura y sin complicaciones.
                    </span>
                </p>
                
                {/* Subtítulo */}
                <div className="inlog8">
                    <p className="inlog9">Herramientas colaborativas para equipos ágiles</p>
                </div>
            </div>
            
            {/* Imagen Principal */}
            <div className="inlog10">
                <img
                    className="imgnpa"
                    src="/Images/prinimg.png" // Usamos la imagen que ya tienes
                    alt="Dashboard Future Plan"
                />
            </div>
        </div>
    )
}

export default EncabInLog;