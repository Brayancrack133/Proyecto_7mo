import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Aseguramos que la interfaz coincida con lo que devuelve tu Backend
interface User {
    id_usuario: number; // Ojo: Verifica si tu backend devuelve "id" o "id_usuario"
    nombre: string;
    apellido: string;
    email: string; // O "correo", verifica tu respuesta del backend
    rol?: string; 
}

interface UserContextType {
    usuario: User | null;
    login: (userData: User) => void;
    logout: () => void;
    isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [usuario, setUsuario] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // ==================================================================
    // 1. EFECTO DE INICIO: RECUPERAR SESIÓN (PERSISTENCIA)
    // ==================================================================
    useEffect(() => {
        // Al cargar la página (F5), verificamos si hay un usuario guardado
        const usuarioGuardado = localStorage.getItem("usuario");
        
        if (usuarioGuardado) {
            try {
                const parsedUser = JSON.parse(usuarioGuardado);
                console.log("✅ Sesión recuperada del almacenamiento:", parsedUser);
                setUsuario(parsedUser);
            } catch (error) {
                console.error("Error al leer usuario del storage:", error);
                localStorage.removeItem("usuario"); // Si está corrupto, lo borramos
            }
        }
        setIsLoading(false);
    }, []);

    // ==================================================================
    // 2. FUNCIÓN LOGIN (CONECTA EL FORMULARIO CON REACT)
    // ==================================================================
    const login = (userData: User) => {
        // A. Guardamos en el estado de React (para que la UI se actualice al instante)
        setUsuario(userData);
        
        // B. Guardamos en el navegador (para que no se pierda al recargar)
        localStorage.setItem("usuario", JSON.stringify(userData));
    };

    // ==================================================================
    // 3. FUNCIÓN LOGOUT
    // ==================================================================
    const logout = () => {
        setUsuario(null);
        localStorage.removeItem("usuario");
        // Opcional: Redirigir al login aquí o manejarlo en la vista
        window.location.href = "/login"; 
    };

    return (
        <UserContext.Provider value={{ usuario, login, logout, isLoading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser debe usarse dentro de un UserProvider");
    }
    return context;
};