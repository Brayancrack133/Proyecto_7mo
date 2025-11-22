import React from 'react';
import './TarjetaDocum.css';

interface Props {
    doc: any;
    esLider: boolean;
    onDelete: () => void;
}

const TarjetaDocum: React.FC<Props> = ({ doc, esLider, onDelete }) => {
    return (
        
        <div className='tarjeta-doc'>
            {/* Botón borrar solo para líder */}
            {esLider && (
                <button className="btn-delete-doc" onClick={onDelete} title="Eliminar documento">×</button>
            )}
            
            <div className="doc-icon">📄</div>
            
            <div className="doc-name" title={doc.nombre_archivo}>
                {doc.nombre_archivo}
            </div>
            
            <div className="doc-meta">
                Subido por: {doc.nombre} <br/>
                {new Date(doc.fecha_subida).toLocaleDateString()}
            </div>
            
            <div className="doc-desc">
                {doc.comentario || "Sin descripción"}
            </div>

            <a 
                href={`http://localhost:3000/${doc.url}`} 
                target="_blank" 
                rel="noreferrer" 
                className="btn-download"
            >
                ⬇ Descargar
            </a>
        </div>
    )
}

export default TarjetaDocum;