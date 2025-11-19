import axios from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

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
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Crear instancia Axios
export const api: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor de respuesta con manejo seguro
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('❌ Error del servidor:', error.response.data);
        return Promise.reject(error.response.data);
      } else if (error.request) {
        console.error('⚠️ Error de red:', error.message);
      } else {
        console.error('🚫 Error de configuración:', error.message);
      }
    } else {
      console.error('🧩 Error desconocido:', error);
    }

    return Promise.reject(error);
  }
);

export default api;

