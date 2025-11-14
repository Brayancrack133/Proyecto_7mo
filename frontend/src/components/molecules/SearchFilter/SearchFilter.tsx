import React, { useState } from 'react';
import styles from './SearchFilter.module.css';
import { Icon } from '../../atoms/Icon/Icon'; // Asumiendo un Icono de lupa
import { Input } from '../../atoms/Input/Input'; // Asumiendo un componente Input

interface SearchFilterProps {
  onSearch: (query: string) => void;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    // Podrías usar useDebounce aquí para optimizar la búsqueda (ver hooks/)
    // onSearch(newQuery); 
  };

  const handleSearchClick = () => {
    onSearch(query);
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchBox}>
        <Input
          type="text"
          placeholder="Buscar Documento"
          value={query}
          onChange={handleInputChange}
          className={styles.input}
        />
        <button className={styles.searchButton} onClick={handleSearchClick}>
          <Icon name="search" size={20} />
        </button>
      </div>
      {/* Aquí podrías añadir un botón de "Filtros Avanzados" si es necesario */}
    </div>
  );
};