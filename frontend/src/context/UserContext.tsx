// src/context/UserContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 1. Definimos la forma de nuestro usuario
interface User {
    id_usuario: number;
    nombre: string;
    apellido: string;
    email: string;
    rol?: string; // Opcional: si quieres guardar si es admin o user
}

// 2. Definimos qué funciones tendrá nuestro contexto
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
    // ZONA DE SIMULACIÓN (BORRAR ESTO CUANDO TENGAS LOGIN REAL)
    // ==================================================================
    useEffect(() => {
        // Simulamos que verificamos una sesión guardada o hacemos login automático
        const usuarioSimulado: User = {
            id_usuario: 1, // <--- Aquí cambiamos el ID para probar otros usuarios
            nombre: "Usuario",
            apellido: "Prueba",
            email: "test@futureplan.com",
            rol: "admin"
        };

        console.log("⚡ MODO DESARROLLO: Sesión simulada activa para ID:", usuarioSimulado.id_usuario);
        setUsuario(usuarioSimulado);
        setIsLoading(false);
    }, []);
    // ==================================================================


    // ==================================================================
    // ZONA FUTURA (DESCOMENTAR O USAR CUANDO TENGAS EL FORMULARIO DE LOGIN)
    // ==================================================================
    
    const login = (userData: User) => {
        // FUTURO: Aquí guardarías el token en localStorage
        // localStorage.setItem('token', 'token_que_viene_del_backend');
        setUsuario(userData);
    };

    const logout = () => {
        // FUTURO: Limpiar localStorage
        // localStorage.removeItem('token');
        setUsuario(null);
    };

    return (
        <UserContext.Provider value={{ usuario, login, logout, isLoading }}>
            {children}
        </UserContext.Provider>
    );
};

// Hook personalizado para usar el contexto fácil
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser debe usarse dentro de un UserProvider");
    }
    return context;
};