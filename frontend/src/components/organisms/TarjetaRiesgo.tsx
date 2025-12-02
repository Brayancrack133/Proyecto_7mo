import React from 'react';
import { AlertTriangle, CheckCircle, TrendingUp, ChevronDown, BrainCircuit } from 'lucide-react';

export interface AnalisisRiesgo {
    nivel_riesgo: 'BAJO' | 'MEDIO' | 'ALTO';
    mensaje: string;
    acciones_sugeridas: string[];
}

interface Props {
    analisis: AnalisisRiesgo | null;
    loading: boolean;
    proyectos: any[];
    proyectoSeleccionado: number;
    onCambiarProyecto: (id: number) => void;
}

const TarjetaRiesgo: React.FC<Props> = ({ 
    analisis, loading, proyectos, proyectoSeleccionado, onCambiarProyecto 
}) => {

    const getConfig = () => {
        if (!analisis) return { color: '#64748b', bg: '#f1f5f9', icon: <TrendingUp /> };
        switch (analisis.nivel_riesgo) {
            case 'ALTO': return { color: '#ef4444', bg: '#fee2e2', icon: <AlertTriangle /> };
            case 'MEDIO': return { color: '#f59e0b', bg: '#fef3c7', icon: <AlertTriangle /> };
            default: return { color: '#10b981', bg: '#d1fae5', icon: <CheckCircle /> };
        }
    };

    const config = getConfig();

    return (
        <div style={{ 
            background: 'white', borderRadius: '12px', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0', 
            overflow: 'hidden', display: 'flex', flexDirection: 'column',
            height: '100%'
        }}>
            {/* 1. BANDA SUPERIOR DE IDENTIDAD IA */}
            <div style={{
                height: '6px', width: '100%',
                background: 'linear-gradient(90deg, #2563eb, #9e1eafff)'
            }}></div>

            {/* 2. CABECERA CON SELECTOR */}
            <div style={{ padding: '20px 24px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <BrainCircuit size={20} color="#2563eb" /> Motor de Predicción IA
                    </h3>
                    <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>Análisis de riesgos y salud del proyecto</p>
                </div>
                
                {/* SELECTOR DE PROYECTO */}
                <div style={{ position: 'relative', minWidth: '200px' }}>
                    <select 
                        value={proyectoSeleccionado}
                        onChange={(e) => onCambiarProyecto(Number(e.target.value))}
                        disabled={loading}
                        style={{
                            width: '100%', appearance: 'none', background: '#f8fafc', border: '1px solid #cbd5e1',
                            padding: '8px 32px 8px 12px', borderRadius: '6px', fontSize: '13px',
                            fontWeight: 500, color: '#334155', cursor: 'pointer', outline: 'none'
                        }}
                    >
                        {proyectos.length === 0 && <option value={0}>Cargando proyectos...</option>}
                        {proyectos.map(p => (
                            <option key={p.id_proyecto} value={p.id_proyecto}>
                                {p.nombre}
                            </option>
                        ))}
                    </select>
                    <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: 12, color: '#64748b', pointerEvents: 'none' }} />
                </div>
            </div>

            {/* 3. CUERPO DEL ANÁLISIS */}
            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', color: '#94a3b8', padding: '20px 0' }}>
                        <div className="spinner" style={{ margin: '0 auto 10px', width: '24px', height: '24px', border: '3px solid #e2e8f0', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        <p style={{ fontSize: '13px' }}>Consultando a Gemini...</p>
                    </div>
                ) : analisis ? (
                    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9' }}>
                            <div style={{ 
                                width: '48px', height: '48px', borderRadius: '12px', 
                                background: config.bg, color: config.color,
                                display: 'flex', alignItems: 'center', justifyContent: 'center' 
                            }}>
                                {config.icon}
                            </div>
                            <div>
                                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nivel de Riesgo</span>
                                <div style={{ fontSize: '20px', fontWeight: 800, color: config.color, lineHeight: 1 }}>{analisis.nivel_riesgo}</div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <h4 style={{ fontSize: '12px', color: '#64748b', margin: '0 0 6px', textTransform: 'uppercase' }}>Diagnóstico:</h4>
                            <p style={{ fontSize: '15px', color: '#334155', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
                                {analisis.mensaje}
                            </p>
                        </div>

                        {analisis.acciones_sugeridas.length > 0 && (
                            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <div style={{ fontSize: '11px', fontWeight: 700, color: '#2563eb', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    RECOMENDACIONES ESTRATÉGICAS
                                </div>
                                <ul style={{ margin: 0, paddingLeft: '20px', color: '#475569' }}>
                                    {analisis.acciones_sugeridas.map((acc, i) => (
                                        <li key={i} style={{ fontSize: '13px', marginBottom: '6px', lineHeight: 1.4 }}>
                                            {acc}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8', background: '#f8fafc', borderRadius: '8px' }}>
                        <p style={{ fontSize: '14px' }}>Selecciona un proyecto arriba para iniciar el análisis.</p>
                    </div>
                )}
            </div>
            
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default TarjetaRiesgo;