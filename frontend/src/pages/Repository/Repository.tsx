import React, { useState } from 'react';
import { DashboardLayout } from '../../components/templates/DashboardLayout';
import { SearchFilter } from '../../components/molecules/SearchFilter/SearchFilter';
import { FolderItem } from '../../components/molecules/FolderItem/FolderItem';
import { ExternalRepoItem } from '../../components/molecules/ExternalRepoItem/ExternalRepoItem';
import { Button } from '../../components/atoms/Button';
import { Icon } from '../../components/atoms/Icon/Icon';
import styles from './Repository.module.css';
import { UploadModal } from '../../components/organisms/UploadModal';


// Datos de ejemplo simulando la carga de la API (services/document.service.ts)
const mockFolders = [
    { name: "Propuestas 2025", description: "Último integrado: 'Revisión de código'", update: "Hace 5 min" },
    { name: "Diseño UX/UI", description: "Último integrado: 'Revisión de código'", update: "Hace 5 min" },
    { name: "Documentación Técnica", description: "Último integrado: 'Revisión de código'", update: "Hace 5 min" },
];

const mockExternalRepos = [
    { id: '1', name: "GIT HUB", type: 'GITHUB', repoUrl: "futureplan/alxnda-dsghdshd", lastCommitMessage: "Fix 5: AXM", lastSync: "Hace 5 min" },
    { id: '2', name: "GIT LAB", type: 'GITLAB', repoUrl: "futureplan/pasodelsdshj", lastCommitMessage: "Fix 4: AXM", lastSync: "Hace 5 min" },
];

export const Repository: React.FC = () => {
    const [isUploading, setIsUploading] = useState(false);

    const handleSearch = (query: string) => {
        console.log("Búsqueda avanzada para:", query);
        // Lógica para llamar a document.service.ts y filtrar
    };

    const handleFolderClick = (name: string) => {
        console.log("Navegar a carpeta:", name);
        // Lógica para cambiar la vista y cargar los documentos dentro de la carpeta
    };

    const handleUploadSuccess = () => {
        // Se llama después de una subida exitosa.
        setIsUploading(false);
        console.log("Subida exitosa, lista de documentos actualizada.");
    };

    return (
        // DashboardLayout proporciona la barra lateral y el encabezado
        <DashboardLayout>
            <div className={styles.repositoryContent}>

                {/* Encabezado de Acciones (Botones de la Imagen 2) */}
                <div className={styles.actionHeader}>
                    <Button
                        onClick={() => setIsUploading(true)}
                        variant="primary"
                        className={styles.uploadButton}
                    >
                        <Icon name="upload" size={18} /> Subir Archivo
                    </Button>
                    <Button variant="secondary" className={styles.headerButton}>
                        <Icon name="document" size={18} /> Documentos
                    </Button>
                    <Button variant="secondary" className={styles.headerButton}>
                        <Icon name="git" size={18} /> Integrar Rep
                    </Button>
                    <div className={styles.rightIcons}>
                        <Icon name="download" size={20} className={styles.iconAction} />
                        <Icon name="trash" size={20} className={styles.iconAction} />
                    </div>
                </div>

                {/* Componente de Búsqueda (RF44) */}
                <SearchFilter onSearch={handleSearch} />

                {/* Sección de Carpetas (RF40) */}
                <h3 className={styles.sectionTitle}><Icon name="folder" size={20} /> Carpetas</h3>
                <div className={styles.folderList}>
                    {mockFolders.map(folder => (
                        <FolderItem
                            key={folder.name}
                            name={folder.name}
                            description={folder.description}
                            lastUpdate={folder.update}
                            onClick={() => handleFolderClick(folder.name)}
                        />
                    ))}
                </div>

                {/* Sección de Repositorios Externos */}
                <h3 className={styles.sectionTitle}><Icon name="git" size={20} /> Repositorios Externos</h3>
                <div className={styles.externalRepoList}>
                    {mockExternalRepos.map(repo => (
                        <ExternalRepoItem
                            key={repo.id}
                            repo={repo as any}
                        />
                    ))}
                </div>
            </div>

            {isUploading && (
                <UploadModal
                    isOpen={isUploading}
                    onClose={() => setIsUploading(false)}
                    onUploadSuccess={handleUploadSuccess}
                />
            )}
        </DashboardLayout>
    );
};