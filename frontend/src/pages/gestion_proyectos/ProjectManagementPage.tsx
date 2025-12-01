import React, { useState, FormEvent, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import "./ProjectManagementPage.css";
import EmptyProjectsState from "../../components/templates/Proyecto_vacio/Proyecto_vacio";

// --- TIPOS ---
interface ProjectUI {
  id: string;
  nombre: string;
  descripcion: string;
  fechas: string;
  fechaInicioRaw: string;
  fechaFinRaw: string;
  rol: string; // Cambiado a string general para evitar conflictos
  jefe: string;
  estado: "Activo" | "Finalizado";
  progreso: number;
  equipo: number;
}

interface ProjectDB {
  id_proyecto: number;
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  rol: string;
  nombre_jefe: string;
  estado_calculado: "Activo" | "Finalizado";
  cantidad_miembros: number;
}

interface ProjectFormData {
  id?: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  descripcion: string;
}

// --- COMPONENTES UI ---

const ProjectRow: React.FC<{
  project: ProjectUI;
  onView: (id: string) => void;
  onEdit: (project: ProjectUI) => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
}> = ({ project, onView, onEdit, onToggleStatus }) => {
  // Clases dinámicas
  const badgeClass =
    project.rol === "Colaborador" ? "badge colaborador" : "badge lider";
  const statusClass =
    project.estado === "Activo" ? "badge activo" : "badge finalizado";

  const progressValue =
    project.estado === "Finalizado" ? 100 : project.progreso;
  const progressColor = progressValue === 100 ? "#2563eb" : "#f97316";

  return (
    <tr>
      <td>
        <p className="cell-title">{project.nombre}</p>
        <p className="cell-subtitle">{project.fechas}</p>
      </td>
      <td>
        <span className={badgeClass}>{project.rol}</span>
      </td>
      <td className="cell-title" style={{ fontSize: "0.9rem" }}>
        {project.jefe || "Sin asignar"}
      </td>
      <td>
        <span className={statusClass}>{project.estado}</span>
      </td>
      <td>
        <div className="progress-container">
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${progressValue}%`,
                backgroundColor: progressColor,
              }}
            ></div>
          </div>
          <span className="progress-text">{progressValue}%</span>
        </div>
      </td>
      <td style={{ fontWeight: "600" }}>{project.equipo} miembros</td>

      {/* ACCIONES */}
      <td>
        <div className="actions-cell">
          <button
            onClick={() => onView(project.id)}
            title="Ver Detalles"
            className="action-btn view"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>

          {/* MODIFICADO: Mostramos botones siempre para que puedas probar.
               En producción, descomenta la condición del rol.
            */}
          {/* {project.rol === 'Líder' && ( */}
          <>
            <button
              onClick={() => onEdit(project)}
              title="Editar Proyecto"
              className="action-btn edit"
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>

            <button
              onClick={() => onToggleStatus(project.id, project.estado)}
              title={
                project.estado === "Activo"
                  ? "Finalizar Proyecto"
                  : "Reactivar Proyecto"
              }
              className={`action-btn ${
                project.estado === "Activo" ? "delete" : "activate"
              }`}
            >
              {project.estado === "Activo" ? (
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </button>
          </>
          {/* )} */}
        </div>
      </td>
    </tr>
  );
};

// ... [El Modal y StatCard se mantienen igual que la versión anterior, el CSS nuevo se encargará de estilizarlos] ...
// Para ahorrar espacio aquí, asumo que usas los mismos componentes StatCard, FilterPill y ProjectModal del código anterior.
// Si necesitas el código del Modal nuevamente, avísame.

// Reutilizamos el Modal del código anterior, el CSS nuevo lo arreglará visualmente.
const ProjectModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProjectFormData) => Promise<void>;
  initialData?: ProjectFormData | null;
}> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    nombre: "",
    fechaInicio: "",
    fechaFin: "",
    descripcion: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && initialData) setFormData(initialData);
    else
      setFormData({
        nombre: "",
        fechaInicio: "",
        fechaFin: "",
        descripcion: "",
      });
  }, [isOpen, initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {initialData ? "Editar Proyecto" : "Nuevo Proyecto"}
          </h3>
          <button onClick={onClose} className="close-btn">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label htmlFor="nombre">Nombre del Proyecto</label>
            <input
              id="nombre"
              className="form-control"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Ej: Rediseño Web"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fechaInicio">Fecha Inicio</label>
              <input
                type="date"
                id="fechaInicio"
                className="form-control"
                value={formData.fechaInicio}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="fechaFin">Fecha Fin</label>
              <input
                type="date"
                id="fechaFin"
                className="form-control"
                value={formData.fechaFin}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              className="form-control"
              value={formData.descripcion}
              onChange={handleChange}
              rows={3}
              placeholder="Detalles del proyecto..."
            ></textarea>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="btn btn-primary"
            >
              {isSaving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  title: string;
  count: number;
  theme: "orange" | "purple" | "green" | "gray";
  icon: React.ReactNode;
  onClick: () => void;
}> = ({ title, count, theme, icon, onClick }) => (
  <div onClick={onClick} className={`stat-card stat-${theme}`}>
    <div>
      <p className="stat-title">{title}</p>
      <p className="stat-count">{count}</p>
    </div>
    <div className="stat-icon">{icon}</div>
  </div>
);

const FilterPill: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`filter-pill ${isActive ? "active" : "inactive"}`}
  >
    {label}
  </button>
);

// --- COMPONENTE PRINCIPAL ---

const ProjectManagementPage: React.FC = () => {
  const { usuario } = useUser();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectFormData | null>(
    null
  );
  const [projects, setProjects] = useState<ProjectUI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [filter, setFilter] = useState<
    "Todos" | "Líder" | "Colaborador" | "Activo" | "Finalizado"
  >("Todos");
  const [searchTerm, setSearchTerm] = useState("");

  const handleOpenCreateModal = useCallback(() => {
    setEditingProject(null);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => setIsModalOpen(false), []);

  const fetchProjects = useCallback(async () => {
    if (!usuario?.id) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:3000/api/mis-proyectos/${usuario.id}`
      );
      if (!response.ok) throw new Error("Error al conectar con el servidor");

      const dataDB: ProjectDB[] = await response.json();

      const projectsFormatted: ProjectUI[] = dataDB.map((p) => ({
        id: p.id_proyecto.toString(),
        nombre: p.nombre,
        descripcion: p.descripcion || "",
        fechaInicioRaw: p.fecha_inicio ? p.fecha_inicio.split("T")[0] : "",
        fechaFinRaw: p.fecha_fin ? p.fecha_fin.split("T")[0] : "",
        fechas: `${new Date(p.fecha_inicio).toLocaleDateString()} - ${new Date(
          p.fecha_fin
        ).toLocaleDateString()}`,
        rol: p.rol,
        jefe: p.nombre_jefe,
        estado: p.estado_calculado,
        progreso: 0,
        equipo: p.cantidad_miembros,
      }));

      setProjects(projectsFormatted);
    } catch (err) {
      console.error(err);
      setError(
        "Error cargando proyectos. Verifica que el backend esté corriendo."
      );
    } finally {
      setIsLoading(false);
    }
  }, [usuario?.id]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // --- LÓGICA DE FILTRADO (CORREGIDA) ---
  const filteredProjects = projects.filter((p) => {
    let passesFilter = true;
    if (filter === "Líder") passesFilter = p.rol === "Líder";
    else if (filter === "Colaborador") passesFilter = p.rol === "Colaborador";
    else if (filter === "Activo") passesFilter = p.estado === "Activo";
    else if (filter === "Finalizado") passesFilter = p.estado === "Finalizado";

    if (!passesFilter) return false;

    if (searchTerm === "") return true;

    // BÚSQUEDA SEGURA: Usamos || "" para evitar error si p.jefe es null
    const term = searchTerm.toLowerCase();
    return (
      (p.nombre || "").toLowerCase().includes(term) ||
      (p.jefe || "").toLowerCase().includes(term)
    );
  });

  // --- ACCIONES ---
  const handleViewProject = (id: string) => navigate(`/proyecto/${id}`);

  const handleEditProject = (project: ProjectUI) => {
    setEditingProject({
      id: project.id,
      nombre: project.nombre,
      descripcion: project.descripcion,
      fechaInicio: project.fechaInicioRaw,
      fechaFin: project.fechaFinRaw,
    });
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nuevoEstado = currentStatus === "Activo" ? "finalizar" : "activar";
    if (!window.confirm(`¿Seguro que deseas ${nuevoEstado} este proyecto?`))
      return;

    try {
      await fetch(`http://localhost:3000/api/proyectos/${id}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion: nuevoEstado }),
      });
      await fetchProjects();
    } catch (error) {
      alert("Error al actualizar estado");
    }
  };

  const handleSaveProject = async (data: ProjectFormData) => {
    if (!usuario?.id) return;
    try {
      const isEdit = !!data.id;
      const url = isEdit
        ? `http://localhost:3000/api/proyectos/${data.id}`
        : "http://localhost:3000/api/proyectos";

      const method = isEdit ? "PUT" : "POST";
      const payload: any = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        fecha_inicio: data.fechaInicio,
        fecha_fin: data.fechaFin,
      };

      if (!isEdit) {
        payload.id_jefe = usuario.id;
        payload.tipo = "Desarrollo Web";
        payload.tamano = "Mediano";
        payload.complejidad = "Media";
      }

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al guardar");

      handleCloseModal();
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert("Error al guardar el proyecto.");
    }
  };

  const stats = {
    myProjects: projects.filter((p) => p.rol === "Líder").length,
    collaboratorProjects: projects.filter((p) => p.rol === "Colaborador")
      .length,
    activeProjects: projects.filter((p) => p.estado === "Activo").length,
    finishedProjects: projects.filter((p) => p.estado === "Finalizado").length,
  };

  return (
    <div className="project-page-container">
      <header className="page-header">
        <h1 className="page-title">Gestión de Proyectos</h1>
        <div className="header-actions">
          <button onClick={handleOpenCreateModal} className="btn btn-primary">
            <span>+</span> Nuevo
          </button>
          <button
            onClick={() => navigate("/proyecto-principal")}
            className="btn btn-gradient"
          >
            <span>✨</span> Crear con IA
          </button>
        </div>
      </header>

      <div className="stats-grid">
        <StatCard
          title="Mis Proyectos"
          count={stats.myProjects}
          theme="orange"
          icon={<span>📁</span>}
          onClick={() => setFilter("Líder")}
        />
        <StatCard
          title="Colaborador"
          count={stats.collaboratorProjects}
          theme="purple"
          icon={<span>👥</span>}
          onClick={() => setFilter("Colaborador")}
        />
        <StatCard
          title="Activos"
          count={stats.activeProjects}
          theme="green"
          icon={<span>✅</span>}
          onClick={() => setFilter("Activo")}
        />
        <StatCard
          title="Finalizados"
          count={stats.finishedProjects}
          theme="gray"
          icon={<span>🏁</span>}
          onClick={() => setFilter("Finalizado")}
        />
      </div>

      <div className="main-card">
        <div className="controls-bar">
          <h2 className="section-title">Lista de Proyectos</h2>
          <div className="filter-group">
            {["Todos", "Líder", "Colaborador", "Activo", "Finalizado"].map(
              (f) => (
                <FilterPill
                  key={f}
                  label={f}
                  isActive={filter === f}
                  onClick={() => setFilter(f as any)}
                />
              )
            )}
          </div>
          <input
            type="text"
            placeholder="Buscar proyecto o jefe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* ESTADO VACÍO: si NO hay proyectos → muestra el mensaje de bienvenida */}
        {!isLoading && !error && projects.length === 0 && (
          <EmptyProjectsState />
        )}

        {/* LISTA DE PROYECTOS: si existen → muestra tabla y stats */}
        {!isLoading && !error && projects.length > 0 && (
          <div className="table-responsive">
            <table className="project-table">
              <thead>
                <tr>
                  <th>Proyecto</th>
                  <th>Rol</th>
                  <th>Jefe</th>
                  <th>Estado</th>
                  <th>Progreso</th>
                  <th>Equipo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((p) => (
                    <ProjectRow
                      key={p.id}
                      project={p}
                      onView={handleViewProject}
                      onEdit={handleEditProject}
                      onToggleStatus={handleToggleStatus}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="empty-msg">
                      No se encontraron proyectos con ese filtro.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProject}
        initialData={editingProject}
      />
    </div>
  );
};

export default ProjectManagementPage;
