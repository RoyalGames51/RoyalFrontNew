import { useContext, createContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import { getUserByEmail } from "../redux/actions";
import { useDispatch } from "react-redux";
import axios from "axios";

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
// Helper para decodificar payloads de JWT de forma segura
const decodeJwt = (token) => {
    try {
        if (!token) return null;
        const parts = token.split('.');
        if (parts.length < 2) return null;
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Error decodificando JWT:", e);
        return null;
    }
};

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
        const restoreSession = async () => {
            const token = authService.getToken();
            let userEmail = localStorage.getItem('userEmail');

            // Si el token es inválido o no existe, limpiar sesión
            if (!token) {
                authService.clearSession();
                setIsAuthenticated(false);
                setUser(null);
                setLoading(false);
                return;
            }

            // Fallback robusto: si el email es nulo o el string "undefined", lo extraemos del JWT
            if (!userEmail || userEmail === "undefined") {
                const payload = decodeJwt(token);
                if (payload?.email) {
                    userEmail = payload.email;
                    localStorage.setItem('userEmail', userEmail);
                } else {
                    authService.clearSession();
                    setIsAuthenticated(false);
                    setUser(null);
                    setLoading(false);
                    return;
                }
            }

            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            const isValid = await authService.validateStoredSession();
            if (!isValid) {
                setIsAuthenticated(false);
                setUser(null);
                setLoading(false);
                return;
            }

            setIsAuthenticated(true);
            try {
                const refreshedUser = await dispatch(getUserByEmail(userEmail));
                setUser(refreshedUser || null);
            } catch (error) {
                authService.clearSession();
                setIsAuthenticated(false);
                setUser(null);
            }
            setLoading(false);
        };

        restoreSession();
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
     * Login con Google
     */
    const loginWithGoogle = async (googleToken) => {
        try {
            const { access_token, user: userData, firstChipsReceived } = await authService.loginWithGoogle(googleToken);
            setIsAuthenticated(true);

            // Obtener email con fallback robusto (userData -> localStorage -> JWT decoding)
            let email = userData?.email;
            if (!email || email === "undefined") {
                email = localStorage.getItem('userEmail');
            }
            if (!email || email === "undefined") {
                const payload = decodeJwt(access_token);
                email = payload?.email;
            }

            if (!email || email === "undefined") {
                throw new Error('No se pudo extraer el email del token de Google o del backend');
            }

            // Aseguramos que quede bien guardado en localStorage
            localStorage.setItem('userEmail', email);

            const refreshedUser = await dispatch(getUserByEmail(email));
            setUser(refreshedUser || userData);

            return { access_token, firstChipsReceived, user: refreshedUser || userData };
        } catch (error) {
            console.error('Error al iniciar sesión con Google:', error);
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

