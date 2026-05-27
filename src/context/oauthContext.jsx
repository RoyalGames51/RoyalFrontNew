import { useContext, createContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import { getUserByEmail } from "../redux/actions";
import { useDispatch } from "react-redux";

/**
 * Contexto de autenticación
 * Usa el backend NestJS en lugar de Firebase
 */
export const authContext = createContext();

/**
 * Hook para acceder al contexto de autenticación
 */
export const useAuth = () => {
    const context = useContext(authContext);
    if (!context) {
        throw new Error("useAuth debe estar dentro de AuthProvider");
    }
    return context;
};

/**
 * Proveedor del contexto de autenticación
 * Proporciona funciones de autenticación a todos los componentes
 */
export function AuthProvider({ children }) {
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    /**
     * Verifica si hay un token válido al cargar la aplicación
     * Si existe token, también carga los datos del usuario
     */
    useEffect(() => {
        const token = authService.getToken();
        const userEmail = localStorage.getItem('userEmail');
        
        if (token && userEmail) {
            setIsAuthenticated(true);
            // Cargar usuario desde Redux para poblar currentUser
            dispatch(getUserByEmail(userEmail));
        } else {
            setIsAuthenticated(false);
        }
        setLoading(false);
    }, [dispatch]);

    /**
     * Registra un nuevo usuario
     */
    const register = async (nick, email, password, sexo) => {
        try {
            const signupResult = await authService.signup(nick, email, password, sexo);
            const loginResult = await login(email, password);
            return { signup: signupResult, login: loginResult };
        } catch (error) {
            console.error("Error al registrar usuario:", error);
            throw error;
        }
    };

    /**
     * Login con email y contraseña
     */
    const login = async (email, password) => {
        try {
            const { access_token, user: userData } = await authService.login(email, password);
            setIsAuthenticated(true);
            
            // Cargar datos del usuario en Redux y usar el perfil actualizado
            const refreshedUser = await dispatch(getUserByEmail(email));
            setUser(refreshedUser || userData);
            
            return { access_token, user: refreshedUser || userData };
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            throw error;
        }
    };

    /**
     * Login con Google (implementar cuando el backend soporte)
     */
    const loginWithGoogle = async (googleToken) => {
        try {
            const { access_token, user: userData } = await authService.loginWithGoogle(googleToken);
            setIsAuthenticated(true);
            
            // Cargar datos del usuario en Redux y usar el perfil actualizado
            const refreshedUser = await dispatch(getUserByEmail(userData.email));
            setUser(refreshedUser || userData);
            
            return { access_token, user: refreshedUser || userData };
        } catch (error) {
            console.error("Error al iniciar sesión con Google:", error);
            throw error;
        }
    };

    /**
     * Cierra la sesión del usuario
     */
    const logOut = async () => {
        try {
            authService.logout();
            authService.clearSession();
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            throw error;
        }
    };

    const value = {
        register,
        login,
        loginWithGoogle,
        logOut,
        user,
        isAuthenticated,
        loading,
    };

    return (
        <authContext.Provider value={value}>
            {children}
        </authContext.Provider>
    );
}

