import React, { useEffect, useState, useMemo } from 'react';
import { useUser } from '../../context/UserContext';
import TarjetaDocum from './TarjetaDocum';
import { 
    Folder, FileText, Upload, Search, Send, ArrowLeft, 
    Clock, Download, Bell, MessageSquare, X 
} from 'lucide-react';
import './TarjetaDocum.css'; 

interface Documento {
    id_doc: number;
    nombre_archivo: string;
    url: string;
    fecha_subida: string;
    comentario: string;
    usuario_nombre: string;
    id_usuario_subida: number;
    categoria?: string;
    descripcion_real?: string;
    historial?: Documento[];
}

interface Proyecto {
    id_proyecto: number;
    nombre: string;
    nombre_equipo?: string;
    rol?: string;
}

interface Props {
    idProyecto?: string;
}

type Tab = 'mis-archivos' | 'proyectos';
type ViewMode = 'carpetas' | 'archivos';

const MisDocumentos: React.FC<Props> = ({ idProyecto }) => {
    const { usuario } = useUser();
    
    // Configuración de vista
    const [activeTab, setActiveTab] = useState<Tab>(idProyecto ? 'proyectos' : 'mis-archivos');
    const [viewMode, setViewMode] = useState<ViewMode>('carpetas');
    const [carpetaActual, setCarpetaActual] = useState<string>(""); 
    
    // Datos
    const [docsProcesados, setDocsProcesados] = useState<Documento[]>([]); 
    const [listaProyectos, setListaProyectos] = useState<Proyecto[]>([]);
    
    // Filtros y Formularios
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState<string>(idProyecto || "");
    const [busqueda, setBusqueda] = useState("");
    const [modalSubir, setModalSubir] = useState(false);
    const [modalEnviar, setModalEnviar] = useState(false);
    const [modalVersiones, setModalVersiones] = useState<Documento | null>(null);
    
    const [archivo, setArchivo] = useState<File | null>(null);
    const [categoria, setCategoria] = useState("Documentación");
    const [descripcion, setDescripcion] = useState("");
    const [proyectoParaSubir, setProyectoParaSubir] = useState<string>(""); 
    
    const [docAEnviar, setDocAEnviar] = useState<number | null>(null);
    const [proyectoDestino, setProyectoDestino] = useState("");

    // Estado para responsividad
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const puedeEditar = true; 

    // ==============================================================
    // LISTENER DE TAMAÑO DE PANTALLA
    // ==============================================================
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = windowWidth < 768; // Punto de quiebre para móviles

    // ==============================================================
    // 1. CARGAR PROYECTOS
    // ==============================================================
    useEffect(() => {
        if (usuario?.id) {
            fetch(`http://localhost:3000/api/mis-proyectos/${usuario.id}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setListaProyectos(data);
                    } else {
                        console.error("Error formato proyectos:", data);
                        setListaProyectos([]);
                    }
                })
                .catch(err => console.error("Error fetch proyectos:", err));
        }
    }, [usuario]);

    // ==============================================================
    // 2. CARGAR DOCUMENTOS
    // ==============================================================
    const cargarDatos = () => {
        let url = "";
        
        if (activeTab === 'mis-archivos' && usuario?.id) {
            url = `http://localhost:3000/api/documentos/usuario/${usuario.id}`;
        } else if (activeTab === 'proyectos' && proyectoSeleccionado) {
            url = `http://localhost:3000/api/documentos/proyecto/${proyectoSeleccionado}`;
        }

        if (url) {
            fetch(url)
                .then(res => res.json())
                .then((data: any[]) => {
                    if (!Array.isArray(data)) {
                        setDocsProcesados([]);
                        return;
                    }
                    const procesadosMap: { [key: string]: Documento } = {};
                    data.forEach(doc => {
                        const match = doc.comentario ? doc.comentario.match(/\[(.*?)\]/) : null;
                        const cat = match ? match[1] : 'General';
                        const desc = doc.comentario ? doc.comentario.replace(/\[.*?\]\s*/, '') : '';
                        
                        const docLimpio = { ...doc, categoria: cat, descripcion_real: desc, historial: [] };
                        const clave = `${cat}-${doc.nombre_archivo}`;
                        
                        if (!procesadosMap[clave]) {
                            procesadosMap[clave] = docLimpio;
                        } else {
                            procesadosMap[clave].historial?.push(docLimpio);
                        }
                    });
                    setDocsProcesados(Object.values(procesadosMap));
                })
                .catch(console.error);
        } else {
            setDocsProcesados([]);
        }
    };

    useEffect(() => {
        cargarDatos();
        setViewMode('carpetas');
        setCarpetaActual("");
        setBusqueda(""); 
    }, [activeTab, proyectoSeleccionado, usuario]);

    const carpetasDisponibles = useMemo(() => {
        const cats = new Set(docsProcesados.map(d => d.categoria || 'General'));
        return Array.from(cats);
    }, [docsProcesados]);

    const contenidoActual = useMemo(() => {
        if (busqueda.trim()) {
            return docsProcesados.filter(d => 
                d.nombre_archivo.toLowerCase().includes(busqueda.toLowerCase()) ||
                (d.descripcion_real && d.descripcion_real.toLowerCase().includes(busqueda.toLowerCase()))
            );
        }

        if (viewMode === 'archivos' && carpetaActual) {
            return docsProcesados.filter(d => d.categoria === carpetaActual);
        }
        
        return [];
    }, [docsProcesados, viewMode, carpetaActual, busqueda]);

    // ==============================================================
    // 3. ACCIONES
    // ==============================================================

    const handleSubir = (e: React.FormEvent) => {
        e.preventDefault();
        const targetProject = idProyecto || proyectoSeleccionado || proyectoParaSubir;

        if (!archivo || !usuario) return alert("Faltan datos");
        if (!targetProject || targetProject === "0") return alert("⚠️ Selecciona un proyecto obligatorio.");

        const formData = new FormData();
        formData.append("archivo", archivo);
        formData.append("id_proyecto", targetProject); 
        formData.append("id_usuario", usuario.id.toString());
        formData.append("categoria", viewMode === 'archivos' ? carpetaActual : categoria);
        formData.append("descripcion", descripcion);

        fetch('http://localhost:3000/api/documentos/general', { method: 'POST', body: formData })
            .then(res => {
                if(res.ok) {
                    alert("✅ Subido correctamente");
                    setModalSubir(false);
                    setArchivo(null);
                    setDescripcion("");
                    setProyectoParaSubir(""); 
                    cargarDatos();
                } else {
                    res.json().then(d => alert("Error: " + d.error));
                }
            })
            .catch(() => alert("Error de conexión"));
    };

    const handleBorrar = (idDoc: number) => {
        if (confirm("¿Eliminar?")) {
            fetch(`http://localhost:3000/api/documentos/${idDoc}`, { method: 'DELETE' })
                .then(() => cargarDatos());
        }
    };

    const handleDescargar = (idDoc: number) => window.open(`http://localhost:3000/api/documentos/descargar/${idDoc}`, '_blank');

    const handleEnviar = (e: React.FormEvent) => {
        e.preventDefault();
        if (!docAEnviar || !proyectoDestino) return;
        fetch('http://localhost:3000/api/documentos/clonar', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id_doc: docAEnviar, id_proyecto_destino: proyectoDestino, id_usuario: usuario?.id })
        }).then(res => {
            if(res.ok) { alert("✅ Copiado"); setModalEnviar(false); }
        });
    };

    // --- ESTILOS EN LÍNEA OPTIMIZADOS Y RESPONSIVOS ---
    const styles = {
        mainContainer: {
            background: '#F3F4F6', 
            minHeight: '100vh',
            padding: isMobile ? '10px' : '20px 40px', // Menos padding en móvil
            fontFamily: "'Inter', sans-serif"
        },
        topNav: {
            background: 'white',
            padding: isMobile ? '10px' : '15px 25px',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: isMobile ? 'column' as 'column' : 'row' as 'row', // Apilar en móvil
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: isMobile ? '10px' : '0',
            marginBottom: '25px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        },
        navPillsContainer: {
            display: 'flex', 
            gap: '5px', 
            overflowX: 'auto' as 'auto', // Scroll horizontal en móvil
            width: isMobile ? '100%' : 'auto',
            paddingBottom: isMobile ? '5px' : '0'
        },
        navPillActive: {
            background: '#2563EB',
            color: 'white',
            padding: '8px 20px',
            borderRadius: '20px', 
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '14px',
            whiteSpace: 'nowrap' as 'nowrap'
        },
        navPillInactive: {
            background: 'transparent',
            color: '#6B7280',
            padding: '8px 20px',
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '14px',
            whiteSpace: 'nowrap' as 'nowrap'
        },
        contentCard: {
            background: 'white',
            borderRadius: '20px',
            padding: isMobile ? '15px' : '30px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)'
        },
        titleSection: {
            marginBottom: '30px'
        },
        title: {
            fontSize: isMobile ? '20px' : '24px',
            fontWeight: 700,
            color: '#111827',
            marginBottom: '4px'
        },
        subtitle: {
            color: '#6B7280',
            fontSize: isMobile ? '13px' : '14px',
            marginBottom: '20px'
        },
        toolbar: {
            display: 'flex',
            flexDirection: isMobile ? 'column' as 'column' : 'row' as 'row', // Apilar toolbar en móvil
            justifyContent: 'space-between',
            alignItems: isMobile ? 'stretch' : 'center',
            gap: '15px',
            marginBottom: '25px',
            background: '#F9FAFB',
            padding: isMobile ? '15px' : '12px 20px',
            borderRadius: '12px',
            border: '1px solid #E5E7EB'
        },
        toolbarLeft: {
            display: 'flex', 
            gap: '5px',
            flexWrap: 'wrap' as 'wrap',
            justifyContent: isMobile ? 'center' : 'flex-start',
            width: isMobile ? '100%' : 'auto'
        },
        toolbarRight: {
            display: 'flex', 
            flexDirection: isMobile ? 'column' as 'column' : 'row' as 'row',
            gap: '10px', 
            alignItems: 'center',
            width: isMobile ? '100%' : 'auto'
        },
        primaryButton: {
            background: '#2563EB',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            fontSize: '14px',
            boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.3)',
            width: isMobile ? '100%' : 'auto'
        },
        searchInputWrapper: {
            position: 'relative' as 'relative',
            width: isMobile ? '100%' : 'auto'
        },
        searchInput: {
            padding: '10px 10px 10px 38px',
            borderRadius: '8px',
            border: '1px solid #D1D5DB',
            width: isMobile ? '100%' : '280px', // Ancho completo en móvil
            fontSize: '14px',
            outline: 'none',
            background: 'white',
            boxSizing: 'border-box' as 'border-box'
        },
        folderCard: {
            background: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            padding: '20px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        },
        // Grid responsive usando auto-fill con minmax ajustado
        gridContainer: {
            display: 'grid',
            // En móvil las tarjetas se ajustan al ancho, en escritorio mínimo 220px
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '20px'
        },
        gridFilesContainer: {
            display: 'grid',
            // En móvil las tarjetas se ajustan al ancho, en escritorio mínimo 280px
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px'
        }
    };

    return (
        <div style={styles.mainContainer}>
            

            {/* 2. CONTENIDO PRINCIPAL */}
            <div style={styles.contentCard}>
                
                <div style={styles.titleSection}>
                    <h1 style={styles.title}>
                        {activeTab === 'mis-archivos' ? 'Mis Documentos' : 'Documentos del Proyecto'}
                    </h1>
                    <p style={styles.subtitle}>
                        {activeTab === 'mis-archivos' 
                            ? 'Gestiona tus archivos personales.' 
                            : 'Archivos compartidos con tu equipo.'}
                    </p>
                </div>

                <div style={styles.toolbar}>
                    <div style={styles.toolbarLeft}>
                        {!idProyecto && (
                            <>
                                <button 
                                    onClick={() => setActiveTab('mis-archivos')}
                                    style={activeTab === 'mis-archivos' ? 
                                        {...styles.navPillActive, background: '#EFF6FF', color: '#2563EB', boxShadow: 'none'} : 
                                        styles.navPillInactive}
                                >
                                    Mis Archivos
                                </button>
                                <button 
                                    onClick={() => setActiveTab('proyectos')}
                                    style={activeTab === 'proyectos' ? 
                                        {...styles.navPillActive, background: '#EFF6FF', color: '#2563EB', boxShadow: 'none'} : 
                                        styles.navPillInactive}
                                >
                                    Proyectos
                                </button>
                            </>
                        )}
                        {activeTab === 'proyectos' && !idProyecto && (
                            <select 
                                value={proyectoSeleccionado} 
                                onChange={(e) => setProyectoSeleccionado(e.target.value)}
                                style={{ 
                                    padding: '8px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', 
                                    marginLeft: isMobile ? '0' : '10px', marginTop: isMobile ? '10px' : '0', 
                                    fontSize: '14px', outline: 'none', width: isMobile ? '100%' : 'auto' 
                                }}
                            >
                                <option value="">-- Selecciona un Proyecto --</option>
                                {listaProyectos.map(p => (
                                    <option key={p.id_proyecto} value={p.id_proyecto}>{p.nombre}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div style={styles.toolbarRight}>
                        <div style={styles.searchInputWrapper}>
                            <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#9CA3AF' }} />
                            <input 
                                type="text" 
                                placeholder="Buscar archivo..." 
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                style={styles.searchInput}
                            />
                            {busqueda && (
                                <button 
                                    onClick={() => setBusqueda("")}
                                    style={{ position: 'absolute', right: '10px', top: '10px', border: 'none', background: 'none', cursor: 'pointer', color: '#9CA3AF' }}
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                        <button onClick={() => setModalSubir(true)} style={styles.primaryButton}>
                            <Upload size={18} /> {isMobile ? 'Subir' : 'Subir Documento'}
                        </button>
                    </div>
                </div>

                {/* 3. LISTADO (GRID RESPONSIVO) */}
                <div style={{ minHeight: '400px' }}>
                    {viewMode === 'archivos' && !busqueda && (
                        <button 
                            onClick={() => setViewMode('carpetas')} 
                            style={{ 
                                background: 'none', border: 'none', color: '#4B5563', cursor: 'pointer', 
                                display: 'flex', alignItems: 'center', marginBottom: '20px', fontWeight: 600, fontSize: '14px'
                            }}
                        >
                            <ArrowLeft size={18} style={{ marginRight: '5px' }} /> Volver a Carpetas
                        </button>
                    )}

                    {!busqueda && viewMode === 'carpetas' ? (
                        // VISTA CARPETAS
                        <div style={styles.gridContainer}>
                            {carpetasDisponibles.map(cat => (
                                <div 
                                    key={cat} 
                                    onClick={() => { setCarpetaActual(cat); setViewMode('archivos'); }}
                                    style={styles.folderCard}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.borderColor = '#2563EB';
                                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.borderColor = '#E5E7EB';
                                        e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
                                    }}
                                >
                                    <div style={{background: '#EFF6FF', padding: '12px', borderRadius: '10px', color: '#2563EB'}}>
                                        <Folder size={28} fill="currentColor" />
                                    </div>
                                    <div style={{flex: 1}}>
                                        <div style={{ fontWeight: 600, color: '#1F2937', fontSize: '16px' }}>{cat}</div>
                                        <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>
                                            {docsProcesados.filter(d => d.categoria === cat).length} archivos
                                        </div>
                                    </div>
                                    <div style={{color: '#D1D5DB'}}>
                                        <ArrowLeft size={16} style={{transform: 'rotate(180deg)'}} />
                                    </div>
                                </div>
                            ))}
                            {carpetasDisponibles.length === 0 && (
                                <div style={{gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: '#9CA3AF'}}>
                                    <Folder size={64} style={{opacity: 0.1, marginBottom: '15px'}} />
                                    <p style={{fontSize: '16px'}}>No hay documentos para mostrar.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        // VISTA ARCHIVOS (GRID MEJORADO)
                        <div className="containerproy" style={
                            busqueda && contenidoActual.length === 0 
                            ? {} 
                            : styles.gridFilesContainer
                        }>
                            {busqueda && contenidoActual.length === 0 ? (
                                <div style={{textAlign: 'center', padding: '60px', color: '#6B7280', gridColumn: '1 / -1'}}>
                                    <Search size={48} style={{opacity: 0.1, marginBottom: '15px'}} />
                                    <p>No se encontraron resultados para "{busqueda}"</p>
                                </div>
                            ) : (
                                contenidoActual.map(doc => (
                                    <div key={doc.id_doc}>
                                        <TarjetaDocum doc={doc} esLider={puedeEditar} onDelete={() => handleBorrar(doc.id_doc)} />
                                        
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px', paddingLeft: '5px', flexWrap: 'wrap' }}>
                                            <button onClick={() => handleDescargar(doc.id_doc)} style={{ fontSize: '13px', color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                                                <Download size={14} /> Descargar
                                            </button>
                                            {activeTab === 'mis-archivos' && (
                                                <button onClick={() => { setDocAEnviar(doc.id_doc); setModalEnviar(true); }} style={{ fontSize: '13px', color: '#4B5563', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                                                    <Send size={14} /> Enviar
                                                </button>
                                            )}
                                            {doc.historial && doc.historial.length > 0 && (
                                                <button onClick={() => setModalVersiones(doc)} style={{ fontSize: '13px', color: '#D97706', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                                                    <Clock size={14} /> Historial (v{doc.historial.length + 1})
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL SUBIR */}
            {modalSubir && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ borderRadius: '16px', padding: '30px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', width: isMobile ? '90%' : '500px' }}>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                            <h3 style={{margin:0, color: '#111827', fontSize:'20px'}}>Subir Nuevo Archivo</h3>
                            <button onClick={() => setModalSubir(false)} style={{background:'none', border:'none', cursor:'pointer', color:'#9CA3AF'}}><X size={20}/></button>
                        </div>
                        
                        <form onSubmit={handleSubir}>
                            {(!idProyecto && !proyectoSeleccionado) && (
                                <div style={{ marginBottom: '20px', background: '#FFFBEB', padding: '15px', borderRadius: '8px', border: '1px solid #FCD34D' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '13px', color: '#B45309' }}>
                                        📂 Selecciona el Proyecto destino:
                                    </label>
                                    <select 
                                        required 
                                        value={proyectoParaSubir} 
                                        onChange={e => setProyectoParaSubir(e.target.value)}
                                        style={{ width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px', background: 'white' }}
                                    >
                                        <option value="">-- Elige un proyecto --</option>
                                        {listaProyectos.map((p) => (
                                            <option key={p.id_proyecto} value={p.id_proyecto}>{p.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <div style={{marginBottom: '15px'}}>
                                <label style={{display:'block', marginBottom:'5px', fontSize:'14px', fontWeight:500, color:'#374151'}}>Archivo</label>
                                <input type="file" required onChange={e => e.target.files && setArchivo(e.target.files[0])} style={{width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize:'14px'}} />
                            </div>
                            <div style={{marginBottom: '15px'}}>
                                <label style={{display:'block', marginBottom:'5px', fontSize:'14px', fontWeight:500, color:'#374151'}}>Categoría</label>
                                <select value={categoria} onChange={e => setCategoria(e.target.value)} style={{width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize:'14px'}}>
                                    <option>Documentación</option><option>Diseño</option><option>Legal</option><option>Presupuestos</option><option>Otros</option>
                                </select>
                            </div>
                            <div style={{marginBottom: '25px'}}>
                                <label style={{display:'block', marginBottom:'5px', fontSize:'14px', fontWeight:500, color:'#374151'}}>Descripción</label>
                                <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} style={{width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px', height: '80px', fontSize:'14px'}} />
                            </div>
                            <div style={{display:'flex', justifyContent:'flex-end', gap:'10px'}}>
                                <button type="button" onClick={() => setModalSubir(false)} style={{padding: '10px 20px', border: '1px solid #D1D5DB', background: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight:500}}>Cancelar</button>
                                <button type="submit" style={styles.primaryButton}>Subir Archivo</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL ENVIAR */}
            {modalEnviar && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ borderRadius: '16px', padding: '30px', width: isMobile ? '90%' : '400px' }}>
                        <h3 style={{marginBottom: '10px', fontSize:'20px'}}>Copiar a Proyecto</h3>
                        <p style={{marginBottom: '20px', color: '#6B7280', fontSize:'14px'}}>El archivo se duplicará en la carpeta del proyecto seleccionado.</p>
                        <select onChange={e => setProyectoDestino(e.target.value)} style={{width:'100%', padding:'10px', border: '1px solid #D1D5DB', borderRadius: '6px', marginBottom: '25px'}}>
                            <option>Selecciona Proyecto</option>
                            {listaProyectos.map(p => <option key={p.id_proyecto} value={p.id_proyecto}>{p.nombre}</option>)}
                        </select>
                        <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
                            <button onClick={() => setModalEnviar(false)} style={{padding: '10px 20px', border: '1px solid #D1D5DB', background: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight:500}}>Cancelar</button>
                            <button onClick={handleEnviar} style={styles.primaryButton}>Enviar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MisDocumentos;