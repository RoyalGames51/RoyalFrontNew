import axios from 'axios';
import API_URL from '../api/rutaApi';
import { tokenStore } from '../api/tokenStore';

/**
 * Servicio centralizado de autenticación
 * Utiliza el backend NestJS en lugar de Firebase
 *
 * Modelo de sesión: el access token (JWT corto) vive SOLO en memoria (tokenStore),
 * nunca en localStorage — así un XSS no puede robar una sesión de larga duración. La
 * sesión larga la sostiene un refresh token opaco en una cookie httpOnly que el
 * backend setea/lee solo (JS nunca lo toca); POST /auth/refresh la cambia por un
 * access token nuevo. Ver src/api/tokenStore.js y src/api/axiosInterceptors.js.
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
   * Login con email o nick + contraseña.
   * `identifier` puede ser un email o un nick: el backend resuelve nick→email
   * (así el front ya no necesita pedir el email de una cuenta antes de loguearse).
   */
  login: async (identifier, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        identifier,
        password,
      });
      const { access_token, user } = response.data;

      // El refresh token real llega como cookie httpOnly (lo setea el backend en la
      // respuesta; JS ni lo ve). Acá solo guardamos el access token, en memoria.
      tokenStore.set(access_token);

      return { access_token, user };
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Login con Google
   */
  loginWithGoogle: async (googleToken) => {
    try {
      const response = await axios.post(`${API_URL}/auth/google`, {
        token: googleToken,
      });
      const { access_token } = response.data;

      tokenStore.set(access_token);

      return response.data; // access_token, user y firstChipsReceived
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Refresca la sesión al arrancar la app (o cuando el interceptor detecta un 401):
   * cambia el refresh token de la cookie httpOnly por un access token nuevo.
   * Tira si no hay sesión (sin cookie, cookie vencida, o token ya rotado/robado).
   */
  refreshSession: async () => {
    const response = await axios.post(
      `${API_URL}/auth/refresh`,
      {},
      { headers: { 'X-Refresh': '1' } },
    );
    const { access_token } = response.data;
    tokenStore.set(access_token);
    return access_token;
  },

  /**
   * Logout: revoca el refresh token en el backend (best-effort) y limpia todo
   * localmente. Si la llamada al backend falla igual se cierra la sesión del lado
   * del cliente — no tiene sentido dejar al usuario "atrapado" logueado por un
   * error de red en el logout.
   */
  logout: async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`);
    } catch (error) {
      // No-op: igual limpiamos localmente abajo.
    }
    authService.clearSession();
  },

  /**
   * Obtiene el access token en memoria actual (o null si no hay sesión).
   */
  getToken: () => tokenStore.get(),

  /**
   * Verifica si hay un access token en memoria ahora mismo. No confirma que sea
   * válido contra el backend — para eso está refreshSession().
   */
  isAuthenticated: () => !!tokenStore.get(),

  /**
   * Limpia la sesión del lado del cliente, sin avisarle al backend. Usar cuando el
   * backend ya rechazó la sesión (401, refresh fallido) — llamar a logout() ahí
   * sería una llamada de más.
   */
  clearSession: () => {
    tokenStore.clear();
    // Limpieza de una key vieja de versiones anteriores de la app (localStorage
    // en vez de memoria) — inofensivo si ya no existe.
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
  },
};
