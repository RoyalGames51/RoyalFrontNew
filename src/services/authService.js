import axios from 'axios';
import API_URL from '../api/rutaApi';

/**
 * Servicio centralizado de autenticación
 * Utiliza el backend NestJS en lugar de Firebase
 */
export const authService = {
  /**
   * Registra un nuevo usuario
   */
  signup: async (nick, email, password, sexo, referredByCode) => {
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        nick,
        email,
        password,
        sexo,
        ...(referredByCode ? { referredByCode } : {}),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Login con email y contraseña
   */
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      const { access_token, user } = response.data;

      // Guardar token y email en localStorage para persistencia.
      // El header Authorization lo adjunta el request interceptor global
      // (src/api/axiosInterceptors.js) leyendo este mismo token.
      localStorage.setItem('token', access_token);
      localStorage.setItem('userEmail', email);

      return { access_token, user };
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Login con Google (necesita ser implementado en el backend)
   * Por ahora es un placeholder para futuro
   */
  loginWithGoogle: async (googleToken) => {
    try {
      const response = await axios.post(`${API_URL}/auth/google`, {
        token: googleToken,
      });
      const { access_token, user } = response.data;

      localStorage.setItem('token', access_token);
      if (user && user.email) {
        localStorage.setItem('userEmail', user.email);
      }
      // El header Authorization lo adjunta el request interceptor global.

      return response.data; // Retornamos todo el response.data para tener access_token, user y firstChipsReceived
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },


  /**
   * Logout - limpia los datos locales
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
  },

  /**
   * Obtiene el token almacenado
   */
  getToken: () => localStorage.getItem('token'),

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated: () => !!localStorage.getItem('token'),

  /**
   * Limpia la sesión completamente (solo el token y header de auth)
   */
  clearSession: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
  },

  validateStoredSession: async () => {
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');

    if (!token || !userEmail) {
      authService.clearSession();
      return false;
    }

    try {
      // El header Authorization lo adjunta el request interceptor global.
      await axios.get(`${API_URL}/user-email?email=${encodeURIComponent(userEmail)}`);
      return true;
    } catch (error) {
      authService.clearSession();
      return false;
    }
  },
};
