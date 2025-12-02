import './Head.css'
import { useUser } from '../../context/UserContext';

const Header = () => {
    const { usuario } = useUser();

    return (
        <header className="header-fancy">

            {/* Capa de burbujas */}
            <div className="header-bubbles">
                <span></span><span></span><span></span>
                <span></span><span></span><span></span>
            </div>

            {/* CONTENIDO PRINCIPAL */}
            <div className="header-inner">
                <img
                    className="futurep"
                    src="/Frame 3 1.png"
                    alt="Logo FuturePlan"
                />

                <div className="user-area">
                    <div className="user-info">
                        <p className="user-name">
                            {usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Cargando...'}
                        </p>
                        <p className="profile-link">Mi Perfil</p>
                    </div>

                    <img
                        className="avatar"
                        src="/avatar.png"
                        alt="Avatar Usuario"
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;
