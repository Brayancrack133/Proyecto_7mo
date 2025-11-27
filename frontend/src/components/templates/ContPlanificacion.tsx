import React from 'react';
import { useParams } from 'react-router-dom';
import Planificacion from '../organisms/Planificacion';
import './Contenido.css'; // Asumiendo que usas estilos globales o similares

const ContPlanificacion = () => {
    // Obtenemos el ID del proyecto desde la URL (definido en AppRoutes como :id)
    const { id } = useParams<{ id: string }>();

    return (
        <div className='cont-planificacion-page' style={{ width: '100%', height: '100%' }}>
            {/* Pasamos el ID al componente que tiene toda la lógica de Tareas/Chat/etc */}
            <Planificacion idProyecto={id} />
        </div>
    );
};

export default ContPlanificacion;