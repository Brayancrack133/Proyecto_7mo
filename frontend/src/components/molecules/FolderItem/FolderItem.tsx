import React from 'react';
import styles from './FolderItem.module.css';
import { Icon } from '../../atoms/Icon/Icon'; // Icono de carpeta

interface FolderItemProps {
  name: string;
  description: string;
  lastUpdate: string;
  onClick: () => void;
}

export const FolderItem: React.FC<FolderItemProps> = ({ name, description, lastUpdate, onClick }) => {
  return (
    <div className={styles.item} onClick={onClick}>
      <Icon name="folder" size={24} className={styles.folderIcon} />
      <div className={styles.info}>
        <p className={styles.name}>**{name}**</p>
        <p className={styles.description}>{description}</p>
        <p className={styles.updateTime}>{lastUpdate}</p>
      </div>
      <Icon name="chevronRight" size={16} className={styles.arrow} />
    </div>
  );
};