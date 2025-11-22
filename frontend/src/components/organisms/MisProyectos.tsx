import React, { useEffect, useState } from 'react';
import './MisProyectos.css';
import TarjetaProyecto from '../organisms/TarjetaProyecto';
import { useUser } from '../../context/UserContext';

interface Proyecto {
    id_proyecto: number;
    nombre: string;
    descripcion: string;
    fecha_inicio: string;
    fecha_fin: string | null;
    rol: string;
    nombre_equipo: string;
    nombre_jefe?: string; // Opcional para la lista de "unirse"
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

    // --- CARGAR MIS PROYECTOS ---
    const cargarMisProyectos = () => {
        if (usuario) {
            fetch(`http://localhost:3000/api/mis-proyectos/${usuario.id_usuario}`)
                .then(res => res.ok ? res.json() : [])
                .then(data => setProyectos(Array.isArray(data) ? data : []))
                .catch(err => console.error(err));
        }
    };

    useEffect(() => { cargarMisProyectos(); }, [usuario]);

    // --- LÓGICA CREAR PROYECTO ---
    const handleCrear = (e: React.FormEvent) => {
        e.preventDefault();
        if (!usuario) return;

        fetch('http://localhost:3000/api/proyectos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...nuevoProyecto, id_usuario: usuario.id_usuario })
        }).then(res => {
            if (res.ok) {
                alert("✅ Proyecto creado exitosamente");
                setModalCrear(false);
                cargarMisProyectos(); // Recargar la lista
                setNuevoProyecto({ nombre: '', descripcion: '', fecha_inicio: '', fecha_fin: '' });
            }
        });
    };

    // --- LÓGICA UNIRSE (Cargar lista) ---
    const abrirModalUnirse = () => {
        setModalUnirse(true);
        if (usuario) {
            fetch(`http://localhost:3000/api/proyectos/otros/${usuario.id_usuario}`)
                .then(res => res.json())
                .then(data => setProyectosDisponibles(data));
        }
    };

    // --- LÓGICA SOLICITAR UNIÓN ---
    const solicitarUnion = (idProyecto: number) => {
        if (!usuario) return;
        fetch('http://localhost:3000/api/proyectos/solicitar-union', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_proyecto: idProyecto, id_usuario_solicitante: usuario.id_usuario })
        }).then(res => {
            if (res.ok) {
                alert("📩 Solicitud enviada al líder del proyecto");
                setModalUnirse(false);
            }
        });
    };

    if (isLoading) return <div style={{ color: 'white' }}>Cargando...</div>;

    return (
        <div className='contplancom'>
            <div className='asigtar'>
                <p className='titasig'>Mis Proyectos</p>
                <p className='descriasig'>Proyectos en los que participas como líder o integrante.</p>
            </div>

            <div className='apartoptn'>
                <div className='opcionesproyecto'>
                    <button className='agrebuttnoptn' onClick={() => setModalCrear(true)}>
                        <img className='plustarbutoptn' src="/agregar.png" alt="Agregar" />
                        <p className='agretxtbutoptn'>Nuevo Proyecto</p>
                    </button>
                    <button className='agrebuttnoptn' onClick={abrirModalUnirse}>
                        <img className='plustarbutoptn' src="/equipo.png" alt="Agregar" />
                        <p className='agretxtbutoptn'>Unirse a proyecto</p>
                    </button>
                </div>
            </div>

            <div className='containerproy'>
                {proyectos.length === 0 && <p style={{ color: '#ccc' }}>No tienes proyectos asignados.</p>}
                {proyectos.map(proy => <TarjetaProyecto key={proy.id_proyecto} proyecto={proy} />)}
            </div>

            {/* === MODAL CREAR PROYECTO === */}
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

            {/* === MODAL UNIRSE A PROYECTO === */}
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
                                        <button className="btn-solicitar" onClick={() => solicitarUnion(p.id_proyecto)}>
                                            Solicitar
                                        </button>
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