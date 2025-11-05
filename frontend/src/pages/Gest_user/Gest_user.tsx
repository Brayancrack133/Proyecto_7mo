import { useState, useEffect } from "react";
import { FaPlus, FaSyncAlt } from "react-icons/fa";
import Sidebar from "../../components/molecules/Sidebar";
import Tabs from "../../components/molecules/Tabs";
import UserTable from "../../components/molecules/Usertable";
import "./Gest_user.css";

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  direccion: string;
  ci: string;
  rol: string;
  estado: string;
}

export default function Gest_user() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filtro, setFiltro] = useState("Aprobados");

  useEffect(() => {
    const datos: Usuario[] = [
      { id: 1, nombre: "Alex Apaza", email: "alex@gmail.com", direccion: "Cochabamba", ci: "172728237", rol: "Administrador", estado: "Aprobados" },
      { id: 2, nombre: "Thalia Flores", email: "thalia@gmail.com", direccion: "La Paz", ci: "13150932", rol: "Administrador", estado: "Aprobados" },
      { id: 3, nombre: "Jhon Rambo", email: "jhon@correo.com", direccion: "Santa Cruz", ci: "123123", rol: "Revisor BT", estado: "Rechazados" },
    ];
    setUsuarios(datos);
  }, []);

  const usuariosFiltrados = usuarios.filter((u) => u.estado === filtro);

  return (
    <div className="gest-container">
      <Sidebar />
      <main className="content">
        {/* Header */}
        <div className="header">
          <h1>Administración de Usuarios</h1>
          <div className="actions">
            <button className="btn agregar"><FaPlus /> Agregar</button>
            <button className="btn actualizar"><FaSyncAlt /> Actualizar</button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs filtro={filtro} setFiltro={setFiltro} />

        {/* Tabla */}
        <UserTable usuarios={usuariosFiltrados} />

        {/* Footer */}
        <div className="footer">
          <p>1 al {usuariosFiltrados.length} de {usuarios.length} registros</p>
          <div className="pagination">
            <button>«</button>
            <button className="active">1</button>
            <button>2</button>
            <button>»</button>
          </div>
        </div>
      </main>
    </div>
  );
}
