import React from 'react';
import styles from './Header.module.css';
import { Icon } from '../../atoms/Icon/Icon'; // Asumimos que Icon ya existe
// Aquí se importarían NavItem, Button, etc., si fueran necesarios

export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        {/* Usando el icono de la 'F' de Future Plan */}
        <Icon name="logo" size={30} className={styles.logoIcon} /> 
      </div>

      {/* Navegación Principal: Inicio, Mis Proyectos, Administración, etc. */}
      <nav className={styles.navMenu}>
        <a href="/inicio" className={styles.navItem}>Inicio</a>
        <a href="/nosotros" className={styles.navItem}>Nosotros</a>
        <a href="/misproyectos" className={styles.navItem}>Mis Proyectos</a>
        <a href="/administracion" className={styles.navItem}>Administración</a>
      </nav>

      {/* Perfil de Usuario */}
      <div className={styles.userSection}>
        <Icon name="search" size={20} className={styles.searchIcon} />
        <span className={styles.adminText}>ADMIN</span>
        <div className={styles.profileInfo}>
          <span className={styles.profileName}>Hi Perfil</span>
          {/*  */}
          <Icon name="user" size={24} className={styles.profileAvatar} />
        </div>
      </div>
    </header>
  );
};