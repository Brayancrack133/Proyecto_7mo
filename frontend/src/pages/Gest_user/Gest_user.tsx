import { useState, useEffect } from "react";
import { FaPlus, FaSyncAlt, FaCheck, FaTimes, FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/molecules/Sidebar";
import "./Gest_user.css";

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  ci: string;
  rol: string;
  estado: string;
  foto?: string;
}

interface Rol {
  id: number;
  nombre: string;
  descripcion: string;
}

export default function Gest_user() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [filtro, setFiltro] = useState("Habilitados");
  const [vista, setVista] = useState<"usuarios" | "roles">("usuarios");

  const [modalOpen, setModalOpen] = useState(false);
  const [modo, setModo] = useState<"ver" | "editar" | "agregar">("ver");
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);
  const [rolSeleccionado, setRolSeleccionado] = useState<Rol | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Datos simulados iniciales
    const user = localStorage.getItem("usuario");
    if (!user) navigate("/");
  
    setUsuarios([
      { id: 1, nombre: "Alex Apaza", email: "alex@gmail.com", ci: "172728237", rol: "Administrador del Sistema", estado: "Habilitado", foto: "/avatar1.jpg" },
      { id: 2, nombre: "Thalia Flores", email: "thalia@gmail.com", ci: "13150932", rol: "Integrantes del Equipo", estado: "Deshabilitado", foto: "/avatar2.jpg" },
    ]);

    setRoles([
      { id: 1, nombre: "Administrador del Sistema", descripcion: "Acceso total al sistema" },
      { id: 2, nombre: "Jefe de Proyecto", descripcion: "Gestiona los módulos principales y usuarios" },
      { id: 3, nombre: "Integrantes del Equipo", descripcion: "Acceso a tareas asignadas" },
      { id: 4, nombre: "Cliente / Usuario Final", descripcion: "Uso limitado del sistema" },
    ]);
  }, [navigate]);

  const usuariosFiltrados = usuarios.filter((u) =>
    filtro === "Habilitados" ? u.estado === "Habilitado" : u.estado === "Deshabilitado"
  );

  const abrirModalUsuario = (usuario: Usuario | null, tipo: "ver" | "editar" | "agregar") => {
    setUsuarioSeleccionado(usuario);
    setModo(tipo);
    setModalOpen(true);
  };

  const abrirModalRol = (rol: Rol | null, tipo: "agregar" | "editar") => {
    setRolSeleccionado(rol);
    setModo(tipo);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setUsuarioSeleccionado(null);
    setRolSeleccionado(null);
  };

  const guardarUsuario = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const nuevoUsuario: Usuario = {
      id: usuarioSeleccionado?.id || usuarios.length + 1,
      nombre: data.get("nombre") as string,
      email: data.get("email") as string,
      ci: data.get("ci") as string,
      rol: data.get("rol") as string,
      estado: "Habilitado",
      foto: "/avatar1.jpg",
    };

    if (modo === "agregar") {
      setUsuarios([...usuarios, nuevoUsuario]);
    } else if (modo === "editar" && usuarioSeleccionado) {
      setUsuarios(usuarios.map((u) => (u.id === usuarioSeleccionado.id ? nuevoUsuario : u)));
    }

    cerrarModal();
  };

  const guardarRol = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const nuevoRol: Rol = {
      id: rolSeleccionado?.id || roles.length + 1,
      nombre: data.get("nombre") as string,
      descripcion: data.get("descripcion") as string,
    };

    if (modo === "agregar") {
      setRoles([...roles, nuevoRol]);
    } else if (modo === "editar" && rolSeleccionado) {
      setRoles(roles.map((r) => (r.id === rolSeleccionado.id ? nuevoRol : r)));
    }

    cerrarModal();
  };

  const toggleEstadoUsuario = (id: number) => {
    setUsuarios(
      usuarios.map((u) =>
        u.id === id
          ? { ...u, estado: u.estado === "Habilitado" ? "Deshabilitado" : "Habilitado" }
          : u
      )
    );
  };

  const eliminarRol = (id: number) => {
    setRoles(roles.filter((r) => r.id !== id));
  };

  return (
    <div className="gest-container">
      <Sidebar setVista={setVista} vista={vista} />

      <main className="content">
        {vista === "usuarios" && (
          <>
            <div className="cabecera">
              <h1>Administración de Usuarios</h1>
              <div className="actions">
                
                <button className="btn agregar" onClick={() => abrirModalUsuario(null, "agregar")}>
                  <FaPlus /> Agregar Usuario
                </button>
                <button className="btn actualizar"><FaSyncAlt /> Actualizar</button>
              </div>
            </div>

            <div className="tabs">
              <div className={`tab ${filtro === "Habilitados" ? "active" : ""}`} onClick={() => setFiltro("Habilitados")}>Habilitados</div>
              <div className={`tab ${filtro === "Deshabilitados" ? "active" : ""}`} onClick={() => setFiltro("Deshabilitados")}>Deshabilitados</div>
            </div>
            {/* Barra de búsqueda (solo diseño) */}
<div className="search-bar">
  <input
    type="text"
    className="search-input"
    placeholder="🔍 Buscar usuario por nombre, email o rol..."
    disabled // solo diseño
  />
  <button className="btn-search" disabled>
    Buscar
  </button>
</div>


            <div className="table-container">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Foto</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>C.I.</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosFiltrados.map((u) => (
                    <tr key={u.id}>
                      <td><img src={u.foto} alt="" className="user-photo" /></td>
                      <td>{u.nombre}</td>
                      <td>{u.email}</td>
                      <td>{u.ci}</td>
                      <td>{u.rol}</td>
                      <td className="acciones">
                        <button className="ver" onClick={() => abrirModalUsuario(u, "ver")}><FaEye /></button>
                        <button className="editar" onClick={() => abrirModalUsuario(u, "editar")}><FaEdit /></button>
                        <button onClick={() => toggleEstadoUsuario(u.id)}>
                          {u.estado === "Habilitado" ? <FaTimes /> : <FaCheck />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {vista === "roles" && (
          <>
            <h1>Roles del Sistema</h1>
            <button className="btn agregar" onClick={() => abrirModalRol(null, "agregar")}>
              <FaPlus /> Agregar Rol
            </button>

            <div className="table-container">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((r) => (
                    <tr key={r.id}>
                      <td>{r.nombre}</td>
                      <td>{r.descripcion}</td>
                      <td>
                        <button className="editar" onClick={() => abrirModalRol(r, "editar")}><FaEdit /></button>
                        <button className="eliminar" onClick={() => eliminarRol(r.id)}><FaTrash /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>
                {modo === "agregar" && (vista === "usuarios" ? "Agregar Usuario" : "Agregar Rol")}
                {modo === "editar" && (vista === "usuarios" ? "Editar Usuario" : "Editar Rol")}
                {modo === "ver" && "Ver Usuario"}
              </h2>
              <button className="close-btn" onClick={cerrarModal}>×</button>
            </div>

            {vista === "usuarios" ? (
              <form onSubmit={guardarUsuario} className={`user-form ${modo === "ver" ? "readonly" : ""}`}>
                <div className="form-grid">
                  <label>Nombre <input name="nombre" defaultValue={usuarioSeleccionado?.nombre || ""} readOnly={modo === "ver"} /></label>
                  <label>Email <input name="email" defaultValue={usuarioSeleccionado?.email || ""} readOnly={modo === "ver"} /></label>
                  <label>C.I. <input name="ci" defaultValue={usuarioSeleccionado?.ci || ""} readOnly={modo === "ver"} /></label>
                  <label>Rol <input name="rol" defaultValue={usuarioSeleccionado?.rol || ""} readOnly={modo === "ver"} /></label>
                </div>

                {modo !== "ver" && (
                  <div className="modal-actions">
                    <button type="submit" className="btn agregar">
                      {modo === "agregar" ? "Guardar Usuario" : "Guardar Cambios"}
                    </button>
                  </div>
                )}
              </form>
            ) : (
              <form onSubmit={guardarRol}>
                <label>Nombre del Rol <input name="nombre" defaultValue={rolSeleccionado?.nombre || ""} required /></label>
                <label>Descripción <input name="descripcion" defaultValue={rolSeleccionado?.descripcion || ""} required /></label>
                <div className="modal-actions">
                  <button type="submit" className="btn agregar">
                    {modo === "agregar" ? "Guardar Rol" : "Guardar Cambios"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
