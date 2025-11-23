import { FaUser, FaKey } from "react-icons/fa";
import "./Sidebar.css";

export default function Sidebar({ vista, setVista }: { vista: string; setVista: (v: "usuarios" | "roles") => void }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">FuturePlan</div>
      <nav className="sidebar-nav">
        <ul>
          <li className={vista === "usuarios" ? "active" : ""} onClick={() => setVista("usuarios")}>
            <FaUser /> <span>Usuarios</span>
          </li>
          <li className={vista === "roles" ? "active" : ""} onClick={() => setVista("roles")}>
            <FaKey /> <span>Roles</span>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
