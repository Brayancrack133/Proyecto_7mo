import { useState, useEffect, DependencyList } from 'react';

// T es el tipo de datos que esperamos (ej. RiskPrediction)
export const useFetch = <T>(
  // La función que llama a la API (ej. () => fetchProjectRisk(projectId))
  // O 'null' si no queremos que se ejecute
  fetchFunction: (() => Promise<T>) | null, 
  deps: DependencyList = [] // Las dependencias que reinician el hook (ej. [projectId])
) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Para 'limpiar' el estado si las dependencias cambian
    setData(null);
    setError(null);

    // Si la función es 'null', no hacemos nada (ej. el modal está cerrado)
    if (fetchFunction === null) {
      setIsLoading(false);
      return;
    }

    let isMounted = true; // Para evitar actualizaciones en un componente desmontado
    setIsLoading(true);

    fetchFunction()
      .then((responseData) => {
        if (isMounted) {
          setData(responseData);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    // Función de limpieza de useEffect
    return () => {
      isMounted = false;
    };
  }, deps); // Se vuelve a ejecutar si las dependencias cambian

  return { data, isLoading, error };
};