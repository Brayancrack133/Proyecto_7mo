import React from 'react';
import './TarjetaNotificacion.css';

interface Props {
    notificacion: {
        id_notificacion: number;
        contenido: string;
        fecha_creacion: string;
        tipo: string;
        es_leida: number;
        id_tarea?: number; // <--- Asegúrate de que esto esté aquí también
    };
    // 1. AQUÍ ESTÁ LA SOLUCIÓN: Agregamos onClick a la interface
    onClick: () => void;
}

// 2. Recibimos onClick en los argumentos
const TarjetaNotificacion: React.FC<Props> = ({ notificacion, onClick }) => {
    
    const getIcono = () => {
        switch(notificacion.tipo) {
            case 'Tarea Asignada': return '📝';
            case 'Entrega Realizada': return '🚀';
            case 'Nuevo Miembro': return '👋';
            default: return '🔔';
        }
    };

    const fecha = new Date(notificacion.fecha_creacion).toLocaleDateString() + ' ' + new Date(notificacion.fecha_creacion).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    return (
        <div 
            className={`card-noti ${notificacion.es_leida ? 'leida' : 'nueva'}`}
            // 3. Usamos la función aquí
            onClick={onClick}
            // Cursor de manito solo si hay tarea asociada
            style={{ cursor: notificacion.id_tarea ? 'pointer' : 'default' }}
        >
            <div className="noti-icon">
                {getIcono()}
            </div>
            <div className="noti-content">
                <p className="noti-text">{notificacion.contenido}</p>
                <span className="noti-date">{fecha}</span>
            </div>
            {!notificacion.es_leida && <div className="punto-azul"></div>}
        </div>
    );
};

export default TarjetaNotificacion;