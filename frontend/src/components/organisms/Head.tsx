import './Head.css'
// 1. Importamos el hook para acceder a los datos globales
import { useUser } from '../../context/UserContext';
import { useState } from 'react';

const Header = () => {
    // 2. "Sacamos" al usuario de la nube (Contexto)
    const { usuario } = useUser();
    const [open, setOpen] = useState(false);
    return (
        <div className='headcontent'>
            <img
                className="futurep"
                src="/Frame 3 1.png"
                alt="Logo FuturePlan"
            />
            <div className='righthead'>
            <div className='datcont'>
                <div className='ussrname'>
                    {/* 3. Aquí hacemos la magia: Si hay usuario, mostramos Nombre + Apellido */}
                    <p className='usnm'>
                        {usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Cargando...'}
                    </p>
                    <p className='profile'>Mi Perfil</p>
                </div>
              
            </div>
            <div
          className="user-menu"
          onClick={() => setOpen(!open)}
        >
          <img
                    className="avatar"
                    src="/Images/User.png"
                    alt="Avatar Usuario"
                />

          {open && (
           <div className="dropdown">
  <a href="/login" >Cerrar sesión</a>
</div>

          )}
        </div>
        </div>
        </div>
    )
}

export default Header