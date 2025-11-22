import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import TarjetaDocum from './TarjetaDocum';
import './TarjetaDocum.css'; // Importamos los estilos

// Recibimos props para saber de qué proyecto cargar
interface Props {
    idProyecto?: string;
    esLider: boolean;
}

const Documentos: React.FC<Props> = ({ idProyecto, esLider }) => {
    const { usuario } = useUser();
    const [docs, setDocs] = useState<any[]>([]);

    // Estados para subir archivo
    const [mostrarModal, setMostrarModal] = useState(false);
    const [archivo, setArchivo] = useState<File | null>(null);
    const [descripcion, setDescripcion] = useState("");

    // Cargar documentos al iniciar
    const cargarDocs = () => {
        if (idProyecto) {
            fetch(`http://localhost:3000/api/documentos/proyecto/${idProyecto}`)
                .then(res => res.json())
                .then(data => setDocs(data))
                .catch(err => console.error(err));
        }
    };

    useEffect(() => {
        cargarDocs();
    }, [idProyecto]);

    // Función para subir
    const handleSubir = (e: React.FormEvent) => {
        e.preventDefault();
        if (!archivo || !usuario) return;

        const formData = new FormData();
        formData.append("archivo", archivo);
        formData.append("id_proyecto", idProyecto!);
        formData.append("id_usuario", usuario.id_usuario.toString());
        formData.append("comentario", descripcion);

        fetch('http://localhost:3000/api/documentos/general', { method: 'POST', body: formData })
            .then(res => {
                if (res.ok) {
                    alert("✅ Documento compartido");
                    setMostrarModal(false);
                    setArchivo(null);
                    setDescripcion("");
                    cargarDocs(); // Recargar la lista
                }
            });
    };

    // Función para borrar
    const handleBorrar = (idDoc: number) => {
        if (confirm("¿Estás seguro de eliminar este documento?")) {
            fetch(`http://localhost:3000/api/documentos/${idDoc}`, { method: 'DELETE' })
                .then(() => cargarDocs());
        }
    };

    return (
        <>
            <div className='asigtar'>
                <p className='titasig'>Gestión de documentos</p>
                <p className='descriasig'>Recursos oficiales compartidos por el líder del proyecto.</p>
            </div>

            <div className='apartoptn'>
                <p className='txtapartoptn'>Biblioteca del Proyecto</p>

                {/* SOLO EL LÍDER PUEDE VER EL BOTÓN DE SUBIR */}
                {esLider && (
                    <button className='agrebuttnoptn' onClick={() => setMostrarModal(true)}>
                        <img className='subirarch' src="/subida.png" alt="Agregar" />
                        <p className='agretxtbutoptn'>Subir documento</p>
                    </button>
                )}
            </div>

            {/* LISTA DE DOCUMENTOS */}

            <div className="containerproy">
                {docs.length === 0 && (
                    <p style={{ color: '#999', gridColumn: '1 / -1', textAlign: 'center' }}>
                        No hay documentos oficiales aún.
                    </p>
                )}

                {docs.map(doc => (
                    <TarjetaDocum
                        key={doc.id_doc}
                        doc={doc}
                        esLider={esLider}
                        onDelete={() => handleBorrar(doc.id_doc)}
                    />
                ))}
            </div>

            {/* MODAL PARA SUBIR (Reusamos estilos de tus modales anteriores) */}
            {mostrarModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Subir Recurso Oficial</h3>
                        <form onSubmit={handleSubir}>
                            <label>Archivo:</label>
                            <input type="file" required onChange={e => e.target.files && setArchivo(e.target.files[0])} />

                            <label>Descripción:</label>
                            <textarea
                                placeholder="Ej: Manual de Usuario v1.0"
                                value={descripcion}
                                onChange={e => setDescripcion(e.target.value)}
                                required
                            />

                            <div className="modal-actions">
                                <button type="button" className="btn-cancelar" onClick={() => setMostrarModal(false)}>Cancelar</button>
                                <button type="submit" className="btn-guardar">Compartir</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default Documentos;