// Si usas axios:
import axios from 'axios';

// Ajusta la URL base si es necesario
const API_URL = 'http://localhost:3000/api/proyectos-ia'; 

export const generarProyectoConIA = async (idea: string) => {
    try {
        const response = await axios.post(`${API_URL}/generar`, { idea });
        return response.data; // Aquí viene el JSON mágico
    } catch (error) {
        console.error("Error llamando a la IA:", error);
        throw error;
    }
};

// Mantenemos tu función de crear (guardar en BD)
export const crearProyectoEnBD = async (projectData: any) => {
     const response = await axios.post('http://localhost:3000/api/proyectos', projectData);
     return response.data;
};