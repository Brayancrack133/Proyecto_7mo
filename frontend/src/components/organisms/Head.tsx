import './Head.css'
// 1. Importamos el hook para acceder a los datos globales
import { useUser } from '../../context/UserContext';

const Header = () => {
    // 2. "Sacamos" al usuario de la nube (Contexto)
    const { usuario } = useUser();

    return (
        <div className='headcontent'>
            <img
                className="futurep"
                src="/Frame 3 1.png"
                alt="Logo FuturePlan"
            />
            <div className='datcont'>
                <div className='ussrname'>
                    {/* 3. Aquí hacemos la magia: Si hay usuario, mostramos Nombre + Apellido */}
                    <p className='usnm'>
                        {usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Cargando...'}
                    </p>
                    <p className='profile'>Mi Perfil</p>
                </div>
                <img
                    className="avatar"
                    src="/avatar.png"
                    alt="Avatar Usuario"
                />
            </div>
        </div>
    )
}

export default Header