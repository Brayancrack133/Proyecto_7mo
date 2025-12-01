import { Link } from "react-router-dom";
import "./Header.css";

interface UserData {
  nombre: string;
  apellido: string;
  foto?: string | null;
}

interface HeaderProps {
  u: UserData | null;
}

export default function Header({ u }: HeaderProps) {
  const userPhoto =
    u?.foto && u.foto !== ""
      ? u.foto
      : "/Images/User.png";

  return (
    <header className="header">
      <div className="header-left">
        <div className="loguito"><img  className="logoF" src="/Images/LogoF.png" alt="" /></div>
        

        <nav className="nav-links">
          
          <Link to="/proyectos">Mis Proyectos</Link>
          <Link to="/repositorio">Repositorio</Link>
        </nav>
      </div>

      <div className="header-right">
        <span className="user-name">
          {u ? `${u.nombre} ${u.apellido}` : "Mi cuenta"}
        </span>

        <img
          src={userPhoto}
          alt="Foto usuario"
          className="user-photo"
        />
      </div>
    </header>
  );
}
