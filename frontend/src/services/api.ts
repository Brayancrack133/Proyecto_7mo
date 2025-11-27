import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios'; // Eliminé AxiosError si no se usa explícitamente como tipo, pero puedes dejarlo.

// Permitir acceso a variables de entorno de Vite
declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}

// Usar variable de entorno o fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Crear instancia Axios
export const api: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  // ✅ CAMBIO REALIZADO: Aumentado a 60 segundos (60000ms)
  // Esto evita el error "timeout of 10000ms exceeded"
  timeout: 60000, 
});

// Interceptor de respuesta con manejo seguro
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Error del servidor:', error.response.data);
        return Promise.reject(error.response.data);
      } else if (error.request) {
        console.error('Error de red (o Timeout):', error.message);
      } else {
        console.error('Error de configuración:', error.message);
      }
    } else {
      console.error('Error desconocido:', error);
    }

    return Promise.reject(error);
  }
);

export default api;