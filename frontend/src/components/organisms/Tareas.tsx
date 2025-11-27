import React, { useEffect, useState } from 'react'
import TarjetaTarea, { TareaData } from './TarjetaTarea'
import './Tareas.css' // <--- Asegúrate de crear este archivo CSS (ver paso 3)
import { useUser } from '../../context/UserContext';
import ModalAvance from './ModalAvance'; // <--- 1. IMPORTAR EL NUEVO MODAL

interface Props {
    idProyecto?: string;
    esLider: boolean;
    // 1. NUEVAS PROPS
    idTareaInicial: number | null;
    limpiarSeleccion: () => void;
}

interface Miembro {
    id_usuario: number;
    nombre: string;
    apellido: string;
}

const Tareas: React.FC<Props> = ({ idProyecto, esLider, idTareaInicial, limpiarSeleccion }) => {
    const { usuario } = useUser();

    const [listaTareas, setListaTareas] = useState<TareaData[]>([]);

    // ESTADOS PARA EL MODAL Y FORMULARIO
    const [mostrarModal, setMostrarModal] = useState(false);
    const [miembros, setMiembros] = useState<Miembro[]>([]);


    const [tareaSeleccionada, setTareaSeleccionada] = useState<TareaData | null>(null);
    const [archivo, setArchivo] = useState<File | null>(null);
    const [comentario, setComentario] = useState("");
    const [idTareaSeleccionada, setIdTareaSeleccionada] = useState<number | null>(null);

    const handleClickTarjeta = (tarea: TareaData) => {
        setTareaSeleccionada(tarea);
        setArchivo(null);
        setComentario("");
        setDocumentosAdjuntos([]); // <--- Limpiamos
    };

    useEffect(() => {
        if (idTareaInicial) {
            setIdTareaSeleccionada(idTareaInicial); // Abrimos modal
            limpiarSeleccion();
        }
    }, [idTareaInicial]);



    const [documentosAdjuntos, setDocumentosAdjuntos] = useState<any[]>([]);

    // Efecto para cargar documentos cuando se abre una tarea
    useEffect(() => {
        if (tareaSeleccionada) {
            fetch(`http://localhost:3000/api/tareas/${tareaSeleccionada.id_tarea}/documentos`)
                .then(res => res.json())
                .then(data => setDocumentosAdjuntos(data))
                .catch(err => console.error("Error cargando docs:", err));
        }
    }, [tareaSeleccionada]);

    useEffect(() => {
        if (idTareaInicial && listaTareas.length > 0) {
            // Buscamos la tarea en la lista que acabamos de descargar
            const tareaEncontrada = listaTareas.find(t => t.id_tarea === idTareaInicial);

            if (tareaEncontrada) {
                console.log("🚀 Abriendo automáticamente:", tareaEncontrada.titulo);
                setTareaSeleccionada(tareaEncontrada); // Esto abre el Modal de Avance
                // OJO: Si quieres abrir el de EDICIÓN (si eres líder), la lógica sería distinta,
                // pero por ahora asumimos que es para ver/subir avance.

                limpiarSeleccion(); // Limpiamos para que no se vuelva a abrir sola si recargamos
            }
        }
    }, [listaTareas, idTareaInicial]);

    const handleSubirAvance = (e: React.FormEvent) => {
        e.preventDefault();
        if (!archivo || !tareaSeleccionada || !usuario) return;

        const formData = new FormData();
        formData.append("archivo", archivo);
        formData.append("id_tarea", tareaSeleccionada.id_tarea.toString());
        formData.append("id_usuario", usuario.id_usuario.toString());
        formData.append("comentario", comentario);

        fetch('http://localhost:3000/api/tareas/subir-avance', {
            method: 'POST',
            body: formData // <--- No lleva Content-Type manual, fetch lo pone solo
        })
            .then(res => {
                if (res.ok) {
                    alert("✅ Avance subido correctamente");
                    setTareaSeleccionada(null); // Cierra el modal
                } else {
                    alert("❌ Error al subir avance");
                }
            })
            .catch(err => console.error(err));
    };

    const [nuevaTarea, setNuevaTarea] = useState({
        titulo: '',
        descripcion: '',
        fecha_inicio: '',
        fecha_fin: '',
        id_responsable: ''
    });

    // 1. Cargar Tareas (Tu lógica original)
    const cargarTareas = () => {
        if (idProyecto) {
            fetch(`http://localhost:3000/api/tareas/${idProyecto}`)
                .then(res => res.ok ? res.json() : [])
                .then(data => Array.isArray(data) ? setListaTareas(data) : setListaTareas([]))
                .catch(err => console.error(err));
        }
    };

    useEffect(() => {
        cargarTareas();
    }, [idProyecto]);

    // 2. Función para abrir modal y cargar miembros del equipo
    const handleAbrirModal = () => {
        setMostrarModal(true);
        if (idProyecto) {
            fetch(`http://localhost:3000/api/proyecto/${idProyecto}/miembros`)
                .then(res => res.json())
                .then(data => setMiembros(data))
                .catch(err => console.error("Error cargando miembros", err));
        }
    };

    // 3. Manejar cambios en los inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setNuevaTarea({
            ...nuevaTarea,
            [e.target.name]: e.target.value
        });
    };

    // 4. Enviar formulario al Backend
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!idProyecto) return;

        // Preparamos el objeto a enviar
        const tareaParaEnviar = {
            ...nuevaTarea,
            id_proyecto: idProyecto
        };

        fetch('http://localhost:3000/api/tareas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tareaParaEnviar)
        })
            .then(res => {
                if (res.ok) {
                    alert("✅ Tarea creada con éxito");
                    setMostrarModal(false); // Cerramos modal
                    cargarTareas(); // Recargamos la lista para ver la nueva tarea
                    // Limpiamos formulario
                    setNuevaTarea({ titulo: '', descripcion: '', fecha_inicio: '', fecha_fin: '', id_responsable: '' });
                } else {
                    alert("❌ Error al crear tarea");
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
                    <button className='agrebuttnoptn' onClick={handleAbrirModal}>
                        <img className='plustarbutoptn' src="/agregar.png" alt="Agregar" />
                        <p className='agretxtbutoptn'>Nueva Tarea</p>
                    </button>
                )}
            </div>

            {/* Al mapear las tarjetas: */}
            <div className='containerproy'>
                {/* ... */}
                {listaTareas.map(tarea => (
                    <TarjetaTarea
                        key={tarea.id_tarea}
                        tarea={tarea}
                        // CORRECCIÓN: Usamos (usuario as any) para apagar la alerta roja
                        // Y usamos String() para comparar texto con texto y evitar errores de tipos
                        puedeEditar={
                            esLider ||
                            String(tarea.id_responsable) === String((usuario as any)?.id) ||
                            String(tarea.id_responsable) === String((usuario as any)?.id_usuario)
                        }
                        onSeleccionar={(t) => setIdTareaSeleccionada(t.id_tarea)}
                    />
                ))}
            </div>

            {/* ================= MODAL 1: CREAR NUEVA TAREA ================= */}
            {mostrarModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Nueva Tarea</h3>
                        <form onSubmit={handleSubmit}>
                            <input className='shet'
                                type="text" name="titulo" placeholder="Título de la tarea" required
                                value={nuevaTarea.titulo} onChange={handleChange}
                            />
                            <textarea className='shet'
                                name="descripcion" placeholder="Descripción" required
                                value={nuevaTarea.descripcion} onChange={handleChange}
                            />
                            <div className="fechas-row">
                                <div>
                                    <label>Inicio:</label>
                                    <input className='shet' type="date" name="fecha_inicio" required value={nuevaTarea.fecha_inicio} onChange={handleChange} />
                                </div>
                                <div>
                                    <label>Fin:</label>
                                    <input className='shet' type="date" name="fecha_fin" required value={nuevaTarea.fecha_fin} onChange={handleChange} />
                                </div>
                            </div>

                            <label>Asignar a:</label>
                            <select className='shet' name="id_responsable" required value={nuevaTarea.id_responsable} onChange={handleChange}>
                                <option value="">-- Seleccionar Miembro --</option>
                                {miembros.map(m => (
                                    <option key={m.id_usuario} value={m.id_usuario}>
                                        {m.nombre} {m.apellido}
                                    </option>
                                ))}
                            </select>

                            <div className="modal-actions">
                                <button type="button" onClick={() => setMostrarModal(false)} className="btn-cancelar">Cancelar</button>
                                <button type="submit" className="btn-guardar">Guardar Tarea</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}



            {/* 3. === AQUÍ USAMOS EL NUEVO COMPONENTE === */}
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