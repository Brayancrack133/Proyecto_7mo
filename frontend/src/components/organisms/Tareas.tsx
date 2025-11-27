import React, { useEffect, useState } from 'react'
import TarjetaTarea, { TareaData } from './TarjetaTarea'
import './Tareas.css'
import { useUser } from '../../context/UserContext';
import ModalAvance from './ModalAvance';

interface Props {
    idProyecto?: string;
    esLider: boolean;
    idTareaInicial: number | null;
    limpiarSeleccion: () => void;
}

interface Miembro {
    id_usuario: number;
    nombre: string;
    apellido: string;
    rol_en_equipo?: string;
}

const Tareas: React.FC<Props> = ({ idProyecto, esLider, idTareaInicial, limpiarSeleccion }) => {
    const { usuario } = useUser();
    const [listaTareas, setListaTareas] = useState<TareaData[]>([]);

    // --- ESTADOS EXISTENTES ---
    const [mostrarModal, setMostrarModal] = useState(false); // Modal Crear Tarea
    const [miembros, setMiembros] = useState<Miembro[]>([]);
    const [idTareaSeleccionada, setIdTareaSeleccionada] = useState<number | null>(null); // Modal Avance

    // --- 🆕 ESTADOS NUEVOS PARA ASIGNACIÓN ---
    const [modalAsignar, setModalAsignar] = useState(false);
    const [idTareaAsignar, setIdTareaAsignar] = useState<number | null>(null);
    const [idMiembroAsignar, setIdMiembroAsignar] = useState("");

    // Estado para nueva tarea manual
    const [nuevaTarea, setNuevaTarea] = useState({
        titulo: '', descripcion: '', fecha_inicio: '', fecha_fin: '', id_responsable: ''
    });

    // 1. CARGAR TAREAS
    const cargarTareas = () => {
        if (idProyecto) {
            fetch(`http://localhost:3000/api/tareas/${idProyecto}`)
                .then(res => res.ok ? res.json() : [])
                .then(data => Array.isArray(data) ? setListaTareas(data) : setListaTareas([]))
                .catch(err => console.error(err));
        }
    };

    // 2. CARGAR MIEMBROS (Reutilizable)
    const cargarMiembros = () => {
        if (idProyecto) {
            fetch(`http://localhost:3000/api/proyecto/${idProyecto}/miembros`)
                .then(res => res.json())
                .then(data => setMiembros(data))
                .catch(err => console.error("Error cargando miembros", err));
        }
    };

    useEffect(() => {
        cargarTareas();
    }, [idProyecto]);

    // Efecto para abrir modal inicial si viene por URL
    useEffect(() => {
        if (idTareaInicial) {
            setIdTareaSeleccionada(idTareaInicial);
            limpiarSeleccion();
        }
    }, [idTareaInicial]);

    // --- HANDLERS EXISTENTES ---
    const handleAbrirModalCrear = () => {
        setMostrarModal(true);
        cargarMiembros();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setNuevaTarea({ ...nuevaTarea, [e.target.name]: e.target.value });
    };

    const handleSubmitCrear = (e: React.FormEvent) => {
        e.preventDefault();
        if (!idProyecto) return;
        const tareaParaEnviar = { ...nuevaTarea, id_proyecto: idProyecto };

        fetch('http://localhost:3000/api/tareas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tareaParaEnviar)
        })
        .then(res => {
            if (res.ok) {
                alert("✅ Tarea creada con éxito");
                setMostrarModal(false);
                cargarTareas();
                setNuevaTarea({ titulo: '', descripcion: '', fecha_inicio: '', fecha_fin: '', id_responsable: '' });
            } else {
                alert("❌ Error al crear tarea");
            }
        })
        .catch(err => console.error(err));
    };

    // --- 🆕 HANDLERS PARA ASIGNAR (Lógica nueva) ---
    
    // 1. Abrir el modal cuando clickean "Asignar" en la tarjeta
    const handleAbrirAsignar = (idTarea: number) => {
        setIdTareaAsignar(idTarea); // Guardamos qué tarea estamos editando
        setModalAsignar(true);      // Abrimos modal visual
        cargarMiembros();           // Aseguramos tener la lista de gente
        setIdMiembroAsignar("");    // Limpiamos selección previa
    };

    // 2. Guardar la asignación en el Backend
    const handleGuardarAsignacion = () => {
        if (!idTareaAsignar || !idMiembroAsignar) {
            alert("Selecciona un miembro por favor");
            return;
        }

        fetch(`http://localhost:3000/api/tareas/${idTareaAsignar}/asignar`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_usuario: idMiembroAsignar })
        })
        .then(res => {
            if (res.ok) {
                alert("✅ Tarea asignada correctamente");
                setModalAsignar(false); // Cerrar modal
                cargarTareas();         // Recargar lista para ver el cambio (foto del usuario)
            } else {
                alert("❌ Error al asignar");
            }
        })
        .catch(err => console.error(err));
    };

    return (
        <>
            <div className='asigtar'>
                <p className='titasig'>Asignar tareas</p>
                <p className='descriasig'>Gestiona tareas, documentos y comunicación del equipo</p>
            </div>

            <div className='apartoptn'>
                <p className='txtapartoptn'>Gestión de tareas</p>
                {esLider && (
                    <button className='agrebuttnoptn' onClick={handleAbrirModalCrear}>
                        <img className='plustarbutoptn' src="/agregar.png" alt="Agregar" />
                        <p className='agretxtbutoptn'>Nueva Tarea</p>
                    </button>
                )}
            </div>

            {/* LISTA DE TARJETAS */}
            <div className='containerproy'>
                {listaTareas.map(tarea => (
                    <TarjetaTarea
                        key={tarea.id_tarea}
                        tarea={tarea}
                        puedeEditar={esLider || tarea.id_responsable === (usuario as any)?.id}
                        // Click en la tarjeta -> Ver detalle/avance
                        onSeleccionar={(t) => setIdTareaSeleccionada(t.id_tarea)}
                        // 🆕 Click en botón azul -> Asignar miembro (Solo líderes deberían ver esto o todos, depende tu regla)
                        onAsignar={handleAbrirAsignar} 
                    />
                ))}
            </div>

            {/* ================= MODAL 1: CREAR NUEVA TAREA (Manual) ================= */}
            {mostrarModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Nueva Tarea</h3>
                        <form onSubmit={handleSubmitCrear}>
                            <input type="text" name="titulo" placeholder="Título" required value={nuevaTarea.titulo} onChange={handleChange} />
                            <textarea name="descripcion" placeholder="Descripción" required value={nuevaTarea.descripcion} onChange={handleChange} />
                            <div className="fechas-row">
                                <div><label>Inicio:</label><input type="date" name="fecha_inicio" required value={nuevaTarea.fecha_inicio} onChange={handleChange} /></div>
                                <div><label>Fin:</label><input type="date" name="fecha_fin" required value={nuevaTarea.fecha_fin} onChange={handleChange} /></div>
                            </div>
                            <label>Asignar a:</label>
                            <select name="id_responsable" required value={nuevaTarea.id_responsable} onChange={handleChange}>
                                <option value="">-- Seleccionar --</option>
                                {miembros.map(m => <option key={m.id_usuario} value={m.id_usuario}>{m.nombre} {m.apellido}</option>)}
                            </select>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setMostrarModal(false)} className="btn-cancelar">Cancelar</button>
                                <button type="submit" className="btn-guardar">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ================= 🆕 MODAL 2: ASIGNAR TAREA (IA) ================= */}
            {modalAsignar && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '400px' }}>
                        <h3>👤 Asignar Responsable</h3>
                        <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                            Selecciona quién se encargará de esta tarea.
                        </p>
                        
                        <label>Miembro del equipo:</label>
                        <select 
                            style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #ccc' }}
                            value={idMiembroAsignar}
                            onChange={(e) => setIdMiembroAsignar(e.target.value)}
                        >
                            <option value="">-- Seleccionar --</option>
                            {miembros.map(m => (
                                <option key={m.id_usuario} value={m.id_usuario}>
                                    {m.nombre} {m.apellido} {m.rol_en_equipo ? `(${m.rol_en_equipo})` : ''}
                                </option>
                            ))}
                        </select>

                        <div className="modal-actions">
                            <button type="button" onClick={() => setModalAsignar(false)} className="btn-cancelar">Cancelar</button>
                            <button type="button" onClick={handleGuardarAsignacion} className="btn-guardar">Confirmar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= MODAL 3: VER/SUBIR AVANCE ================= */}
            {idTareaSeleccionada && (
                <ModalAvance
                    idTarea={idTareaSeleccionada}
                    esLider={esLider}
                    onClose={() => setIdTareaSeleccionada(null)}
                />
            )}
        </>
    )
}

export default Tareas