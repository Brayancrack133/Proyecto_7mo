import React, { useState, useEffect } from 'react';
import './EditProfileModal.css';

interface UserData {
    nombre: string;
    apellido: string;
    correo: string;
    foto?: File | null; // Agregamos campo para el archivo
}

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: any;
    onSave: (formData: FormData) => Promise<void>; // Ahora enviamos FormData
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, currentUser, onSave }) => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [correo, setCorreo] = useState('');
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen && currentUser) {
            setNombre(currentUser.nombre || '');
            setApellido(currentUser.apellido || '');
            setCorreo(currentUser.correo || '');
            // Si el usuario ya tiene foto, la mostramos (asegúrate de poner la URL base de tu backend)
            setPreview(currentUser.foto ? `http://localhost:3000${currentUser.foto}` : null);
            setFile(null);
        }
    }, [isOpen, currentUser]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile)); // Previsualización local
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        // Usamos FormData para enviar archivos + texto
        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('apellido', apellido);
        formData.append('correo', correo);
        // IMPORTANTE: Enviar el rol actual para no perderlo
        formData.append('id_rol', currentUser.rol === 'Administrador' ? '1' : '2'); 
        
        if (file) {
            formData.append('foto', file);
        }

        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="profile-modal-overlay" onClick={onClose}>
            <div className="profile-modal-content" onClick={e => e.stopPropagation()}>
                <div className="profile-modal-header">
                    <h3>Editar Mi Perfil</h3>
                    <button onClick={onClose} className="close-btn">×</button>
                </div>
                
                <form onSubmit={handleSubmit} className="profile-modal-body">
                    {/* Área de Foto */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #e2e8f0', marginBottom: '0.5rem' }}>
                            <img 
                                src={preview || "/avatar.png"} 
                                alt="Previsualización" 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        <label htmlFor="file-upload" style={{ cursor: 'pointer', color: '#2563eb', fontSize: '0.9rem', fontWeight: 600 }}>
                            Cambiar foto
                        </label>
                        <input 
                            id="file-upload" 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            style={{ display: 'none' }} 
                        />
                    </div>

                    <div className="form-group">
                        <label>Nombre</label>
                        <input value={nombre} onChange={e => setNombre(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Apellido</label>
                        <input value={apellido} onChange={e => setApellido(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Correo</label>
                        <input type="email" value={correo} onChange={e => setCorreo(e.target.value)} required />
                    </div>

                    <div className="profile-modal-footer">
                        <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
                        <button type="submit" disabled={isSaving} className="btn-save">
                            {isSaving ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;