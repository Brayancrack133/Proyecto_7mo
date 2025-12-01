import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { 
    Users, FileText, Briefcase, BarChart2, PieChart,
    Calendar, CheckSquare, Download, Layers, TrendingUp,
    Clock, Activity, AlertCircle
} from 'lucide-react';
import './Dashboard.css';

// --- INTERFACES ---
interface KPI { 
    total_proyectos: number; 
    total_tareas: number; 
    total_documentos: number; 
}

interface ProyectoStat {
    id_proyecto: number; 
    nombre: string; 
    nombre_equipo: string;
    cantidad_miembros: number; 
    cantidad_tareas: number; 
    cantidad_docs: number;
    fecha_inicio: string; 
    fecha_fin: string;
}

interface DataPoint { 
    nombre: string; 
    valor: number; 
    apellido?: string; 
}

interface TareaVencimiento {
    titulo: string;
    fecha_fin: string;
    nombre_proyecto: string;
    responsable: string;
}

interface Notificacion { 
    contenido: string; 
    fecha_creacion: string; 
}

const Dashboard = () => {
    const { usuario } = useUser();
    
    const [kpis, setKpis] = useState<KPI>({total_proyectos:0, total_tareas:0, total_documentos:0});
    const [proyectos, setProyectos] = useState<ProyectoStat[]>([]);
    const [graficaData, setGraficaData] = useState<DataPoint[]>([]);
    const [cargaEquipo, setCargaEquipo] = useState<DataPoint[]>([]);
    const [docsTipo, setDocsTipo] = useState<DataPoint[]>([]);
    const [vencimientos, setVencimientos] = useState<TareaVencimiento[]>([]);
    const [actividad, setActividad] = useState<Notificacion[]>([]);
    
    const [loading, setLoading] = useState(true);

    useEffect(() => { 
        if (usuario?.id) fetchData(); 
    }, [usuario]);

    const fetchData = () => {
        setLoading(true);
        fetch(`http://localhost:3000/api/dashboard/stats/${usuario?.id}`)
            .then(res => res.json())
            .then(data => {
                setKpis(data.kpis || {total_proyectos:0, total_tareas:0, total_documentos:0});
                setProyectos(data.proyectos || []);
                setGraficaData(data.grafica || []);
                setCargaEquipo(data.cargaEquipo || []);
                setDocsTipo(data.docsPorTipo || []);
                setVencimientos(data.proximosVencimientos || []);
                setActividad(data.actividadReciente || []);
                setLoading(false);
            })
            .catch(err => { console.error(err); setLoading(false); });
    };

    // --- GRÁFICA DE BARRAS (Usando CSS) ---
    const BarChart = ({ data }: { data: DataPoint[] }) => {
        if (!data.length) return <p className="no-data">Sin datos para mostrar</p>;
        
        // Asegurar que sean números y calcular máximo (minimo 5 para escala)
        const max = Math.max(...data.map(d => Number(d.valor || 0)), 5);
        
        return (
            <div className="chart-container">
                <div className="bar-chart">
                    {data.map((d, i) => (
                        <div key={i} className="bar-column">
                            <span className="bar-value">{d.valor}</span>
                            <div 
                                className="bar-fill" 
                                style={{ height: `${(Number(d.valor || 0) / max) * 100}%` }}
                                data-tooltip={`${d.valor} tareas`}
                            ></div>
                            <span className="bar-label" title={d.nombre}>{d.nombre}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // --- GRÁFICA DONUT SVG ---
    const DonutChart = ({ data }: { data: DataPoint[] }) => {
        if (!data.length) return <p className="no-data">Sin asignaciones</p>;
        const total = data.reduce((acc, d) => acc + Number(d.valor || 0), 0);
        let cumulative = 0;
        const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

        return (
            <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'20px', padding:'10px'}}>
                <div style={{position:'relative', width:'120px', height:'120px'}}>
                    <svg viewBox="0 0 100 100" style={{transform:'rotate(-90deg)'}}>
                        {data.map((d, i) => {
                            const val = Number(d.valor || 0);
                            const percent = total > 0 ? val / total : 0;
                            const dashArray = percent * 314; 
                            const dashOffset = cumulative * 314;
                            cumulative += percent;
                            return (
                                <circle key={i} r="25" cx="50" cy="50" fill="transparent"
                                    stroke={colors[i % colors.length]} strokeWidth="20"
                                    strokeDasharray={`${dashArray} 314`} strokeDashoffset={-dashOffset}
                                />
                            );
                        })}
                    </svg>
                    <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
                        <span style={{fontSize:'18px', fontWeight:'bold', color:'#374151'}}>{total}</span>
                        <span style={{fontSize:'8px', color:'#9CA3AF'}}>Tareas</span>
                    </div>
                </div>
                <div style={{display:'flex', flexDirection:'column', gap:'5px'}}>
                    {data.slice(0, 4).map((d, i) => (
                        <div key={i} style={{display:'flex', alignItems:'center', gap:'6px', fontSize:'11px'}}>
                            <div style={{width:'8px', height:'8px', borderRadius:'50%', background:colors[i % colors.length]}}></div>
                            <span style={{color:'#4B5563', maxWidth:'80px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                                {d.nombre} {d.apellido?.charAt(0)}.
                            </span>
                            <span style={{fontWeight:'bold', marginLeft:'auto'}}>{d.valor}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // --- BARRA DE PROGRESO TEMPORAL ---
    const ProgressBar = ({ inicio, fin }: { inicio: string, fin: string }) => {
        const start = new Date(inicio).getTime();
        const end = new Date(fin).getTime();
        const now = new Date().getTime();
        const total = end - start;
        const elapsed = now - start;
        
        let percent = total > 0 ? Math.round((elapsed / total) * 100) : 0;
        if (percent < 0) percent = 0;
        if (percent > 100) percent = 100;

        let color = '#3B82F6';
        if (percent > 75) color = '#F59E0B'; 
        if (percent > 90) color = '#EF4444'; 

        return (
            <div style={{marginTop:'15px'}}>
                <div style={{display:'flex', justifyContent:'space-between', fontSize:'10px', color:'#6B7280', marginBottom:'4px'}}>
                    <span>Progreso Tiempo</span>
                    <span style={{color:color, fontWeight:'bold'}}>{percent}%</span>
                </div>
                <div style={{width:'100%', height:'6px', background:'#E5E7EB', borderRadius:'3px', overflow:'hidden'}}>
                    <div style={{width:`${percent}%`, height:'100%', background:color, transition:'width 1s ease', borderRadius:'3px'}}></div>
                </div>
            </div>
        );
    };

    if (loading) return <div className="dashboard-container center-msg">Cargando métricas...</div>;

    return (
        <div className="dashboard-container">
            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <h1>Dashboard Ejecutivo</h1>
                    <p>Hola {usuario?.nombre}, aquí tienes el resumen de hoy.</p>
                </div>
                <button className="btn-dash" onClick={() => window.print()}>
                    <Download size={18} /> Exportar PDF
                </button>
            </div>

            {/* 1. KPIs */}
            <div className="kpi-grid">
                <div className="kpi-card hover-lift">
                    <div className="kpi-icon blue"><Briefcase size={24}/></div>
                    <div><div className="kpi-value">{kpis.total_proyectos}</div><div className="kpi-label">Proyectos Activos</div></div>
                </div>
                <div className="kpi-card hover-lift">
                    <div className="kpi-icon green"><CheckSquare size={24}/></div>
                    <div><div className="kpi-value">{kpis.total_tareas}</div><div className="kpi-label">Tareas Totales</div></div>
                </div>
                <div className="kpi-card hover-lift">
                    <div className="kpi-icon orange"><FileText size={24}/></div>
                    <div><div className="kpi-value">{kpis.total_documentos}</div><div className="kpi-label">Documentos</div></div>
                </div>
            </div>

            {/* 2. AREA CENTRAL DE GRÁFICAS */}
            <div className="main-grid">
                
                {/* Columna Izquierda: Gráficas Grandes */}
                <div className="chart-card" style={{gridColumn: 'span 1'}}>
                    <div className="card-header">
                        <h3><BarChart2 size={18} color="#2563EB"/> Volumen de Tareas</h3>
                    </div>
                    <BarChart data={graficaData} />
                </div>

                <div className="chart-card" style={{gridColumn: 'span 1'}}>
                    <div className="card-header">
                        <h3><PieChart size={18} color="#10B981"/> Carga de Equipo</h3>
                    </div>
                    <DonutChart data={cargaEquipo} />
                </div>

                {/* Columna Derecha: Alertas y Actividad */}
                <div className="chart-card" style={{gridColumn: 'span 1'}}>
                    <div className="card-header">
                        <h3><Clock size={18} color="#DC2626"/> Próximos Vencimientos</h3>
                    </div>
                    <div className="activity-list">
                        {vencimientos.length === 0 ? <p className="no-data">Todo al día</p> :
                            vencimientos.map((v, i) => (
                                <div key={i} className="activity-item warning">
                                    <AlertCircle size={14} color="#DC2626" style={{minWidth:'14px'}}/>
                                    <div>
                                        <p style={{fontWeight:600, color:'#991B1B'}}>{v.titulo}</p>
                                        <span>{v.nombre_proyecto} • {new Date(v.fecha_fin).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>

            {/* 3. PROYECTOS DETALLADOS */}
            <div style={{ marginTop: '30px' }}>
                <h3 className="section-title"><Layers size={20} /> Estado de Proyectos</h3>
                
                {proyectos.length === 0 ? <p className="no-data">No hay proyectos activos.</p> : 
                    <div className="projects-grid">
                        {proyectos.map(p => (
                            <div key={p.id_proyecto} className="project-card hover-lift">
                                <div className="project-header">
                                    <h4>{p.nombre}</h4>
                                    <span className="team-badge">{p.nombre_equipo || 'Sin Equipo'}</span>
                                </div>
                                
                                <div className="project-stats">
                                    <div className="stat-pill">
                                        <Users size={14} /> <span>{p.cantidad_miembros}</span>
                                    </div>
                                    <div className="stat-pill">
                                        <CheckSquare size={14} /> <span>{p.cantidad_tareas}</span>
                                    </div>
                                    <div className="stat-pill">
                                        <FileText size={14} /> <span>{p.cantidad_docs}</span>
                                    </div>
                                </div>

                                {/* Barra de Progreso Temporal */}
                                <ProgressBar inicio={p.fecha_inicio} fin={p.fecha_fin} />

                                <div className="project-footer">
                                    <Calendar size={14} />
                                    <span>Entrega: {p.fecha_fin ? new Date(p.fecha_fin).toLocaleDateString() : 'N/A'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                }
            </div>
        </div>
    );
};

export default Dashboard;