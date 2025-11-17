import React, { useState, FormEvent } from 'react';
import './App.css';

// --- 1. DEFINICIÓN DE TIPOS ---
interface Project {
  nombre: string;
  fechas: string;
  rol: 'Colaborador' | 'Líder';
  jefe: string;
  estado: 'Activo' | 'Finalizado';
  progreso: number;
  equipo: number;
}

interface NewProjectData {
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  jefe: string;
  descripcion: string;
}

// --- 2. DATOS MOCK ---
const MOCK_PROJECTS: Project[] = [
  { nombre: 'Plataforma E-Learning', fechas: '2023-09-01 – 2025-12-15', rol: 'Líder', jefe: 'Ana López', estado: 'Activo', progreso: 45, equipo: 3 },
  { nombre: 'Dashboard Analytics', fechas: '2023-10-01 – 2025-02-28', rol: 'Colaborador', jefe: 'Juan Pérez', estado: 'Activo', progreso: 25, equipo: 3 },
  { nombre: 'Sistema de Ventas Online', fechas: '2023-05-01 – 2023-09-30', rol: 'Colaborador', jefe: 'Carlos Ruiz', estado: 'Finalizado', progreso: 99, equipo: 2 },
];

// Contadores para las cards
const totalProjects = MOCK_PROJECTS.length;
const myProjects = MOCK_PROJECTS.filter(p => p.rol === 'Líder').length;
const collaboratorProjects = MOCK_PROJECTS.filter(p => p.rol === 'Colaborador').length;
const activeProjects = MOCK_PROJECTS.filter(p => p.estado === 'Activo').length;
const finishedProjects = MOCK_PROJECTS.filter(p => p.estado === 'Finalizado').length;

// --- 3. COMPONENTES REUTILIZABLES ---

// Fila de tabla
const ProjectRow: React.FC<{ project: Project }> = ({ project }) => {
  const rolStyle = project.rol === 'Colaborador' ? { color: '#A855F7', backgroundColor: '#EDE5FF', padding: '0.25rem 0.5rem', borderRadius: '9999px' } 
                                                 : { color: '#2563EB', backgroundColor: '#DBEAFE', padding: '0.25rem 0.5rem', borderRadius: '9999px' };

  const estadoStyle = project.estado === 'Activo' ? { color: '#16A34A', backgroundColor: '#DCFCE7', padding: '0.25rem 0.5rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.25rem' } 
                                                   : { color: '#2563EB', backgroundColor: '#DBEAFE', padding: '0.25rem 0.5rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.25rem' };

  const progressColor = project.progreso === 99 ? '#3B82F6' : '#FF7B00';

  return (
    <tr>
      <td>
        <p>{project.nombre}</p>
        <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>{project.fechas}</p>
      </td>
      <td><span style={rolStyle}>{project.rol}</span></td>
      <td>{project.jefe}</td>
      <td><span style={estadoStyle}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></svg>
        <span>{project.estado}</span>
      </span></td>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ backgroundColor: '#E5E7EB', borderRadius: '9999px', width: '80px', height: '8px' }}>
            <div style={{ width: `${project.progreso}%`, height: '100%', borderRadius: '9999px', backgroundColor: progressColor, transition: 'width 1s' }}></div>
          </div>
          <span style={{ color: progressColor }}>{project.progreso}%</span>
        </div>
      </td>
      <td>{project.equipo} miembros</td>
      <td>
        <button title="Ver Detalles" style={{ color: '#2563EB', background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </td>
    </tr>
  );
};

// Card de estadísticas
const StatCard: React.FC<{ title: string; count: number; color: string; bgColor: string; icon: React.ReactNode; onClick?: () => void }> = ({ title, count, color, bgColor, icon, onClick }) => (
  <div className="card" onClick={onClick} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', minWidth: '200px', border: '1px solid #E5E7EB' }}>
    <div>
      <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>{title}</p>
      <p style={{ fontSize: '1.875rem', fontWeight: 700, color }}>{count}</p>
    </div>
    <div style={{ backgroundColor: bgColor, padding: '0.75rem', borderRadius: '9999px', color }}>{icon}</div>
  </div>
);


