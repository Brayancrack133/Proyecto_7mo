import { useState } from "react";
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
  const [open, setOpen] = useState(false);

  const userPhoto =
    u?.foto && u.foto !== "" ? u.foto : "/Images/User.png";



  return (
    <header className="header">
      <div className="header-left">
        <img className="logoF" src="/Images/LogoF.png" alt="Logo" />
      </div>

      <div className="header-right">
        <span className="user-name">
          {u ? `${u.nombre} ${u.apellido}` : "Mi cuenta"}
        </span>

        <div
          className="user-menu"
          onClick={() => setOpen(!open)}
        >
          <img src={userPhoto} className="user-photo" alt="Usuario" />

          {open && (
           <div className="dropdown">
  <a href="/login" className="logout-btn">Cerrar sesión</a>
</div>

          )}
        </div>
      </div>
    </header>
  );
}
