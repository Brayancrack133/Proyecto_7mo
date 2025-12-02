import React, { createContext, useContext, useState, ReactNode } from 'react';

// 1. Interfaz de Usuario
export interface User {
    id: number;
    nombre: string;
    apellido: string;
    correo: string;
    rol?: string;
    foto?: string;
}

interface UserContextType {
    usuario: User | null;
    login: (userData: User) => void;
    logout: () => void;
    isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    // 🚀 CAMBIO CLAVE: Leemos el localStorage DIRECTAMENTE al iniciar el estado.
    // Esto evita el parpadeo de "Cargando..." porque los datos ya están ahí al primer render.
    const [usuario, setUsuario] = useState<User | null>(() => {
        try {
            const usuarioGuardado = localStorage.getItem("usuario");
            return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
        } catch (error) {
            console.error("Error leyendo usuario del almacenamiento:", error);
            return null;
        }
    });

    // Ya no necesitamos un useEffect para cargar datos, ni el estado de loading inicial
    // (a menos que quieras validar el token con el backend, pero para mostrar datos locales esto basta)
    const [isLoading, setIsLoading] = useState(false); 

    const login = (userData: User) => {
        setUsuario(userData);
        localStorage.setItem("usuario", JSON.stringify(userData));
    };

    const logout = () => {
        setUsuario(null);
        localStorage.removeItem("usuario");
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
    if (!context) throw new Error("useUser debe usarse dentro de un UserProvider");
    return context;
};