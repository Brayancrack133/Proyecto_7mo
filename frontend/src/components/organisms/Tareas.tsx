import React, { useEffect, useState } from 'react'
import TarjetaTarea, { TareaData } from './TarjetaTarea'
import './Tareas.css'
import { useUser } from '../../context/UserContext';
import ModalAvance from './ModalAvance';
import ModalDesglose from './ModalDesglose';
import { desglosarTareaConIA } from '../../services/projectos_ia.service';

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

    // --- ESTADOS ---
    const [mostrarModal, setMostrarModal] = useState(false);
    const [miembros, setMiembros] = useState<Miembro[]>([]);
    const [idTareaSeleccionada, setIdTareaSeleccionada] = useState<number | null>(null);

    const [modalAsignar, setModalAsignar] = useState(false);
    const [idTareaAsignar, setIdTareaAsignar] = useState<number | null>(null);
    const [idMiembroAsignar, setIdMiembroAsignar] = useState("");

    // --- ESTADOS TASK BREAKER (IA) ---
    const [cargandoIA, setCargandoIA] = useState(false);
    const [modalDesglose, setModalDesglose] = useState(false);
    // IMPORTANTE: Ahora guardamos la tarea completa, no solo el título
    const [datosDesglose, setDatosDesglose] = useState<{ parentTask: TareaData, subs: any[] } | null>(null);

    // --- 🌳 ESTADO DEL ÁRBOL ---
    // Guarda los IDs de las tareas que el usuario ha expandido
    const [expandidos, setExpandidos] = useState<number[]>([]);

    const [nuevaTarea, setNuevaTarea] = useState({
        titulo: '', descripcion: '', fecha_inicio: '', fecha_fin: '', id_responsable: ''
    });

    // 1. CARGA DE DATOS
    const cargarTareas = () => {
        if (idProyecto) {
            fetch(`http://localhost:3000/api/tareas/${idProyecto}`)
                .then(res => res.ok ? res.json() : [])
                .then(data => {
                    // Ordenamos por ID para estabilidad visual
                    const ordenadas = Array.isArray(data) ? data.sort((a: any, b: any) => a.id_tarea - b.id_tarea) : [];
                    setListaTareas(ordenadas);
                })
                .catch(err => console.error(err));
        }
    };

    const cargarMiembros = () => {
        if (idProyecto) {
            fetch(`http://localhost:3000/api/proyecto/${idProyecto}/miembros`)
                .then(res => res.json())
                .then(data => setMiembros(data))
                .catch(err => console.error(err));
        }
    };

    useEffect(() => { cargarTareas(); }, [idProyecto]);

    useEffect(() => {
        if (idTareaInicial) {
            setIdTareaSeleccionada(idTareaInicial);
            limpiarSeleccion();
        }
    }, [idTareaInicial]);

    // 2. 🌲 MOTOR DE ÁRBOL (Transforma lista plana a jerárquica)
    const organizarTareasEnArbol = (tareas: TareaData[]) => {
        const mapa = new Map<number, TareaData>();
        const raices: TareaData[] = [];

        // Paso 1: Crear mapa y array de hijos vacío
        tareas.forEach(t => mapa.set(t.id_tarea, { ...t, subtareas: [] }));

        // Paso 2: Conectar hijos con padres
        tareas.forEach(t => {
            if (t.id_tarea_padre) {
                const padre = mapa.get(t.id_tarea_padre);
                if (padre) {
                    padre.subtareas!.push(mapa.get(t.id_tarea)!);
                } else {
                    // Si el padre no está en la lista actual (caso raro), lo tratamos como raíz
                    raices.push(mapa.get(t.id_tarea)!);
                }
            } else {
                raices.push(mapa.get(t.id_tarea)!);
            }
        });

        return raices;
    };

    const toggleExpandir = (id: number) => {
        setExpandidos(prev => 
            prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
        );
    };

    // 3. HANDLERS BÁSICOS (Crear manual, Asignar)
    const handleAbrirModalCrear = () => { setMostrarModal(true); cargarMiembros(); };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setNuevaTarea({ ...nuevaTarea, [e.target.name]: e.target.value });
    };

    const crearTareaEnBD = (tareaObj: any) => {
        if (!idProyecto) return;
        const payload = { ...tareaObj, id_proyecto: idProyecto };

        fetch('http://localhost:3000/api/tareas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => {
            if (res.ok) {
                if (mostrarModal) {
                    alert("✅ Tarea creada con éxito");
                    setMostrarModal(false);
                    setNuevaTarea({ titulo: '', descripcion: '', fecha_inicio: '', fecha_fin: '', id_responsable: '' });
                }
                cargarTareas();
            }
        })
        .catch(err => console.error(err));
    };

    const handleSubmitCrear = (e: React.FormEvent) => {
        e.preventDefault();
        crearTareaEnBD(nuevaTarea);
    };

    const handleAbrirAsignar = (idTarea: number) => {
        setIdTareaAsignar(idTarea);
        setModalAsignar(true);
        cargarMiembros();
        setIdMiembroAsignar("");
    };

    const handleGuardarAsignacion = () => {
        if (!idTareaAsignar || !idMiembroAsignar) { alert("Selecciona un miembro"); return; }
        fetch(`http://localhost:3000/api/tareas/${idTareaAsignar}/asignar`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_usuario: idMiembroAsignar })
        }).then(res => {
            if (res.ok) { alert("✅ Asignado"); setModalAsignar(false); cargarTareas(); }
        });
    };

    // 4. ✨ HANDLERS TASK BREAKER (IA & Árbol)
    
    const handleDesglosar = async (tarea: TareaData) => {
        setCargandoIA(true);
        try {
            const respuesta = await desglosarTareaConIA(tarea.titulo, tarea.descripcion);
            // Guardamos la tarea padre completa para usar su ID luego
            setDatosDesglose({ parentTask: tarea, subs: respuesta.subtareas });
            setModalDesglose(true);
        } catch (error) {
            alert("❌ Error consultando a la IA");
        } finally {
            setCargandoIA(false);
        }
    };

    const handleConfirmarDesglose = async (subtareasFinales: any[]) => {
        if (!datosDesglose) return;
        const idPadre = datosDesglose.parentTask.id_tarea; // ID para vincular

        let creadas = 0;
        const hoy = new Date().toISOString().split('T')[0];
        // Calculamos fecha fin (7 días)
        const fin = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        for (const sub of subtareasFinales) {
            const nueva = {
                titulo: sub.titulo,
                descripcion: `(IA) ${sub.descripcion}`,
                fecha_inicio: hoy,
                fecha_fin: fin,
                id_responsable: null,
                id_tarea_padre: idPadre // <--- ¡VINCULACIÓN JERÁRQUICA!
            };
            
            await fetch('http://localhost:3000/api/tareas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...nueva, id_proyecto: idProyecto })
            });
            creadas++;
        }

        // Auto-expandir al padre para ver la magia
        if (!expandidos.includes(idPadre)) {
            setExpandidos(prev => [...prev, idPadre]);
        }

        alert(`✅ Se han creado ${creadas} subtareas.`);
        setModalDesglose(false);
        setDatosDesglose(null);
        cargarTareas();
    };

    // 5. 🎨 RENDERIZADO RECURSIVO (El corazón visual)
    const renderTarea = (tarea: TareaData, nivel: number) => {
        const tieneHijos = tarea.subtareas && tarea.subtareas.length > 0;
        const estaExpandido = expandidos.includes(tarea.id_tarea);

        return (
            <React.Fragment key={tarea.id_tarea}>
                <TarjetaTarea
                    tarea={tarea}
                    puedeEditar={true}
                    onSeleccionar={(t) => setIdTareaSeleccionada(t.id_tarea)}
                    onAsignar={handleAbrirAsignar}
                    onDesglosar={handleDesglosar}
                    // 👇 ¡AQUÍ CONECTAMOS EL BOTÓN!
                    onEliminar={handleEliminarTarea}
                    // Props de Árbol
                    nivel={nivel}
                    esPadre={tieneHijos}
                    expandido={estaExpandido}
                    onToggleExpandir={() => toggleExpandir(tarea.id_tarea)}
                />
                
                {/* Recursividad: Si está expandido, renderizar hijos con nivel + 1 */}
                {tieneHijos && estaExpandido && (
                    <div className="subtareas-container">
                        {tarea.subtareas!.map(hija => renderTarea(hija, nivel + 1))}
                    </div>
                )}
            </React.Fragment>
        );
    };

    const handleEliminarTarea = (idTarea: number) => {
        fetch(`http://localhost:3000/api/tareas/${idTarea}`, {
            method: 'DELETE',
        })
        .then(res => {
            if (res.ok) {
                // Actualizamos la lista localmente para que sea rápido
                setListaTareas(prev => prev.filter(t => t.id_tarea !== idTarea));
                // Opcional: Recargar todo por seguridad
                cargarTareas(); 
            } else {
                alert("Error al eliminar");
            }
        })
        .catch(err => console.error(err));
    };
    // Procesamos la lista plana para convertirla en árbol antes de renderizar
    const tareasArbol = organizarTareasEnArbol(listaTareas);

    return (
        <>
            {/* LOADER PROFESIONAL */}
            {cargandoIA && (
                <div className="ai-loader-overlay">
                    <div className="ai-loader-content">
                        <h3 className="ai-loader-title">Analizando Requerimientos</h3>
                        <p className="ai-loader-subtitle">
                            El motor de IA está generando el desglose técnico de la tarea...
                        </p>
                        
                        <div className="ai-progress-track">
                            <div className="ai-progress-bar"></div>
                        </div>
                    </div>
                </div>
            )}

            <div className='asigtar'>
                <p className='titasig'>Planificación Inteligente</p>
                <p className='descriasig'>Gestiona y desglosa tareas complejas con ayuda de IA.</p>
            </div>

            <div className='apartoptn'>
                <p className='txtapartoptn'>Cronograma</p>
                <button className='agrebuttnoptn' onClick={handleAbrirModalCrear}>
                    <img className='plustarbutoptn' src="/agregar.png" alt="Agregar" />
                    <p className='agretxtbutoptn'>Nueva Tarea</p>
                </button>
            </div>

            {/* LISTA DE TAREAS (Renderizada como Árbol) */}
            <div className='containerproy' style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {tareasArbol.length > 0 ? (
                    tareasArbol.map(t => renderTarea(t, 0))
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                        <p>No hay tareas en este proyecto.</p>
                        <p style={{ fontSize: '14px' }}>Crea una nueva o usa el Arquitecto IA.</p>
                    </div>
                )}
            </div>

            {/* MODALES */}
            {mostrarModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Nueva Tarea</h3>
                        <form onSubmit={handleSubmitCrear}>
                            <input className='shet' type="text" name="titulo" placeholder="Título" required value={nuevaTarea.titulo} onChange={handleChange} />
                            <textarea className='shet' name="descripcion" placeholder="Descripción" required value={nuevaTarea.descripcion} onChange={handleChange} />
                            <div className="fechas-row">
                                <div><label>Inicio:</label><input className='shet' type="date" name="fecha_inicio" required value={nuevaTarea.fecha_inicio} onChange={handleChange} /></div>
                                <div><label>Fin:</label><input className='shet' type="date" name="fecha_fin" required value={nuevaTarea.fecha_fin} onChange={handleChange} /></div>
                            </div>
                            <label>Asignar a:</label>
                            <select className='shet' name="id_responsable" value={nuevaTarea.id_responsable} onChange={handleChange}>
                                <option value="">-- Sin Asignar --</option>
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

            {modalAsignar && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '400px' }}>
                        <h3>👤 Asignar Responsable</h3>
                        <label>Miembro del equipo:</label>
                        <select 
                            style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
                            value={idMiembroAsignar}
                            onChange={(e) => setIdMiembroAsignar(e.target.value)}
                        >
                            <option value="">-- Seleccionar --</option>
                            {miembros.map(m => (
                                <option key={m.id_usuario} value={m.id_usuario}>{m.nombre} {m.apellido}</option>
                            ))}
                        </select>
                        <div className="modal-actions">
                            <button type="button" onClick={() => setModalAsignar(false)} className="btn-cancelar">Cancelar</button>
                            <button type="button" onClick={handleGuardarAsignacion} className="btn-guardar">Confirmar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL IA (Task Breaker) */}
            {modalDesglose && datosDesglose && (
                <ModalDesglose 
                    tareaPadre={datosDesglose.parentTask.titulo}
                    subtareas={datosDesglose.subs}
                    onCerrar={() => setModalDesglose(false)}
                    onConfirmar={handleConfirmarDesglose}
                />
            )}

            {idTareaSeleccionada && (
                <ModalAvance
                    idTarea={idTareaSeleccionada}
                    esLider={true}
                    onClose={() => setIdTareaSeleccionada(null)}
                />
            )}
        </>
    )
}

export default Tareas