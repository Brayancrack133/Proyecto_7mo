import React, { useEffect, useState } from 'react';
import './MisProyectos.css';
import TarjetaProyecto from '../organisms/TarjetaProyecto';
import { useUser } from '../../context/UserContext';

// Interfaz local para los proyectos que recibimos
interface Proyecto {
    id_proyecto: number;
    nombre: string;
    descripcion: string;
    fecha_inicio: string;
    fecha_fin: string | null;
    rol: string;
    nombre_equipo: string;
    nombre_jefe?: string;
}

const MisProyectos = () => {
    const [proyectos, setProyectos] = useState<Proyecto[]>([]);
    const { usuario, isLoading } = useUser();

    // Estados para Modales
    const [modalCrear, setModalCrear] = useState(false);
    const [modalUnirse, setModalUnirse] = useState(false);

    // Estados para formularios
    const [nuevoProyecto, setNuevoProyecto] = useState({ nombre: '', descripcion: '', fecha_inicio: '', fecha_fin: '' });
    const [proyectosDisponibles, setProyectosDisponibles] = useState<Proyecto[]>([]);

    // --- FUNCIÓN DE CARGA ---
    const cargarMisProyectos = (id: number) => {
        fetch(`http://localhost:3000/api/mis-proyectos/${id}`)
            .then(res => {
                if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
                return res.json();
            })
            .then(data => setProyectos(Array.isArray(data) ? data : []))
            .catch(err => console.error("Error al cargar proyectos:", err));
    };

    // --- EFECTO PRINCIPAL (Protegido) ---
    useEffect(() => {
        // CORRECCIÓN: Usamos 'usuario.id' porque así se llama en tu LocalStorage
        if (!isLoading && usuario?.id) {
            cargarMisProyectos(usuario.id);
        }
    }, [usuario, isLoading]);

    // --- CREAR PROYECTO ---
    const handleCrear = (e: React.FormEvent) => {
        e.preventDefault();
        if (!usuario?.id) return;

        fetch('http://localhost:3000/api/proyectos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...nuevoProyecto,
                // IMPORTANTE: El backend espera 'id_jefe' para crear un proyecto
                id_jefe: usuario.id,
                // Enviamos también id_usuario por si acaso tu backend antiguo lo requiere
                id_usuario: usuario.id 
            })
        }).then(res => {
            if (res.ok) {
                alert("✅ Proyecto creado exitosamente");
                setModalCrear(false);
                cargarMisProyectos(usuario.id); // Recargar lista
                setNuevoProyecto({ nombre: '', descripcion: '', fecha_inicio: '', fecha_fin: '' });
            } else {
                alert("❌ Error al crear proyecto. Revisa la consola del backend.");
            }
        }).catch(err => console.error("Error creando proyecto:", err));
    };

    // --- ABRIR MODAL UNIRSE ---
    const abrirModalUnirse = () => {
        setModalUnirse(true);
        if (usuario?.id) {
            fetch(`http://localhost:3000/api/proyectos/otros/${usuario.id}`)
                .then(res => res.json())
                .then(data => setProyectosDisponibles(Array.isArray(data) ? data : []))
                .catch(err => console.error("Error cargando proyectos disponibles:", err));
        }
    };

    // --- SOLICITAR UNIÓN ---
    const solicitarUnion = (idProyecto: number) => {
        if (!usuario?.id) return;
        
        fetch('http://localhost:3000/api/proyectos/solicitar-union', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                id_proyecto: idProyecto, 
                id_usuario_solicitante: usuario.id // Usamos usuario.id
            })
        }).then(res => {
            if (res.ok) {
                alert("📩 Solicitud enviada al líder");
                setModalUnirse(false);
            } else {
                alert("Error al enviar solicitud");
            }
        }).catch(err => console.error(err));
    };

    // --- RENDERIZADO CONDICIONAL ---
    if (isLoading) return <div style={{ color: 'white', padding: '20px' }}>Cargando sesión...</div>;

    // CORRECCIÓN: Validamos con usuario.id
    if (!usuario?.id) return <div style={{ color: '#ff6b6b', padding: '20px', fontWeight:'bold' }}>⚠️ No hay sesión activa. Por favor inicia sesión nuevamente.</div>;

    return (
        <div className='contplancom'>
            <div className='asigtar'>
                <p className='titasig'>Mis Proyectos</p>
                <p className='descriasig'>Proyectos en los que participas.</p>
            </div>

            <div className='apartoptn'>
                <div className='opcionesproyecto'>
                    <button className='agrebuttnoptn' onClick={() => setModalCrear(true)}>
                        <img className='plustarbutoptn' src="/agregar.png" alt="Crear" />
                        <p className='agretxtbutoptn'>Nuevo Proyecto</p>
                    </button>
                    <button className='agrebuttnoptn' onClick={abrirModalUnirse}>
                        <img className='plustarbutoptn' src="/equipo.png" alt="Unirse" />
                        <p className='agretxtbutoptn'>Unirse a proyecto</p>
                    </button>
                </div>
            </div>

            <div className='containerproy'>
                {proyectos.length === 0 && <p style={{ color: '#ccc', fontStyle:'italic' }}>No tienes proyectos asignados aún.</p>}
                {proyectos.map(proy => <TarjetaProyecto key={proy.id_proyecto} proyecto={proy} />)}
            </div>

            {/* === MODAL CREAR === */}
            {modalCrear && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>🚀 Crear Nuevo Proyecto</h3>
                        <form onSubmit={handleCrear}>
                            <label>Nombre del Proyecto</label>
                            <input type="text" required value={nuevoProyecto.nombre} onChange={e => setNuevoProyecto({...nuevoProyecto, nombre: e.target.value})} />
                            
                            <label>Descripción</label>
                            <textarea required value={nuevoProyecto.descripcion} onChange={e => setNuevoProyecto({...nuevoProyecto, descripcion: e.target.value})} />
                            
                            <div style={{display:'flex', gap:'10px'}}>
                                <div style={{flex:1}}>
                                    <label>Inicio</label>
                                    <input type="date" required value={nuevoProyecto.fecha_inicio} onChange={e => setNuevoProyecto({...nuevoProyecto, fecha_inicio: e.target.value})} />
                                </div>
                                <div style={{flex:1}}>
                                    <label>Fin (Estimado)</label>
                                    <input type="date" required value={nuevoProyecto.fecha_fin} onChange={e => setNuevoProyecto({...nuevoProyecto, fecha_fin: e.target.value})} />
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancelar" onClick={() => setModalCrear(false)}>Cancelar</button>
                                <button type="submit" className="btn-guardar">Crear Proyecto</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* === MODAL UNIRSE === */}
            {modalUnirse && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>🤝 Unirse a un Proyecto</h3>
                        <p style={{fontSize:'14px', color:'#666'}}>Selecciona un proyecto para enviar solicitud:</p>
                        <ul className="lista-join">
                            {proyectosDisponibles.length === 0 ? (
                                <p style={{textAlign:'center', color:'#999'}}>No hay proyectos disponibles.</p>
                            ) : (
                                proyectosDisponibles.map(p => (
                                    <li key={p.id_proyecto} className="item-join">
                                        <div>
                                            <strong>{p.nombre}</strong>
                                            <br/><span style={{fontSize:'12px', color:'#888'}}>Líder: {p.nombre_jefe}</span>
                                        </div>
                                        <button type="button" className="btn-solicitar" onClick={() => solicitarUnion(p.id_proyecto)}>Solicitar</button>
                                    </li>
                                ))
                            )}
                        </ul>
                        <div className="modal-actions">
                            <button type="button" className="btn-cancelar" onClick={() => setModalUnirse(false)}>Cerrar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MisProyectos;