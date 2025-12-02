import React from 'react'
import './TarjetaTarea.css'

export interface TareaData {
    id_tarea: number;
    titulo: string;
    descripcion: string;
    fecha_inicio: string;
    fecha_fin: string;
    nombre_responsable?: string | null;
    apellido_responsable?: string | null;
    id_responsable?: number | null;
    id_proyecto?: number;
    id_tarea_padre?: number | null; 
    subtareas?: TareaData[]; 
}

interface Props {
    tarea: TareaData;
    puedeEditar: boolean;
    onSeleccionar: (tarea: TareaData) => void; 
    onAsignar?: (id_tarea: number) => void; 
    onDesglosar?: (tarea: TareaData) => void;
    onEliminar?: (id_tarea: number) => void;
    nivel?: number;       
    esPadre?: boolean;    
    expandido?: boolean;  
    onToggleExpandir?: () => void;
}

const TarjetaTarea: React.FC<Props> = ({ 
    tarea, puedeEditar, onSeleccionar, onAsignar, onDesglosar, onEliminar,
    nivel = 0, esPadre = false, expandido = false, onToggleExpandir
}) => {

    const formatearFecha = (fecha: string) => {
        if (!fecha) return "Sin fecha";
        return fecha.split('T')[0];
    };

    const estaAsignada = tarea.nombre_responsable && tarea.nombre_responsable.trim() !== "";
    const marginLeft = nivel * 32; 

    return (
        <div style={{ 
            display: 'flex', alignItems: 'stretch', width: '100%', 
            paddingLeft: `${marginLeft}px`, marginBottom: '8px', boxSizing: 'border-box'
        }}>
            
            {/* FLECHA DE EXPANDIR */}
            <div style={{ 
                width: '30px', minWidth: '30px', display: 'flex', justifyContent: 'center', paddingTop: '18px', 
            }}>
                {esPadre && (
                    <button
                        onClick={(e) => { e.stopPropagation(); if (onToggleExpandir) onToggleExpandir(); }}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            fontSize: '12px', color: '#64748b', padding: '4px',
                            transform: expandido ? 'rotate(90deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: '20px', height: '20px', borderRadius: '50%',
                            backgroundColor: expandido ? '#e2e8f0' : 'transparent'
                        }}
                    >
                        {/* Icono Flecha SVG (Más limpio que ▶) */}
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>
                )}
            </div>

            {/* TARJETA */}
            <div
                className={`tarjeta ${puedeEditar ? 'tarjeta-interactuable' : 'tarjeta-bloqueada'}`}
                style={{ flex: 1 }}
                onClick={() => { if (puedeEditar) onSeleccionar(tarea); }}
            >
                {/* CABECERA */}
                <div className='prirapt'>
                    <div style={{ flex: 1, minWidth: 0 }}> 
                        <p className='tittarj'>
                            {nivel > 0 && <span style={{color:'#94a3b8', marginRight:'6px', fontWeight:400}}>↳</span>}
                            {tarea.titulo}
                        </p>
                    </div>

                    <div className='esttarea'>
                        {!puedeEditar && <span style={{ fontSize: '10px', marginRight: '4px' }}>🔒</span>}
                        <p className='txtesttar'>En progreso</p>
                    </div>

                    {/* BOTONES DE ACCIÓN (IA y ELIMINAR) */}
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        
                        {/* 1. Botón IA (SVG Sparkles) */}
                        {puedeEditar && onDesglosar && nivel === 0 && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onDesglosar(tarea); }}
                                title="Desglosar con IA"
                                style={{
                                    /* Tu gradiente */
                                    background: 'linear-gradient(135deg, #2563eb 0%, #9e1eafff 100%)',
                                    border: 'none', borderRadius: '6px', width: '28px', height: '28px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', boxShadow: '0 2px 5px rgba(37, 99, 235, 0.3)',
                                    flexShrink: 0, color: 'white'
                                }}
                            >
                                {/* SVG Sparkles */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                                </svg>
                            </button>
                        )}

                        {/* 2. Botón ELIMINAR (SVG Trash) */}
                        {puedeEditar && onEliminar && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if(confirm('¿Eliminar esta tarea?')) onEliminar(tarea.id_tarea);
                                }}
                                title="Eliminar tarea"
                                style={{
                                    background: 'transparent',
                                    border: '1px solid transparent', 
                                    borderRadius: '6px', width: '28px', height: '28px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', color: '#94a3b8', /* Gris por defecto */
                                    flexShrink: 0,
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#fef2f2';
                                    e.currentTarget.style.color = '#ef4444';
                                    e.currentTarget.style.borderColor = '#fecaca';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = '#94a3b8';
                                    e.currentTarget.style.borderColor = 'transparent';
                                }}
                            >
                                {/* SVG Trash */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* RESTO DE LA TARJETA */}
                <div className='segdapt'>
                    <img className='imatarj' src="/asignacion.png" alt="Usuario" />
                    {estaAsignada ? (
                        <p className='tarjtxt'>{tarea.nombre_responsable} {tarea.apellido_responsable}</p>
                    ) : (
                        <button 
                            style={{
                                backgroundColor: '#2563eb', color: 'white', border: 'none',
                                borderRadius: '4px', padding: '4px 12px', cursor: 'pointer',
                                fontSize: '12px', fontWeight: 600, letterSpacing: '0.5px'
                            }}
                            onClick={(e) => { e.stopPropagation(); if (onAsignar) onAsignar(tarea.id_tarea); }}
                        >
                            + Asignar
                        </button>
                    )}
                </div>

                <div className='tercerapt'>
                    <img className='imatarj' src="/fecha.png" alt="Inicio" />
                    <p className='tarjtxt'>{formatearFecha(tarea.fecha_inicio)}</p>
                    <div style={{width:'1px', height:'12px', background:'#cbd5e1'}}></div>
                    <img className='imatarj' src="/fecha.png" alt="Fin" />
                    <p className='tarjtxt'>{formatearFecha(tarea.fecha_fin)}</p>
                </div>
            </div>
        </div>
    )
}

export default TarjetaTarea;