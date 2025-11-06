import { FaUser, FaDatabase, FaKey } from "react-icons/fa";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">FuturePlan</div>
      <nav className="sidebar-nav">
        <ul>
          <li className="active">
  <FaUser /> <span>Usuarios</span>
</li>
<li>
  <FaKey /> <span>Roles</span>
</li>
<li>
  <FaDatabase /> <span>Permisos</span>
</li>
        </ul>
      </nav>
      
    </aside>
  );
}
