import React from 'react';
import styles from './ExternalRepoItem.module.css';
import { ExternalRepository } from '../../../types/document.types';
import { Icon } from '../../atoms/Icon/Icon';

interface ExternalRepoItemProps {
  repo: ExternalRepository;
}

export const ExternalRepoItem: React.FC<ExternalRepoItemProps> = ({ repo }) => {
  const getIconName = (type: string) => {
    if (type === 'GITHUB') return 'github';
    if (type === 'GITLAB') return 'gitlab';
    return 'code';
  };

  return (
    <div className={styles.item}>
      <Icon name={getIconName(repo.type)} size={20} className={styles.icon} />
      <div className={styles.info}>
        <p className={styles.name}>**{repo.type}** | {repo.repoUrl}</p>
        <p className={styles.lastCommit}>
          Último commit: **{repo.lastCommitMessage}**
        </p>
        <p className={styles.status}>Sincronizado: {repo.lastSync}</p>
      </div>
    </div>
  );
};