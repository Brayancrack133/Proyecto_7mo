import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";

import SearchBar from "../../components/molecules/buscadorbar";
import UserTable from "../../components/molecules/Usertable";
import UserForm from "../../components/molecules/Userform";

import RoleTable from "../../components/molecules/Roletable";
import RoleForm from "../../components/molecules/RoleForm";
import Header from "../../components/organisms/Header/Header";

import {
  getUsuarios,
  buscarUsuarios,
  crearUsuario,
  editarUsuario,
  cambiarEstadoUsuario,
} from "../../services/user.service";

import {
  getRoles,
  crearRol,
  editarRol,
  eliminarRol,
} from "../../services/role.service";

import "./Gest_user.css";

// ------------------ COMPONENTE PRINCIPAL ------------------
export default function GestUserPage() {
  // USUARIOS
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [usuarioActual, setUsuarioActual] = useState<any | null>(null);
  const [modoUsuario, setModoUsuario] = useState<"agregar" | "editar" | "ver">(
    "ver"
  );
  const [modalUsuario, setModalUsuario] = useState(false);

  // ROLES
  const [roles, setRoles] = useState<any[]>([]);
  const [modalRol, setModalRol] = useState(false);
  const [modoRol, setModoRol] = useState<"agregar" | "editar">("agregar");
  const [rolActual, setRolActual] = useState<any | null>(null);

  // CARGAR INICIAL
  useEffect(() => {
    cargarUsuarios();
    cargarRoles();
  }, []);

  const cargarUsuarios = async () => {
    const data = await getUsuarios();
    setUsuarios(data);
  };

  const cargarRoles = async () => {
    const data = await getRoles();
    setRoles(data);
  };

  // ------------------ BUSCAR USUARIO ------------------
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (busqueda.trim() === "") {
        cargarUsuarios();
      } else {
        const data = await buscarUsuarios(busqueda);
        setUsuarios(data);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [busqueda]);

  // ------------------ CRUD USUARIOS ------------------
  const abrirAgregarUsuario = () => {
    setModoUsuario("agregar");
    setUsuarioActual(null);
    setModalUsuario(true);
  };

  const abrirEditarUsuario = (u: any) => {
    setModoUsuario("editar");
    setUsuarioActual(u);
    setModalUsuario(true);
  };

  const abrirVerUsuario = (u: any) => {
    setModoUsuario("ver");
    setUsuarioActual(u);
    setModalUsuario(true);
  };

  const submitUsuario = async (data: any) => {
    if (modoUsuario === "agregar") {
      await crearUsuario(data);
    } else if (modoUsuario === "editar") {
      await editarUsuario(usuarioActual.id, data);
    }

    setModalUsuario(false);
    cargarUsuarios();
  };

  const toggleEstado = async (id: number) => {
    try {
      if (!id && id !== 0) {
        console.warn("toggleEstado: id inválido", id);
        return;
      }
      await cambiarEstadoUsuario(id);
      await cargarUsuarios();
    } catch (err) {
      console.error("Error cambiando estado:", err);
      alert("Error al cambiar estado del usuario. Revisa consola.");
    }
  };

  // ------------------ CRUD ROLES ------------------
  const abrirAgregarRol = () => {
    setModoRol("agregar");
    setRolActual(null);
    setModalRol(true);
  };

  const abrirEditarRol = (rol: any) => {
    setModoRol("editar");
    setRolActual(rol);
    setModalRol(true);
  };

  const submitRol = async (data: any) => {
    if (modoRol === "agregar") {
      await crearRol(data);
    } else {
      await editarRol(rolActual.id_rol, data);
    }

    setModalRol(false);
    cargarRoles();
  };

  const eliminarRolClick = async (id: number) => {
    await eliminarRol(id);
    cargarRoles();
  };

  // ------------------ VISTA PRINCIPAL ------------------
  return (
    <div>
      <Header u={null} /> 
    <div className="dashboard-container">
       
      <div className="dashboard-header">
        <h1>Gestión de Usuarios</h1>

        <button className="btn agregar" onClick={abrirAgregarUsuario}>
          <FaPlus /> Agregar Usuario
        </button>

        <button className="btn agregar" onClick={abrirAgregarRol}>
          <FaPlus /> Agregar Rol
        </button>
      
</div>
      <SearchBar value={busqueda} onChange={setBusqueda} />

      {/* TABLA DE USUARIOS */}
      <UserTable
        usuarios={usuarios}
        onView={abrirVerUsuario}
        onEdit={abrirEditarUsuario}
        onToggle={toggleEstado}
      />

      {/* ROLES */}
      <div className="dashboard-header" style={{ marginTop: "40px" }}>
        <h2>Roles</h2>
      </div>

      <RoleTable
        roles={roles}
        onEdit={abrirEditarRol}
        onDelete={eliminarRolClick}
      />

      {/* MODAL USUARIOS */}
      {modalUsuario && (
        <div className="modal">
          <div className="modal-content">
            <h2>
              {modoUsuario === "agregar"
                ? "Agregar Usuario"
                : modoUsuario === "editar"
                ? "Editar Usuario"
                : "Información del Usuario"}
            </h2>

            <UserForm
              modo={modoUsuario}
              usuario={usuarioActual}
              roles={roles}
              onSubmit={submitUsuario}
            />

            <button className="modal-close" onClick={() => setModalUsuario(false)}>
              X
            </button>
          </div>
        </div>
      )}

      {/* MODAL ROLES */}
      {modalRol && (
        <div className="modal">
          <div className="modal-content">
            <h2>{modoRol === "agregar" ? "Agregar Rol" : "Editar Rol"}</h2>

            <RoleForm modo={modoRol} rol={rolActual} onSubmit={submitRol} />

            <button className="modal-close" onClick={() => setModalRol(false)}>
              X
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
