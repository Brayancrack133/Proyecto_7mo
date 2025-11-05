import { FaUser, FaDatabase, FaKey } from "react-icons/fa";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">🌿 FuturePlan</div>
      <nav className="sidebar-nav">
        <ul>
          <li className="active"><FaUser /> Usuarios</li>
          <li><FaKey /> Roles</li>
          <li><FaDatabase /> Permisos</li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <button className="light-btn">Modo Claro</button>
      </div>
    </aside>
  );
}