// Modal de creación de proyecto
const ProjectModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (data: NewProjectData) => void }> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<NewProjectData>({ nombre: '', fechaInicio: '', fechaFin: '', jefe: '', descripcion: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({ nombre: '', fechaInicio: '', fechaFin: '', jefe: '', descripcion: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="modal" onClick={onClose}>
      <div className="card" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5E7EB', padding: '1rem' }}>
          <h3>Crear Nuevo Proyecto</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>X</button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label htmlFor="nombre">Nombre del Proyecto</label>
            <input id="nombre" value={formData.nombre} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #D1D5DB' }} />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div>
              <label htmlFor="fechaInicio">Fecha de Inicio</label>
              <input type="date" id="fechaInicio" value={formData.fechaInicio} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #D1D5DB' }} />
            </div>
            <div>
              <label htmlFor="fechaFin">Fecha de Fin</label>
              <input type="date" id="fechaFin" value={formData.fechaFin} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #D1D5DB' }} />
            </div>
          </div>
          <div>
            <label htmlFor="jefe">Jefe de Proyecto</label>
            <select id="jefe" value={formData.jefe} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #D1D5DB' }}>
              <option value="" disabled>Selecciona un jefe</option>
              <option value="Ana López">Ana López</option>
              <option value="Juan Pérez">Juan Pérez</option>
              <option value="Carlos Ruiz">Carlos Ruiz</option>
            </select>
          </div>
          <div>
            <label htmlFor="descripcion">Descripción</label>
            <textarea id="descripcion" value={formData.descripcion} onChange={handleChange} rows={3} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #D1D5DB' }}></textarea>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button type="button" onClick={onClose} className="button" style={{ backgroundColor: '#E5E7EB', color: '#374151' }}>Cancelar</button>
            <button type="submit" className="button" style={{ backgroundColor: '#2563EB', color: 'white' }}>Guardar Proyecto</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- 4. COMPONENTE PRINCIPAL ---
const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
// FILTRO DE TABLA
  const [filter, setFilter] = useState<'Todos' | 'Líder' | 'Colaborador' | 'Activo' | 'Finalizado'>('Todos');
  const filteredProjects = projects.filter(p => {
    if (filter === 'Todos') return true;
    if (filter === 'Líder') return p.rol === 'Líder';
    if (filter === 'Colaborador') return p.rol === 'Colaborador';
    if (filter === 'Activo') return p.estado === 'Activo';
    if (filter === 'Finalizado') return p.estado === 'Finalizado';
    return true;
  });
  // --- ACTUALIZAR PROYECTO NUEVO ---
  const handleSaveProject = (data: NewProjectData) => {
    const newProject: Project = {
      nombre: data.nombre,
      fechas: `${data.fechaInicio} – ${data.fechaFin}`,
      rol: 'Líder', // Por defecto quien crea es Líder
      jefe: data.jefe,
      estado: 'Activo', // Por defecto activo
      progreso: 0,      // Inicio 0%
      equipo: 1,        // Inicialmente 1 miembro
    };
    setProjects(prev => [...prev, newProject]);
    setIsModalOpen(false);
  };

  // --- CONTADORES DINÁMICOS ---
  const totalProjects = projects.length;
  const myProjects = projects.filter(p => p.rol === 'Líder').length;
  const collaboratorProjects = projects.filter(p => p.rol === 'Colaborador').length;
  const activeProjects = projects.filter(p => p.estado === 'Activo').length;
  const finishedProjects = projects.filter(p => p.estado === 'Finalizado').length;

  return (
    <div className="body">
      <header className="header">
        <div>Logo</div>
        <div>Mi Perfil</div>
      </header>

      <aside className="sidebar">
        <nav>
          <p style={{ fontWeight: 600, borderLeft: '4px solid #FF7B00', paddingLeft: '0.5rem' }}>Proyectos</p>
          {['Planificación','Colaboración','Repositorio','IA Predictiva','Panel Analítico','Configuración'].map(i => <p key={i}>{i}</p>)}
        </nav>
      </aside>

      <main className="main">
        <h1>Gestión de Proyectos</h1>
        <button className="button" onClick={handleOpenModal}>Nuevo Proyecto</button>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem', marginBottom: '2rem' }}>
  <StatCard title="Mis Proyectos" count={myProjects} color="#FF7B00" bgColor="#FFE5D9" icon={<span>📁</span>} onClick={() => setFilter('Líder')} />
  <StatCard title="Como Colaborador" count={collaboratorProjects} color="#A855F7" bgColor="#EDE5FF" icon={<span>👥</span>} onClick={() => setFilter('Colaborador')} />
  <StatCard title="Activos" count={activeProjects} color="#16A34A" bgColor="#DCFCE7" icon={<span>✅</span>} onClick={() => setFilter('Activo')} />
  <StatCard title="Finalizados" count={finishedProjects} color="#4B5563" bgColor="#F3F4F6" icon={<span>🏁</span>} onClick={() => setFilter('Finalizado')} />
</div>


        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>PROYECTO</th>
                <th>ROL</th>
                <th>JEFE</th>
                <th>ESTADO</th>
                <th>PROGRESO</th>
                <th>EQUIPO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((p,i) => <ProjectRow key={i} project={p} />)}
            </tbody>
          </table>
        </div>
      </main>

      <ProjectModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveProject} />
    </div>
  );
}

export default App;
