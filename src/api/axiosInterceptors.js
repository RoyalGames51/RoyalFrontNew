import axios from 'axios';

/**
 * Interceptor global de respuestas de axios.
 *
 * Cuando el backend responde 401 (JWT expirado, inválido o ausente) en cualquier
 * request de una sesión activa, limpiamos la sesión y avisamos al resto de la app
 * mediante el evento `auth:session-expired`. Esto evita que el usuario quede con la
 * UI a medio cargar o viendo fallos silenciosos hasta que recarga a mano.
 *
 * El AuthProvider (src/context/oauthContext.jsx) escucha ese evento y se encarga
 * del logout visible + redirect al login.
 */

// Endpoints donde un 401 es una respuesta ESPERADA que el componente ya maneja
// (credenciales incorrectas, token de Google inválido, etc.). No son "sesión expirada".
const AUTH_ENDPOINTS_IGNORED = ['/auth/login', '/auth/google', '/signup'];

// Evita que un aluvión de requests fallando a la vez dispare N avisos / N redirects.
let handlingSessionExpiry = false;

const isIgnoredAuthEndpoint = (url = '') =>
  AUTH_ENDPOINTS_IGNORED.some((endpoint) => url.includes(endpoint));

export function setupAxiosInterceptors() {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status;
      const url = error?.config?.url || '';
      const hasSession = !!localStorage.getItem('token');

      if (
        status === 401 &&
        hasSession &&
        !isIgnoredAuthEndpoint(url) &&
        !handlingSessionExpiry
      ) {
        handlingSessionExpiry = true;

        // Limpieza inmediata del token/header para que ningún request posterior
        // salga con credenciales ya rechazadas.
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        delete axios.defaults.headers.common['Authorization'];

        window.dispatchEvent(new CustomEvent('auth:session-expired'));

        // Se libera el flag tras un momento: el AuthProvider ya habrá hecho el
        // redirect, y si el usuario vuelve a loguearse el interceptor queda sano.
        setTimeout(() => {
          handlingSessionExpiry = false;
        }, 3000);
      }

      // Siempre se propaga: los `.catch` locales siguen ejecutándose igual.
      return Promise.reject(error);
    },
  );
}
