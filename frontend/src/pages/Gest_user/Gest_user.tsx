import { useState, useEffect } from "react";
import { FaPlus, FaSyncAlt, FaCheck, FaTimes, FaEdit, FaEye, FaTrash } from "react-icons/fa";
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
const [modalOpen, setModalOpen] = useState(false);
const [modo, setModo] = useState<"ver" | "editar" | "agregar">("ver");
const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);

  
  useEffect(() => {
    setUsuarios([
      { id: 1, nombre: "Alex Apaza", email: "alex@gmail.com", ci: "172728237", rol: "Admin", estado: "Habilitado", foto: "/avatar1.jpg" },
      { id: 2, nombre: "Thalia Flores", email: "thalia@gmail.com", ci: "13150932", rol: "Editor", estado: "Deshabilitado", foto: "/avatar2.jpg" },
    ]);

    setRoles([
      { id: 1, nombre: "Administrador", descripcion: "Acceso total al sistema" },
      { id: 2, nombre: "Revisor", descripcion: "Puede revisar contenidos" },
    ]);
  }, []);

  const usuariosFiltrados = usuarios.filter(u => 
    filtro === "Habilitados" ? u.estado === "Habilitado" : u.estado === "Deshabilitado"
  );
  
const abrirModal = (usuario: Usuario | null, tipo: "ver" | "editar" | "agregar") => {
  setUsuarioSeleccionado(usuario);
  setModo(tipo);
  setModalOpen(true);
};

const cerrarModal = () => {
  setModalOpen(false);
  setUsuarioSeleccionado(null);
};

  return (
    <div className="gest-container">
      <Sidebar />
      <main className="content">

        <div className="cabecera">
          <h1>Administración de Usuarios</h1>
          <div className="actions">
            <button className="btn agregar" onClick={() => abrirModal(null, "agregar")}>
  <FaPlus /> Agregar Usuario
</button>

            <button className="btn actualizar"><FaSyncAlt /> Actualizar</button>
          </div>
        </div>

        <div className="tabs">
          <div className={`tab ${filtro === "Habilitados" ? "active" : ""}`} onClick={() => setFiltro("Habilitados")}>Habilitados</div>
          <div className={`tab ${filtro === "Deshabilitados" ? "active" : ""}`} onClick={() => setFiltro("Deshabilitados")}>Deshabilitados</div>
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
              {usuariosFiltrados.map(u => (
                <tr key={u.id}>
                  <td><img src={u.foto} alt="" className="user-photo" /></td>
                  <td>{u.nombre}</td>
                  <td>{u.email}</td>
                  <td>{u.ci}</td>
                  <td>{u.rol}</td>
                  <td className="acciones">
  <button className="ver" onClick={() => abrirModal(u, "ver")}><FaEye /></button>
  <button className="editar" onClick={() => abrirModal(u, "editar")}><FaEdit /></button>
  {u.estado === "Habilitado" ? (
    <button className="deshabilitar"><FaTimes /></button>
  ) : (
    <button className="habilitar"><FaCheck /></button>
  )}
</td>


                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="roles-title">Roles del Sistema</h2>
        <button className="btn agregar"><FaPlus /> Agregar Rol</button>

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
              {roles.map(r => (
                <tr key={r.id}>
                  <td>{r.nombre}</td>
                  <td>{r.descripcion}</td>
                  <td>
                    <button className="editar"><FaEdit /></button>
                    <button className="eliminar"><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      {modalOpen && (
  <div className="modal-overlay">
    <div className="modal-content">
      <div className="modal-header">
        <h2>
          {modo === "agregar" && "Agregar Usuario"}
          {modo === "editar" && "Editar Usuario"}
          {modo === "ver" && "Ver Usuario"}
        </h2>
        <button className="close-btn" onClick={cerrarModal}>×</button>
      </div>

      <form className={`user-form ${modo === "ver" ? "readonly" : ""}`}>
        <div className="form-photo">
          <img
            src={usuarioSeleccionado?.foto || "/default-avatar.png"}
            alt="Foto del usuario"
            className="user-avatar"
          />
          {modo !== "ver" && <input type="file" accept="image/*" />}
        </div>

        <div className="form-grid">
          <label>
            Primer Nombre
            <input type="text" defaultValue={usuarioSeleccionado?.nombre || ""} readOnly={modo === "ver"} />
          </label>
          <label>
            C.I.
            <input type="text" defaultValue={usuarioSeleccionado?.ci || ""} readOnly={modo === "ver"} />
          </label>
          <label>
            Email
            <input type="email" defaultValue={usuarioSeleccionado?.email || ""} readOnly={modo === "ver"} />
          </label>
          <label>
            Rol
            <input type="text" defaultValue={usuarioSeleccionado?.rol || ""} readOnly={modo === "ver"} />
          </label>
        </div>

        {modo !== "ver" && (
          <div className="modal-actions">
            <button type="submit" className="btn agregar">
              {modo === "agregar" ? "Guardar Usuario" : "Guardar Cambios"}
            </button>
          </div>
        )}
      </form>
    </div>
  </div>
)}

    </div>
  );
}
