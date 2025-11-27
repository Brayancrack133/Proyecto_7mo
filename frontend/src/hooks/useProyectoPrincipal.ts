import { useState, useEffect } from 'react';

// Interfaz que coincide con los campos de la tabla proyecto_principal y el JOIN
export interface ProyectoPrincipal {
    id_analisis: number;
    nombre_proyecto: string;
    fecha_inicio: string;
    fecha_fin?: string; // Puede ser null en la BD
    
    // Campos de Metodología (vienen del JOIN en el backend)
    metodologia_id: number;
    nombre_metodologia: string; 

    // Campos opcionales de análisis
    tipo_proyecto?: string;
    tamano_complejidad?: string;
    descripcion?: string;
    sugerencia_ia?: string; // 🔥 Campo clave que faltaba antes
    
    fecha_creacion?: string;
}

export const useProyectoPrincipal = (id: string | undefined) => {
    const [proyecto, setProyecto] = useState<ProyectoPrincipal | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // Estado para capturar errores

    useEffect(() => {
        // Solo ejecutamos la petición si existe un ID válido
        if (id) {
            setLoading(true);
            setError(null); // Reiniciamos el error antes de la nueva petición

            fetch(`http://localhost:3000/api/proyecto-principal/${id}`)
                .then(res => {
                    if (!res.ok) {
                        // Si el servidor devuelve 404, es que no existe el proyecto
                        if (res.status === 404) throw new Error("El proyecto solicitado no existe.");
                        // Cualquier otro error (500, etc.)
                        throw new Error(`Error del servidor: ${res.status} ${res.statusText}`);
                    }
                    return res.json();
                })
                .then((data: ProyectoPrincipal) => { // Tipamos la respuesta
                    setProyecto(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("❌ Error en useProyectoPrincipal:", err);
                    // Guardamos el mensaje de error para mostrarlo en la UI si queremos
                    setError(err instanceof Error ? err.message : "Error desconocido al cargar el proyecto");
                    setLoading(false);
                });
        } else {
            // Si no hay ID (por ejemplo, carga inicial sin parámetros), paramos el loading
            setLoading(false);
        }
    }, [id]); // Se vuelve a ejecutar solo si cambia el ID

    return { proyecto, loading, error };
};