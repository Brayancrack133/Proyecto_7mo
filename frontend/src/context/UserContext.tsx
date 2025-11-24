import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 1. Definimos la forma de nuestro usuario
interface User {
    id_usuario: number;
    nombre: string;
    apellido: string;
    email: string;
    rol?: string; 
}

// 2. Definimos qué funciones tendrá nuestro contexto (listo para el futuro)
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
    // ZONA DE SIMULACIÓN (ESTO ES LO QUE ELIMINARÁS CUANDO TENGAS LOGIN)
    // ==================================================================
    useEffect(() => {
        // Simulamos que el Backend nos respondió "Login Exitoso" con estos datos
        // que COINCIDEN con lo que insertaste en MySQL (ID 1 = Andrés)
        const usuarioSimulado: User = {
            id_usuario: 1, 
            nombre: "Andrés",
            apellido: "Castillo",
            email: "andres@futureplan.com",
            rol: "usuario"
        };

        console.log("⚡ MODO DESARROLLO: Sesión simulada activa para ID:", usuarioSimulado.id_usuario);
        setUsuario(usuarioSimulado);
        setIsLoading(false);
    }, []);
    // ==================================================================chupala frailex


    // ==================================================================
    // ZONA FUTURA (ESTO YA ESTÁ LISTO PARA USARSE)
    // ==================================================================
    const login = (userData: User) => {
        // En el futuro, cuando tengas tu formulario de Login:
        // 1. El usuario pone sus datos.
        // 2. El backend responde con el objeto de usuario.
        // 3. Tú llamas a esta función: login(datosDelBackend).
        
        // Opcional: Guardar token en localStorage aquí
        // localStorage.setItem('token', '...');
        
        setUsuario(userData);
    };

    const logout = () => {
        // Opcional: Limpiar token
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