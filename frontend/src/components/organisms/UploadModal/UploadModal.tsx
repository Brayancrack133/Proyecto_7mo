import React, { useState } from 'react';
import { Modal } from '../../molecules/Modal/Modal'; // Asumimos un componente Modal
import { Input } from '../../atoms/Input';
import { Button } from '../../atoms/Button';
import styles from './UploadModal.module.css';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Propuestas'); // RF40
  const [accessLevel, setAccessLevel] = useState('restricted'); // RF45
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    setIsSubmitting(true);
    
    // Aquí iría la llamada a document.service.ts
    // const success = await documentService.uploadFile(file, title, category, accessLevel);
    
    // Simulación de carga
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    
    setIsSubmitting(false);
    
    // if (success) {
        onUploadSuccess(); // Actualiza la lista de documentos en Repository.tsx
        onClose();
        console.log("Archivo subido con éxito:", title);
    // }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Subir Nuevo Documento">
      <form onSubmit={handleSubmit} className={styles.form}>
        
        {/* Título del Documento */}
        <label className={styles.label}>Título del Documento:</label>
        <Input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Ej: Reporte Final - Q3 2025"
          required
        />
        
        {/* Selección de Archivo (RF39) */}
        <label className={styles.label}>Seleccionar Archivo:</label>
        <Input 
          type="file" 
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          required
        />

        {/* Categoría (RF40) */}
        <label className={styles.label}>Carpeta / Categoría:</label>
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          className={styles.select}
        >
          <option value="Propuestas">Propuestas 2025</option>
          <option value="Diseño UX/UI">Diseño UX/UI</option>
          <option value="Documentación Técnica">Documentación Técnica</option>
          <option value="Otro">Otro</option>
        </select>

        {/* Nivel de Acceso (RF45) */}
        <label className={styles.label}>Nivel de Acceso:</label>
        <select 
          value={accessLevel} 
          onChange={(e) => setAccessLevel(e.target.value)}
          className={styles.select}
        >
          <option value="restricted">Restringido (Solo Equipo)</option>
          <option value="private">Privado (Solo Responsable)</option>
          <option value="public">Público (Todos)</option>
        </select>

        <Button type="submit" disabled={isSubmitting || !file || !title} className={styles.submitButton}>
          {isSubmitting ? 'Subiendo...' : 'Confirmar Subida'}
        </Button>
      </form>
    </Modal>
  );
};