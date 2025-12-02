import './Head.css';
import { useUser } from '../../context/UserContext';
import { useState } from 'react';
import EditProfileModal from '../../components/molecules/EditProfileModal'; 

const Header = () => {
  const { usuario, login, logout } = useUser(); 
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Recibimos FormData en lugar de un objeto simple
  const handleUpdateProfile = async (formData: FormData) => {
    if (!usuario?.id) return;

    try {
        const response = await fetch(`http://localhost:3000/api/usuarios/${usuario.id}`, {
            method: 'PUT',
            body: formData,
        });

        if (!response.ok) throw new Error("Error al actualizar perfil");

        const dataActualizada = await response.json();

        const nuevoUsuario = { 
            ...usuario, 
            ...dataActualizada
        };
        
        login(nuevoUsuario); 
        alert("Perfil actualizado correctamente");

    } catch (error) {
        console.error(error);
        alert("Hubo un error al actualizar los datos.");
    }
  };

  const avatarSrc = usuario?.foto
    ? `http://localhost:3000${usuario.foto}` 
    : "/avatar.png";

  return (
    <>
        <header className="header-fancy">
        <div className="header-bubbles">
            <span></span><span></span><span></span>
            <span></span><span></span><span></span>
        </div>

        <div className="header-inner">
            <img className="futurep" src="/Frame 3 1.png" alt="Logo FuturePlan" />

            <div className="user-area">
            <div className="user-info">
                <p className="user-name">
                {usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Cargando...'}
                </p>
                <p 
                    className="profile-link" 
                    onClick={() => setIsModalOpen(true)}
                >
                    Mi Perfil
                </p>
            </div>

            <div className="user-menu" onClick={() => setOpen(!open)}>
                <img
                    className="avatar"
                    src={avatarSrc}
                    alt="Avatar Usuario"
                />
                
                {open && (
                <div className="dropdown">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsModalOpen(true);
                            setOpen(false);
                        }}
                    >
                        Editar Perfil
                    </button>
                    <a 
                        href="#" 
                        onClick={(e) => { 
                            e.preventDefault(); 
                            logout(); 
                        }}
                    >
                        Cerrar sesión
                    </a>
                </div>
                )}
            </div>
            </div>
        </div>
        </header>

        <EditProfileModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            currentUser={usuario}
            onSave={handleUpdateProfile}
        />
    </>
  );
};

export default Header;