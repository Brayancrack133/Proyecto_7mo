import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 1. INTERFAZ CORREGIDA (Coincide con tu LocalStorage real)
export interface User {
    id: number;        // <-- CAMBIO CRÍTICO: Antes era 'id_usuario'
    nombre: string;
    apellido: string;
    correo: string;    // <-- CAMBIO: Antes era 'email'
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

    useEffect(() => {
        const usuarioGuardado = localStorage.getItem("usuario");
        if (usuarioGuardado) {
            try {
                const parsedUser = JSON.parse(usuarioGuardado);
                console.log("✅ Sesión recuperada:", parsedUser);
                setUsuario(parsedUser);
            } catch (error) {
                console.error("Error leyendo usuario:", error);
                localStorage.removeItem("usuario");
            }
        }
        setIsLoading(false);
    }, []);

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