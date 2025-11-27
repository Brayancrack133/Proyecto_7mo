import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import './Tareas.css'; // Reusamos los estilos del modal

interface Props {
    idTarea: number;
    esLider: boolean; // Para saber si mostramos historial
    onClose: () => void;
}

const ModalAvance: React.FC<Props> = ({ idTarea, esLider, onClose }) => {
    const { usuario } = useUser();

    // Estados internos
    const [tareaInfo, setTareaInfo] = useState<any>(null);
    const [documentosAdjuntos, setDocumentosAdjuntos] = useState<any[]>([]);
    const [archivo, setArchivo] = useState<File | null>(null);
    const [comentario, setComentario] = useState("");

    // 1. Cargar Info de la Tarea y Documentos al abrir
    useEffect(() => {
        if (idTarea) {
            // Cargar detalles (Título, descripción)
            fetch(`http://localhost:3000/api/tarea/${idTarea}`)
                .then(res => res.json())
                .then(data => setTareaInfo(data));

            // Cargar documentos
            fetch(`http://localhost:3000/api/tareas/${idTarea}/documentos`)
                .then(res => res.json())
                .then(data => setDocumentosAdjuntos(data));
        }
    }, [idTarea]);

    // 2. Subir Avance
    const handleSubirAvance = (e: React.FormEvent) => {
        e.preventDefault();
        if (!archivo || !usuario) return;

        const formData = new FormData();
        formData.append("archivo", archivo);
        formData.append("id_tarea", idTarea.toString());
        formData.append("id_usuario", String(miId));
         formData.append("comentario", comentario);

        fetch('http://localhost:3000/api/tareas/subir-avance', { method: 'POST', body: formData })
            .then(res => {
                if (res.ok) {
                    alert("✅ Avance subido");
                    // Recargar documentos sin cerrar
                    fetch(`http://localhost:3000/api/tareas/${idTarea}/documentos`)
                        .then(res => res.json())
                        .then(data => setDocumentosAdjuntos(data));
                    setArchivo(null);
                    setComentario("");
                }
            });
    };

    if (!tareaInfo) return null; // Cargando...

    // 1. Obtenemos el ID real del usuario logueado
    const miId = (usuario as any)?.id || usuario?.id_usuario;

    // 2. Comparamos con seguridad (String vs String)
    const soyResponsable = String(miId) === String(tareaInfo.id_responsable);

    const hayArchivos = documentosAdjuntos.length > 0;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3 style={{ marginBottom: '5px' }}>{tareaInfo.titulo}</h3>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px', borderLeft: '3px solid #2563eb', paddingLeft: '10px' }}>
                    {tareaInfo.descripcion}
                </p>

                {(esLider || hayArchivos) && (
                    <div style={{ marginBottom: '20px', background: '#f0f4f8', padding: '15px', borderRadius: '8px' }}>
                        <h4 style={{ fontSize: '14px', marginBottom: '10px', color: '#333' }}>📂 Archivos Entregados:</h4>
                        {!hayArchivos ? <p style={{ fontSize: '12px', color: '#999' }}>No hay archivos aún.</p> : (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {documentosAdjuntos.map((doc: any) => (
                                    <li key={doc.id_doc} style={{ marginBottom: '15px', background: 'white', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                            <span style={{ fontWeight: 'bold', fontSize: '13px' }}>{doc.usuario_nombre}:</span>
                                            <span style={{ fontSize: '10px', color: '#aaa' }}>{new Date(doc.fecha_subida).toLocaleDateString()}</span>
                                        </div>
                                        <a href={`http://localhost:3000/${doc.url}`} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'none', display: 'block', fontSize: '14px' }}>📄 {doc.nombre_archivo}</a>
                                        {doc.comentario && <div style={{ background: '#fffde7', padding: '5px', marginTop: '5px', borderRadius: '4px', fontSize: '12px', fontStyle: 'italic' }}>"{doc.comentario}"</div>}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {soyResponsable ? (
                    <form onSubmit={handleSubirAvance}>
                        <h4 style={{ fontSize: '14px', marginBottom: '10px', color: '#333' }}>📤 Subir Nuevo Avance:</h4>
                        <input type="file" onChange={(e) => e.target.files && setArchivo(e.target.files[0])} />
                        <textarea placeholder="Comentario..." value={comentario} onChange={(e) => setComentario(e.target.value)} style={{ width: '100%', marginTop: '10px', padding: '8px', border: '1px solid #ccc' }} />
                        <div className="modal-actions" style={{ marginTop: '15px' }}>
                            <button type="button" className="btn-cancelar" onClick={onClose}>Cerrar</button>
                            {archivo && <button type="submit" className="btn-guardar">Enviar</button>}
                        </div>
                    </form>
                ) : (
                    <div className="modal-actions"><button type="button" className="btn-cancelar" onClick={onClose}>Cerrar Revisión</button></div>
                )}
            </div>
        </div>
    );
};

export default ModalAvance;