// Usamos la instancia 'api' configurada por tus compañeros
// (Esto es mejor porque ya trae la URL base y seguramente los headers de auth)
import api from "./api"; 

// 1. TU FUNCIÓN DE IA (Adaptada a la instancia api)
export const generarProyectoConIA = async (idea: string) => {
    try {
        // Nota: Como 'api' ya tiene la base (ej: /api), solo ponemos el resto
        const response = await api.post("/proyectos-ia/generar", { idea });
        return response.data;
    } catch (error) {
        console.error("Error llamando a la IA:", error);
        throw error;
    }
};

// 2. FUNCIÓN DE CREAR PROYECTO (Unificada)
// Renombramos 'crearProyectoEnBD' a 'crearProyecto' para seguir el estándar del equipo
export const crearProyecto = async (projectData: any) => {
    // Usamos api.post en lugar de axios.post directo
    const response = await api.post("/proyectos", projectData);
    return response.data;
};

// Mantenemos el alias por compatibilidad si algún archivo tuyo viejo lo busca
export const crearProyectoEnBD = crearProyecto;

// 3. FUNCIÓN DE TUS COMPAÑEROS (Metodologías)
export const listarMetodologias = async () => {
    const res = await api.get("/metodologias"); // Asumiendo que esta ruta existe
    return res.data;
};

export const desglosarTareaConIA = async (titulo: string, descripcion: string) => {
    try {
        // NOTA: La URL correcta es /proyectos-ia/desglosar-tarea
        // (Porque en index.ts definiste: app.use("/api/proyectos-ia", ...))
        const response = await api.post("/proyectos-ia/desglosar-tarea", { 
            titulo_tarea: titulo,
            descripcion_tarea: descripcion 
        });
        return response.data;
    } catch (error) {
        console.error("Error al desglosar tarea:", error);
        throw error;
    }
};