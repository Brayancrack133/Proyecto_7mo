// src/components/templates/ContPlanificacion.tsx
import React from 'react'
import { useParams } from 'react-router-dom' 
import Header from '../organisms/Head'
import Sidebar from '../organisms/Sidebar'
import Planificacion from '../organisms/Planificacion'
import './Contenido.css' 

const ContPlanificacion = () => {
    // 1. Aquí ya tienes el ID (ej: "2")
    const { id } = useParams(); 

    return (
        <div className="inicio-page">
            <Header />
            <div className="contnt">
                <Sidebar />
                
                {/* --- CAMBIO AQUÍ --- */}
                {/* Le pasamos el ID al componente Planificación */}
                <Planificacion idProyecto={id} /> 
                
            </div>
        </div>
    )
}

export default ContPlanificacion